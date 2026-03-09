import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// ─────────────────────────────────────────────
// SMART MATCH: Find best candidates for a requisition
// ─────────────────────────────────────────────

export async function smartMatch(requisitionId: string) {
  const requisition = await prisma.requisition.findUnique({
    where: { id: requisitionId },
    include: {
      role: { include: { taxonomyGroup: true } },
      project: { select: { title: true, format: true, locations: true } },
    },
  });

  if (!requisition) throw new Error("Requisition not found");

  // Find all role profiles matching the requisition's role
  const candidates = await prisma.roleProfile.findMany({
    where: {
      roleId: requisition.roleId,
      isPublic: true,
    },
    include: {
      user: { select: { name: true } },
      role: { select: { name: true, level: true } },
      availability: {
        where: {
          status: "AVAILABLE",
          ...(requisition.startDate ? { startDate: { lte: requisition.startDate } } : {}),
          ...(requisition.endDate ? { endDate: { gte: requisition.endDate } } : {}),
        },
      },
      _count: {
        select: {
          receivedEndorsements: true,
          projectAssignments: true,
          workedWithA: true,
          workedWithB: true,
        },
      },
    },
    take: 50,
  });

  if (candidates.length === 0) return { matches: [], reasoning: "No candidates found for this role." };

  const candidateSummaries = candidates.map((c) => ({
    id: c.id,
    name: c.user.name,
    displayName: c.displayName,
    bio: c.bio || "No bio provided",
    city: c.city,
    region: c.region,
    country: c.country,
    yearsExperience: c.yearsExperience,
    endorsements: c._count.receivedEndorsements,
    pastProjects: c._count.projectAssignments,
    connections: c._count.workedWithA + c._count.workedWithB,
    isAvailable: c.availability.length > 0,
  }));

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an AI assistant for FrameOne, an entertainment industry hiring platform.

A production is looking to fill this position:
- Role: ${requisition.role.name} (${requisition.role.level})
- Department: ${requisition.role.taxonomyGroup.name}
- Project: "${requisition.project.title}" (${requisition.project.format})
- Description: ${requisition.description}
- Location: ${JSON.stringify(requisition.locations || "Not specified")}
- Rate: ${requisition.rateMin || "Open"} - ${requisition.rateMax || "Open"} (${requisition.rateType})
- Dates: ${requisition.startDate?.toISOString().split("T")[0] || "TBD"} to ${requisition.endDate?.toISOString().split("T")[0] || "TBD"}

Here are the available candidates:
${JSON.stringify(candidateSummaries, null, 2)}

Rank the top candidates (up to 10) by fit. For each, provide:
1. Their profile ID
2. A match score (0-100)
3. A brief reasoning (1-2 sentences)

Consider: availability, location proximity, experience level, endorsement count, and bio relevance.

Return valid JSON in this format:
{
  "matches": [
    { "profileId": "...", "score": 95, "reasoning": "..." }
  ],
  "summary": "Brief overall assessment of the candidate pool"
}`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return { matches: [], reasoning: "Could not parse AI response" };
  } catch {
    return { matches: [], reasoning: "AI matching failed" };
  }
}

// ─────────────────────────────────────────────
// NATURAL LANGUAGE SEARCH
// ─────────────────────────────────────────────

export async function naturalLanguageSearch(query: string) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are a search query parser for FrameOne, an entertainment industry platform.

Parse this natural language search into structured filters:
"${query}"

Return valid JSON with these optional fields:
{
  "roleSlug": "string or null (e.g., 'director-of-photography', 'gaffer', 'editor')",
  "department": "string or null (e.g., 'camera-lighting-grip', 'above-the-line')",
  "location": "string or null (city or region)",
  "availableFrom": "ISO date string or null",
  "availableTo": "ISO date string or null",
  "level": "HOD, KEY, ASSISTANT, TRAINEE, PRINCIPAL, or null",
  "keywords": "string or null (any remaining search terms)",
  "intent": "hire, find_talent, find_crew, find_vendor, or browse"
}

Known role slugs: producer, executive-producer, director, screenwriter, line-producer, production-manager, first-assistant-director, director-of-photography, camera-operator, gaffer, key-grip, production-designer, costume-designer, hair-makeup-designer, production-sound-mixer, editor, colorist, casting-director, talent-agent, catering, craft-services, transportation-captain, equipment-rental, entertainment-lawyer

Known departments: above-the-line, production-office, assistant-directing, camera-lighting-grip, art-costume-hmu, sound, post-production, services-vendors, representation-legal

Only return the JSON, nothing else.`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return { keywords: query, intent: "browse" };
  } catch {
    return { keywords: query, intent: "browse" };
  }
}

// ─────────────────────────────────────────────
// AUTO-CATEGORIZE: Extract skills/tags from bio
// ─────────────────────────────────────────────

export async function extractProfileTags(bio: string, roleName: string) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Extract professional skills and tags from this entertainment industry professional's bio.

Role: ${roleName}
Bio: "${bio}"

Return valid JSON:
{
  "skills": ["list", "of", "technical", "skills"],
  "genres": ["list", "of", "genres", "if mentioned"],
  "tools": ["software", "equipment", "platforms"],
  "specialties": ["specific", "areas", "of", "expertise"],
  "experience_indicators": ["notable", "signals", "of", "experience level"]
}

Only extract what's actually mentioned or strongly implied. Don't fabricate.`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return { skills: [], genres: [], tools: [], specialties: [], experience_indicators: [] };
  } catch {
    return { skills: [], genres: [], tools: [], specialties: [], experience_indicators: [] };
  }
}

// ─────────────────────────────────────────────
// CREW RECOMMENDATIONS: Suggest hires based on network
// ─────────────────────────────────────────────

export async function getCrewRecommendations(userId: string, projectId: string) {
  // Get user's worked-with network
  const userProfiles = await prisma.roleProfile.findMany({
    where: { userId },
    select: { id: true },
  });
  const profileIds = userProfiles.map((p) => p.id);

  // Get people they've worked with
  const workedWith = await prisma.workedWithEdge.findMany({
    where: {
      OR: [
        { roleProfileAId: { in: profileIds } },
        { roleProfileBId: { in: profileIds } },
      ],
    },
    include: {
      roleProfileA: {
        include: {
          user: { select: { name: true } },
          role: { select: { name: true, slug: true } },
          _count: { select: { receivedEndorsements: true } },
        },
      },
      roleProfileB: {
        include: {
          user: { select: { name: true } },
          role: { select: { name: true, slug: true } },
          _count: { select: { receivedEndorsements: true } },
        },
      },
      project: { select: { title: true } },
    },
    take: 100,
  });

  // Get open requisitions for the project
  const requisitions = await prisma.requisition.findMany({
    where: { projectId, status: "OPEN" },
    include: { role: { select: { name: true, slug: true } } },
  });

  if (requisitions.length === 0 || workedWith.length === 0) {
    return { recommendations: [], reasoning: "Not enough data for recommendations yet." };
  }

  const networkSummary = workedWith.map((edge) => {
    const isA = profileIds.includes(edge.roleProfileAId);
    const other = isA ? edge.roleProfileB : edge.roleProfileA;
    return {
      name: other.user.name,
      role: other.role.name,
      roleSlug: other.role.slug,
      endorsements: other._count.receivedEndorsements,
      sharedProject: edge.project.title,
      profileId: other.id,
    };
  });

  const openRoles = requisitions.map((r) => ({
    requisitionId: r.id,
    role: r.role.name,
    roleSlug: r.role.slug,
  }));

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are a crew recommendation engine for FrameOne.

This user needs to fill these positions:
${JSON.stringify(openRoles, null, 2)}

Here are people from their professional network (people they've worked with before):
${JSON.stringify(networkSummary, null, 2)}

Recommend the best matches from their network for each open position. Prioritize:
1. Role match (their role matches the open position)
2. Endorsement count (more = more trusted)
3. Prior collaboration (worked together before = lower risk)

Return valid JSON:
{
  "recommendations": [
    {
      "requisitionId": "...",
      "profileId": "...",
      "name": "...",
      "role": "...",
      "score": 95,
      "reasoning": "Worked together on X, has Y endorsements, perfect role match"
    }
  ],
  "summary": "Overall network strength assessment"
}`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return { recommendations: [], reasoning: "Could not generate recommendations" };
  } catch {
    return { recommendations: [], reasoning: "AI recommendation failed" };
  }
}

// ─────────────────────────────────────────────
// ROLE SUGGESTION: Suggest roles during onboarding
// ─────────────────────────────────────────────

export async function suggestRoles(userDescription: string) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `A new user is signing up for FrameOne (entertainment industry platform) and described themselves as:
"${userDescription}"

Suggest the most relevant roles from this list. Return the slugs of the top 3-5 matching roles:

Above-the-Line: producer, executive-producer, director, screenwriter, development-producer, script-editor
Production Office: line-producer, production-manager, production-coordinator, production-accountant, production-assistant
Assistant Directing: first-assistant-director, second-assistant-director, floor-runner, script-supervisor
Camera/Lighting/Grip: director-of-photography, camera-operator, first-assistant-camera, digital-imaging-technician, gaffer, key-grip, video-assist-operator
Art/Costume/HMU: production-designer, art-director, set-decorator, props-master, costume-designer, hair-makeup-designer
Sound: production-sound-mixer, boom-operator
Post-Production: editor, post-production-supervisor, colorist
Services: catering, craft-services, transportation-captain, security, set-medic, equipment-rental
Representation: casting-director, talent-agent, talent-manager, entertainment-lawyer

Return valid JSON:
{
  "suggestions": [
    { "slug": "role-slug", "confidence": 0.95, "reasoning": "brief explanation" }
  ]
}`,
      },
    ],
  });

  try {
    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    return { suggestions: [] };
  } catch {
    return { suggestions: [] };
  }
}

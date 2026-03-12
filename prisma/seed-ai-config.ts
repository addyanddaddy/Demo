import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const aiConfigs = [
  {
    featureKey: "smart_match",
    displayName: "Smart Match",
    description: "AI-powered candidate matching for requisitions. Analyzes profiles, availability, endorsements, and experience to rank the best fits.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 2000,
    temperature: 0,
    attachedTo: ["/casting", "/projects"],
  },
  {
    featureKey: "nl_search",
    displayName: "Natural Language Search",
    description: "Converts natural language queries into structured search filters for discovering talent and crew.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 1000,
    temperature: 0,
    attachedTo: ["/discover"],
  },
  {
    featureKey: "categorize",
    displayName: "Auto-Categorization",
    description: "Extracts skills, genres, tools, and specialties from profile bios to auto-tag and categorize professionals.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 500,
    temperature: 0,
    attachedTo: ["/profile/edit", "/onboarding"],
  },
  {
    featureKey: "recommend",
    displayName: "Crew Recommendations",
    description: "Recommends crew members from a user's professional network based on open positions, past collaborations, and endorsements.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 1500,
    temperature: 0,
    attachedTo: ["/projects", "/dashboard"],
  },
  {
    featureKey: "suggest_roles",
    displayName: "Role Suggestions",
    description: "Suggests relevant industry roles during onboarding based on the user's self-description.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 500,
    temperature: 0,
    attachedTo: ["/onboarding"],
  },
  {
    featureKey: "pre_screen",
    displayName: "Pre-Screen Questions",
    description: "Generates relevant pre-screen questionnaire questions tailored to specific roles and job descriptions.",
    isEnabled: true,
    model: "claude-sonnet-4-20250514",
    maxTokens: 1000,
    temperature: 0,
    attachedTo: ["/casting"],
  },
];

async function main() {
  console.log("Seeding AI configs...");

  for (const config of aiConfigs) {
    await prisma.aIConfig.upsert({
      where: { featureKey: config.featureKey },
      update: {
        displayName: config.displayName,
        description: config.description,
        model: config.model,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
        attachedTo: config.attachedTo,
      },
      create: config,
    });
    console.log(`  Upserted: ${config.featureKey} (${config.displayName})`);
  }

  console.log("AI config seed complete.");
}

main()
  .catch((e) => {
    console.error("Error seeding AI configs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

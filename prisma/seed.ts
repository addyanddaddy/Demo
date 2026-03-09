import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAXONOMY_GROUPS = [
  { name: "Above-the-Line", slug: "above-the-line", description: "Creative and financial leadership that defines the project's direction", sortOrder: 1 },
  { name: "Production Office", slug: "production-office", description: "Logistics, staffing administration, reporting, and cost control", sortOrder: 2 },
  { name: "Assistant Directing", slug: "assistant-directing", description: "Scheduling, call sheets, set coordination, and safety", sortOrder: 3 },
  { name: "Camera / Lighting / Grip", slug: "camera-lighting-grip", description: "Image capture, lighting execution, and physical camera support", sortOrder: 4 },
  { name: "Art / Costume / HMU", slug: "art-costume-hmu", description: "Visual world-building and talent appearance", sortOrder: 5 },
  { name: "Sound", slug: "sound", description: "Production audio capture and sound design", sortOrder: 6 },
  { name: "Post-Production", slug: "post-production", description: "Narrative construction, VFX, and delivery readiness", sortOrder: 7 },
  { name: "Services & Vendors", slug: "services-vendors", description: "On-set services and external support", sortOrder: 8 },
  { name: "Representation & Legal", slug: "representation-legal", description: "Talent representation, casting, and legal services", sortOrder: 9 },
];

const ROLES: Array<{
  name: string;
  slug: string;
  description: string;
  level: "TRAINEE" | "ASSISTANT" | "KEY" | "HOD" | "PRINCIPAL";
  isVendorRole: boolean;
  groupSlug: string;
}> = [
  // Above-the-Line
  { name: "Producer", slug: "producer", description: "Principal project authority responsible for all aspects of production", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Executive Producer", slug: "executive-producer", description: "Oversees the project journey from script to screen", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Director", slug: "director", description: "Creative visionary who interprets the script and guides all creative departments", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Screenwriter", slug: "screenwriter", description: "Develops and writes screenplays, treatments, and story materials", level: "PRINCIPAL", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Development Producer", slug: "development-producer", description: "Finds and develops stories/scripts to production readiness", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Script Editor", slug: "script-editor", description: "Liaises between writer and production to improve scripts", level: "KEY", isVendorRole: false, groupSlug: "above-the-line" },

  // Production Office
  { name: "Line Producer", slug: "line-producer", description: "Hires crew, allocates budget, ensures filming is safe and on budget", level: "HOD", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Manager / UPM", slug: "production-manager", description: "Manages day-to-day logistics, schedules, resources, and personnel", level: "HOD", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Coordinator", slug: "production-coordinator", description: "Prepares and distributes crew lists, progress reports, and call sheets", level: "KEY", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Accountant", slug: "production-accountant", description: "Manages accounts, processes payments, ensures tax/employment compliance", level: "KEY", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Assistant / Runner", slug: "production-assistant", description: "Distributes paperwork, handles errands, provides general support", level: "TRAINEE", isVendorRole: false, groupSlug: "production-office" },

  // Assistant Directing
  { name: "First Assistant Director", slug: "first-assistant-director", description: "Plans filming schedule, breaks down script, manages the set", level: "HOD", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Second Assistant Director", slug: "second-assistant-director", description: "Organizes fittings/rehearsals, prepares call sheets, coordinates actors", level: "KEY", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Floor Runner / Set PA", slug: "floor-runner", description: "Supports AD team with on-set errands and logistics", level: "TRAINEE", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Script Supervisor", slug: "script-supervisor", description: "Monitors continuity and coverage, links director to editorial", level: "KEY", isVendorRole: false, groupSlug: "assistant-directing" },

  // Camera / Lighting / Grip
  { name: "Director of Photography", slug: "director-of-photography", description: "Defines photographic look, supervises camera/grip/lighting", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Camera Operator", slug: "camera-operator", description: "Plans movement, frames and composes shots", level: "KEY", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "First Assistant Camera", slug: "first-assistant-camera", description: "Manages camera crew, maintains cameras, executes focus", level: "ASSISTANT", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Digital Imaging Technician", slug: "digital-imaging-technician", description: "Manages digital workflow, ensures image pipeline integrity", level: "KEY", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Gaffer", slug: "gaffer", description: "Head of lighting — plans and executes on-set lighting", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Key Grip", slug: "key-grip", description: "Makes camera movement possible, plans rigging and support", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Video Assist Operator", slug: "video-assist-operator", description: "Assists with monitored playback and continuity", level: "ASSISTANT", isVendorRole: false, groupSlug: "camera-lighting-grip" },

  // Art / Costume / HMU
  { name: "Production Designer", slug: "production-designer", description: "Creates the visual world, coordinates all visual departments", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Art Director", slug: "art-director", description: "Interprets and operationalizes the production designer's vision", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Set Decorator", slug: "set-decorator", description: "Creates background environments — walls, floors, furniture", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Props Master", slug: "props-master", description: "Runs the property department — makes, stores, prepares props", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Costume Designer", slug: "costume-designer", description: "Designs, creates, and sources all costumes", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Hair & Makeup Designer", slug: "hair-makeup-designer", description: "Creates hair and makeup looks, recruits HMU team", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },

  // Sound
  { name: "Production Sound Mixer", slug: "production-sound-mixer", description: "Head of sound, responsible for all audio captured during filming", level: "HOD", isVendorRole: false, groupSlug: "sound" },
  { name: "Boom Operator", slug: "boom-operator", description: "Handles mic placement on set, operates boom pole", level: "ASSISTANT", isVendorRole: false, groupSlug: "sound" },

  // Post-Production
  { name: "Editor", slug: "editor", description: "Crafts the story from assembly through picture lock", level: "HOD", isVendorRole: false, groupSlug: "post-production" },
  { name: "Post-Production Supervisor", slug: "post-production-supervisor", description: "Manages post budget, schedules, vendors, and delivery", level: "HOD", isVendorRole: false, groupSlug: "post-production" },
  { name: "Colorist", slug: "colorist", description: "Performs color grading and correction for final look", level: "KEY", isVendorRole: false, groupSlug: "post-production" },

  // Services & Vendors
  { name: "Catering", slug: "catering", description: "Provides scheduled meals for cast and crew", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Craft Services", slug: "craft-services", description: "Provides continuous snacks and refreshment support", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Transportation Captain", slug: "transportation-captain", description: "Oversees movement of cast, crew, and equipment", level: "KEY", isVendorRole: false, groupSlug: "services-vendors" },
  { name: "Security", slug: "security", description: "Provides set and location security services", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Set Medic", slug: "set-medic", description: "Provides on-set medical support and first aid", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Equipment Rental", slug: "equipment-rental", description: "Provides camera, lighting, grip, and other equipment", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },

  // Representation & Legal
  { name: "Casting Director", slug: "casting-director", description: "Matches actors to roles, manages auditions", level: "HOD", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Talent Agent", slug: "talent-agent", description: "Represents and promotes clients, negotiates contracts", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Talent Manager", slug: "talent-manager", description: "Provides long-term career strategy and guidance", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Entertainment Lawyer", slug: "entertainment-lawyer", description: "Handles contracts, rights clearance, and legal compliance", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
];

async function main() {
  console.log("🎬 Seeding FrameOne database...\n");

  // Seed taxonomy groups
  console.log("📂 Creating taxonomy groups...");
  const groupMap = new Map<string, string>();

  for (const group of TAXONOMY_GROUPS) {
    const created = await prisma.taxonomyGroup.upsert({
      where: { slug: group.slug },
      update: { name: group.name, description: group.description, sortOrder: group.sortOrder },
      create: group,
    });
    groupMap.set(group.slug, created.id);
    console.log(`  ✓ ${group.name}`);
  }

  // Seed roles
  console.log("\n🎭 Creating roles...");
  for (const role of ROLES) {
    const taxonomyGroupId = groupMap.get(role.groupSlug);
    if (!taxonomyGroupId) {
      console.error(`  ✗ Group not found: ${role.groupSlug}`);
      continue;
    }

    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
        level: role.level,
        isVendorRole: role.isVendorRole,
        taxonomyGroupId,
      },
      create: {
        name: role.name,
        slug: role.slug,
        description: role.description,
        level: role.level,
        isVendorRole: role.isVendorRole,
        taxonomyGroupId,
      },
    });
    console.log(`  ✓ ${role.name} (${role.level})`);
  }

  console.log(`\n✅ Seeded ${TAXONOMY_GROUPS.length} groups and ${ROLES.length} roles.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

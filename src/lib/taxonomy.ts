export type TaxonomyGroupData = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type RoleData = {
  name: string;
  slug: string;
  description: string;
  level: "TRAINEE" | "ASSISTANT" | "KEY" | "HOD" | "PRINCIPAL";
  isVendorRole: boolean;
  groupSlug: string;
};

export type MembershipPlanData = {
  name: string;
  slug: string;
  tier: string;
  price: number;
  interval: "month";
  features: string[];
};

export const TAXONOMY_GROUPS: TaxonomyGroupData[] = [
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

export const ROLES: RoleData[] = [
  // Above-the-Line
  { name: "Producer", slug: "producer", description: "Principal project authority responsible for all aspects of production from development to distribution", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Executive Producer", slug: "executive-producer", description: "Oversees the project journey from script to screen, manages key relationships with commissioners and financiers", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Director", slug: "director", description: "Creative visionary who interprets the script and guides all creative departments", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Screenwriter", slug: "screenwriter", description: "Develops and writes screenplays, treatments, and story materials", level: "PRINCIPAL", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Development Producer", slug: "development-producer", description: "Finds and develops stories/scripts to commissioning and production readiness", level: "HOD", isVendorRole: false, groupSlug: "above-the-line" },
  { name: "Script Editor", slug: "script-editor", description: "Liaises between writer and production to improve scripts through structured feedback", level: "KEY", isVendorRole: false, groupSlug: "above-the-line" },

  // Production Office
  { name: "Line Producer", slug: "line-producer", description: "Hires crew, allocates budget, and ensures filming is safe, on budget, and on time", level: "HOD", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Manager / UPM", slug: "production-manager", description: "Manages day-to-day logistics, schedules, resources, and personnel", level: "HOD", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Coordinator", slug: "production-coordinator", description: "Prepares and distributes crew lists, progress reports, call sheets, and transport requirements", level: "KEY", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Accountant", slug: "production-accountant", description: "Manages accounts, processes payments, conducts payroll checks, and ensures tax/employment compliance", level: "KEY", isVendorRole: false, groupSlug: "production-office" },
  { name: "Production Assistant / Runner", slug: "production-assistant", description: "Distributes paperwork, handles errands, and provides general production support", level: "TRAINEE", isVendorRole: false, groupSlug: "production-office" },

  // Assistant Directing
  { name: "First Assistant Director", slug: "first-assistant-director", description: "Plans the filming schedule, breaks down the script, and manages the set during filming", level: "HOD", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Second Assistant Director", slug: "second-assistant-director", description: "Organizes fittings/rehearsals, prepares call sheets, and coordinates actor readiness", level: "KEY", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Floor Runner / Set PA", slug: "floor-runner", description: "Supports the AD team with on-set errands, messages, and logistics", level: "TRAINEE", isVendorRole: false, groupSlug: "assistant-directing" },
  { name: "Script Supervisor", slug: "script-supervisor", description: "Monitors continuity, coverage, and serves as the link between director and editorial", level: "KEY", isVendorRole: false, groupSlug: "assistant-directing" },

  // Camera / Lighting / Grip
  { name: "Director of Photography", slug: "director-of-photography", description: "Defines the photographic look, determines lighting and framing, supervises camera/grip/lighting departments", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Camera Operator", slug: "camera-operator", description: "Plans movement, frames and composes shots, coordinates with grips", level: "KEY", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "First Assistant Camera / Focus Puller", slug: "first-assistant-camera", description: "Manages camera crew, sets up and maintains cameras, executes focus", level: "ASSISTANT", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Digital Imaging Technician", slug: "digital-imaging-technician", description: "Manages digital workflow, advises on exposure/contrast, ensures image pipeline integrity", level: "KEY", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Gaffer", slug: "gaffer", description: "Head of lighting — plans and executes on-set lighting, responsible for electrical safety", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Key Grip", slug: "key-grip", description: "Makes camera movement physically possible, plans rigging and camera support execution", level: "HOD", isVendorRole: false, groupSlug: "camera-lighting-grip" },
  { name: "Video Assist Operator", slug: "video-assist-operator", description: "Assists director and script supervisor with monitored playback and continuity", level: "ASSISTANT", isVendorRole: false, groupSlug: "camera-lighting-grip" },

  // Art / Costume / HMU
  { name: "Production Designer", slug: "production-designer", description: "Creates the visual world of the production, coordinates all visual departments", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Art Director", slug: "art-director", description: "Interprets and operationalizes the production designer's vision", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Set Decorator", slug: "set-decorator", description: "Creates background environments — walls, floors, furniture, vehicles", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Props Master", slug: "props-master", description: "Runs the property department — makes, stores, transports, and prepares all props", level: "KEY", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Costume Designer", slug: "costume-designer", description: "Designs, creates, and sources all costumes in collaboration with the creative team", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },
  { name: "Hair & Makeup Designer", slug: "hair-makeup-designer", description: "Creates hair and makeup looks, breaks down script requirements, recruits HMU team", level: "HOD", isVendorRole: false, groupSlug: "art-costume-hmu" },

  // Sound
  { name: "Production Sound Mixer", slug: "production-sound-mixer", description: "Head of sound department, responsible for all audio captured during filming", level: "HOD", isVendorRole: false, groupSlug: "sound" },
  { name: "Boom Operator", slug: "boom-operator", description: "Handles mic placement on set, operates boom pole, places personal mics", level: "ASSISTANT", isVendorRole: false, groupSlug: "sound" },

  // Post-Production
  { name: "Editor", slug: "editor", description: "Crafts the story from assembly through picture lock, works closely with director and producers", level: "HOD", isVendorRole: false, groupSlug: "post-production" },
  { name: "Post-Production Supervisor", slug: "post-production-supervisor", description: "Manages post budget, schedules, vendors, and technical delivery", level: "HOD", isVendorRole: false, groupSlug: "post-production" },
  { name: "Colorist", slug: "colorist", description: "Performs color grading and correction to achieve the final visual look", level: "KEY", isVendorRole: false, groupSlug: "post-production" },

  // Services & Vendors
  { name: "Catering", slug: "catering", description: "Provides scheduled meals for cast and crew on location", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Craft Services", slug: "craft-services", description: "Provides continuous snacks, drinks, and refreshment support throughout the day", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Transportation Captain", slug: "transportation-captain", description: "Oversees movement of all cast, crew, equipment, and picture vehicles", level: "KEY", isVendorRole: false, groupSlug: "services-vendors" },
  { name: "Security", slug: "security", description: "Provides set and location security services", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Set Medic", slug: "set-medic", description: "Provides on-set medical support and first aid", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },
  { name: "Equipment Rental", slug: "equipment-rental", description: "Provides camera, lighting, grip, and other production equipment", level: "KEY", isVendorRole: true, groupSlug: "services-vendors" },

  // Representation & Legal
  { name: "Casting Director", slug: "casting-director", description: "Matches actors to roles, manages auditions and talent recommendations", level: "HOD", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Talent Agent", slug: "talent-agent", description: "Represents and promotes clients, handles contract negotiation", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Talent Manager", slug: "talent-manager", description: "Provides long-term career strategy, packaging, and professional guidance", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
  { name: "Entertainment Lawyer", slug: "entertainment-lawyer", description: "Handles contracts, rights clearance, chain-of-title, and legal compliance", level: "KEY", isVendorRole: false, groupSlug: "representation-legal" },
];

export const MEMBERSHIP_PLANS: MembershipPlanData[] = [
  {
    name: "Free",
    slug: "free",
    tier: "FREE",
    price: 0,
    interval: "month",
    features: ["Basic profile", "Apply to public jobs", "Limited messages", "Browse projects"],
  },
  {
    name: "Pro Supply",
    slug: "pro-supply",
    tier: "PRO_SUPPLY",
    price: 19,
    interval: "month",
    features: ["Featured placement", "Rich media portfolio", "Availability alerts", "Priority applications", "Endorsement badges"],
  },
  {
    name: "Hiring Pro",
    slug: "hiring-pro",
    tier: "HIRING_PRO",
    price: 149,
    interval: "month",
    features: ["Create unlimited projects", "Post requisitions", "Send offers", "Casting breakdowns", "Shortlist management", "Invoice workflows", "Team collaboration"],
  },
  {
    name: "Department Head",
    slug: "department-head",
    tier: "DEPARTMENT_HEAD",
    price: 49,
    interval: "month",
    features: ["Department requisitions", "Crew roster management", "Limited offer approvals", "Enhanced portfolio", "Priority search placement"],
  },
  {
    name: "Agency / Studio",
    slug: "agency-studio",
    tier: "AGENCY_STUDIO",
    price: 499,
    interval: "month",
    features: ["Slate management", "Multi-user seats", "Compliance filters", "Bulk workflows", "API access", "Dedicated support", "Custom branding"],
  },
];

// Helper functions
export function getRolesByGroup(groupSlug: string): RoleData[] {
  return ROLES.filter((r) => r.groupSlug === groupSlug);
}

export function getRoleBySlug(slug: string): RoleData | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function getGroupBySlug(slug: string): TaxonomyGroupData | undefined {
  return TAXONOMY_GROUPS.find((g) => g.slug === slug);
}

export function getGroupedRoles(): Array<TaxonomyGroupData & { roles: RoleData[] }> {
  return TAXONOMY_GROUPS.map((group) => ({
    ...group,
    roles: getRolesByGroup(group.slug),
  }));
}

import { z } from "zod";

// ── Projects ──
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  logline: z.string().max(500).optional(),
  format: z.enum(["FEATURE", "EPISODIC", "SHORT", "COMMERCIAL", "MUSIC_VIDEO", "DOCUMENTARY", "WEB_SERIES", "THEATER"]),
  stage: z.enum(["DEVELOPMENT", "PRE_PRODUCTION", "PRODUCTION", "POST_PRODUCTION", "DISTRIBUTION"]).default("DEVELOPMENT"),
  budgetBandMin: z.number().positive().optional(),
  budgetBandMax: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  locations: z.array(z.object({
    city: z.string(),
    region: z.string().optional(),
    country: z.string(),
  })).optional(),
  visibility: z.enum(["PRIVATE", "INVITE_ONLY", "PUBLIC"]).default("PRIVATE"),
});

export const updateProjectSchema = createProjectSchema.partial();

// ── Requisitions ──
export const createRequisitionSchema = z.object({
  projectId: z.string().min(1),
  roleId: z.string().min(1),
  department: z.string().min(1),
  level: z.enum(["TRAINEE", "ASSISTANT", "KEY", "HOD", "PRINCIPAL"]).default("KEY"),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  rateMin: z.number().positive().optional(),
  rateMax: z.number().positive().optional(),
  rateType: z.enum(["HOURLY", "DAILY", "WEEKLY", "FLAT"]).default("DAILY"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  locations: z.array(z.object({
    city: z.string(),
    region: z.string().optional(),
    country: z.string(),
  })).optional(),
  requirements: z.record(z.any()).optional(),
});

// ── Applications ──
export const createApplicationSchema = z.object({
  requisitionId: z.string().min(1),
  roleProfileId: z.string().min(1),
  coverNote: z.string().max(2000).optional(),
  materialsRefs: z.array(z.string().url()).optional(),
});

// ── Offers ──
export const createOfferSchema = z.object({
  applicationId: z.string().min(1),
  proposedRate: z.number().positive(),
  rateType: z.enum(["HOURLY", "DAILY", "WEEKLY", "FLAT"]),
  terms: z.record(z.any()).optional(),
  expiresAt: z.string().datetime().optional(),
});

export const respondToOfferSchema = z.object({
  action: z.enum(["ACCEPT", "DECLINE", "COUNTER"]),
  counterTerms: z.record(z.any()).optional(),
  counterRate: z.number().positive().optional(),
});

// ── Role Profiles ──
export const updateRoleProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(2000).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  reelUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.boolean().optional(),
});

// ── Endorsements ──
export const createEndorsementSchema = z.object({
  toRoleProfileId: z.string().min(1),
  projectId: z.string().optional(),
  type: z.enum(["SKILL", "PROFESSIONALISM", "RELIABILITY", "CREATIVITY", "LEADERSHIP"]),
  text: z.string().max(500).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

// ── Availability ──
export const setAvailabilitySchema = z.object({
  roleProfileId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(["AVAILABLE", "SOFT_HOLD", "FIRM_HOLD", "BOOKED"]),
  geoCity: z.string().optional(),
  geoRegion: z.string().optional(),
  geoCountry: z.string().optional(),
  geoRadius: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
});

// ── Casting Breakdowns ──
export const createBreakdownSchema = z.object({
  projectId: z.string().min(1),
  roleName: z.string().min(1).max(200),
  description: z.string().max(3000),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  ethnicity: z.string().optional(),
  unionStatus: z.string().optional(),
  compensation: z.string().optional(),
  submissionDeadline: z.string().datetime().optional(),
  requirements: z.record(z.any()).optional(),
});

// ── Casting Submissions ──
export const createSubmissionSchema = z.object({
  breakdownId: z.string().min(1),
  roleProfileId: z.string().min(1),
  materialsRefs: z.array(z.string()).optional(),
  coverNote: z.string().max(2000).optional(),
});

// ── Invoices ──
export const createInvoiceSchema = z.object({
  projectId: z.string().min(1),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    amount: z.number().positive(),
  })).min(1),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  notes: z.string().max(1000).optional(),
  dueDate: z.string().datetime().optional(),
});

// ── Search ──
export const searchSchema = z.object({
  query: z.string().optional(),
  roleSlug: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  availableFrom: z.string().datetime().optional(),
  availableTo: z.string().datetime().optional(),
  level: z.enum(["TRAINEE", "ASSISTANT", "KEY", "HOD", "PRINCIPAL"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ── Auth ──
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ── Onboarding ──
export const completeOnboardingSchema = z.object({
  selectedRoleIds: z.array(z.string()).min(1, "Select at least one role"),
  profiles: z.record(z.string(), z.object({
    displayName: z.string().min(1),
    bio: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    portfolioUrl: z.string().optional(),
    reelUrl: z.string().optional(),
  })),
  selectedPlan: z.string(),
});

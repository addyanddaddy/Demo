# FrameOne — Architecture & Technical Specification

> **Version:** 1.0.0
> **Last Updated:** 2026-03-08
> **Status:** Pre-Launch / Active Development
> **Audience:** Engineering teams, technical investors, integration partners

---

## Table of Contents

1. [Vision & Problem Statement](#1-vision--problem-statement)
2. [Tech Stack](#2-tech-stack)
3. [Data Architecture](#3-data-architecture)
4. [Role Taxonomy](#4-role-taxonomy)
5. [Membership Tiers](#5-membership-tiers)
6. [Core Workflows](#6-core-workflows)
7. [API Routes](#7-api-routes)
8. [Page Routes & Navigation](#8-page-routes--navigation)
9. [Security & Compliance](#9-security--compliance)
10. [Scaling to 30K Users](#10-scaling-to-30k-users)
11. [Phased Roadmap](#11-phased-roadmap)
12. [Appendices](#12-appendices)

---

## 1. Vision & Problem Statement

### The Problem

The entertainment industry operates on a fundamentally different labor model than every other sector. Film and television production is:

- **Project-based:** Crews assemble for weeks or months, then disperse.
- **Referral-intensive:** 80%+ of hires come through personal networks and past collaborations.
- **Hierarchical by department:** A Gaffer does not hire a Costume Designer. Department heads staff their own teams.
- **Trust-dependent:** A single unreliable crew member can cost a production tens of thousands of dollars per day.
- **Time-sensitive:** Availability windows are measured in days, not quarters.

Generic platforms (LinkedIn, Indeed, StaffMeUp) fail because they flatten this structure. They treat a Producer and a Boom Operator the same. They have no concept of department-scoped hiring authority, project timelines, or the worked-with trust graph that drives real decisions.

### The Solution

**FrameOne** is the entertainment industry's professional network — a three-sided marketplace connecting:

| Side | Who | What They Need |
|------|-----|---------------|
| **Supply** | Talent & Crew | Discoverable profiles, availability management, verified credits, endorsements from past collaborators |
| **Demand** | Producers, Line Producers, Casting Directors, Department Heads | Project management, requisitions, offers, hiring authority delegation, compliance |
| **Services** | Vendors (catering, transport, equipment, etc.) | Invoice submission, payout processing, production discovery |

FrameOne understands the chain-of-command. It knows that a Producer creates a project, hires a Line Producer, who hires Department Heads, who staff their departments. It knows that a Casting Director runs breakdowns and auditions. It knows that a Gaffer's endorsement of a Best Boy Electric carries more weight than a stranger's five-star review.

### Key Differentiators

1. **Role-Aware Taxonomy:** 9 department groups, 40+ specialized roles — mirroring real production structures.
2. **Worked-With Trust Graph:** Every completed assignment creates a verifiable edge in a collaboration network.
3. **Hierarchical Hiring Authority:** Project-scoped permissions that respect the chain-of-command.
4. **Dual-Track Casting + Crew:** Unified platform for both above-the-line talent casting and below-the-line crew hiring.
5. **Vendor Payment Rails:** Stripe Connect for vendor invoice processing from day one.

### Target Market

- **Initial:** Independent film and television productions in the US and UK.
- **Expansion:** Commercial production, theatre, live events, podcasting/new media.
- **TAM:** 2.6 million entertainment industry workers in the US alone (BLS). $180B annual US production spend.

---

## 2. Tech Stack

### Core Technologies

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR for SEO on public profiles, API routes for backend, React Server Components for performance |
| **Language** | TypeScript (strict mode) | End-to-end type safety, shared types between client and server |
| **Database** | PostgreSQL 15+ | Relational integrity for complex entity relationships, full-text search, JSON columns for flexible metadata |
| **ORM** | Prisma 5 | Type-safe database access, migration management, introspection |
| **Authentication** | NextAuth v4 | JWT sessions, credentials provider (email/password), future OAuth providers |
| **Payments** | Stripe Connect (Standard) | Vendor onboarding, invoice payouts, future payroll disbursements |
| **Styling** | Tailwind CSS 3.4 | Utility-first, dark theme with indigo/gold brand palette, responsive |
| **Validation** | Zod | Runtime schema validation shared between client forms and API routes |
| **Media Storage** | S3-compatible (AWS S3 / Cloudflare R2) | Headshots, reels, documents, contracts |
| **Search** | PostgreSQL full-text (MVP) → Elasticsearch (Phase 2) | Progressive enhancement; Postgres handles initial scale |
| **Email** | Resend / SendGrid | Transactional emails, notifications |
| **Hosting** | Vercel (app) + AWS (database, media) | Edge deployment, serverless scaling |

### Development Tooling

| Tool | Purpose |
|------|---------|
| ESLint + Prettier | Code quality and formatting |
| Prisma Studio | Database GUI for development |
| Zod-to-TypeScript | Schema-driven type generation |
| GitHub Actions | CI/CD pipeline |
| Sentry | Error monitoring and performance tracing |
| PostHog | Product analytics and feature flags |

### Architecture Diagram (High Level)

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   Browser/Client  |---->|   Next.js App     |---->|   PostgreSQL      |
|   (React, TW CSS) |     |   (App Router)    |     |   (via Prisma)    |
|                   |<----|                   |<----|                   |
+-------------------+     +--------+----------+     +-------------------+
                                   |
                          +--------+----------+
                          |                   |
                    +-----+-----+       +-----+-----+
                    |           |       |           |
                    |  Stripe   |       |  S3/R2    |
                    |  Connect  |       |  Media    |
                    |           |       |  Storage  |
                    +-----------+       +-----------+
```

### Directory Structure

```
frameone/
├── prisma/
│   ├── schema.prisma          # Full data model (25+ models)
│   ├── migrations/            # Version-controlled migrations
│   └── seed.ts                # Taxonomy + test data seeding
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (dark theme, nav)
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/
│   │   │   ├── signin/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx       # Multi-step onboarding wizard
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Role-aware dashboard
│   │   ├── discover/
│   │   │   └── page.tsx       # Talent/crew search
│   │   ├── projects/
│   │   │   ├── page.tsx       # Project list
│   │   │   ├── new/page.tsx   # Create project
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # Project detail
│   │   │       └── requisitions/
│   │   ├── casting/
│   │   │   ├── breakdowns/
│   │   │   ├── submissions/
│   │   │   └── auditions/
│   │   ├── profile/
│   │   │   ├── page.tsx       # Own profile
│   │   │   └── [userId]/page.tsx  # Public profile
│   │   ├── availability/
│   │   ├── applications/
│   │   ├── payments/
│   │   ├── invoices/
│   │   ├── messages/
│   │   ├── settings/
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── projects/
│   │       ├── requisitions/
│   │       ├── applications/
│   │       ├── offers/
│   │       ├── profiles/
│   │       ├── endorsements/
│   │       ├── availability/
│   │       ├── casting/
│   │       ├── invoices/
│   │       ├── search/
│   │       ├── taxonomy/
│   │       └── users/
│   ├── components/
│   │   ├── ui/               # Reusable primitives (Button, Card, Modal)
│   │   ├── forms/            # Role-aware form components
│   │   ├── layout/           # Shell, Sidebar, Navbar
│   │   └── domain/           # Project cards, profile widgets, etc.
│   ├── lib/
│   │   ├── prisma.ts         # Singleton Prisma client
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── stripe.ts         # Stripe Connect helpers
│   │   ├── s3.ts             # Media upload/retrieval
│   │   ├── validators/       # Zod schemas
│   │   └── utils/            # Shared utilities
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── public/
│   ├── images/
│   └── icons/
├── docs/
│   └── ARCHITECTURE.md       # This document
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Data Architecture

### Overview

The FrameOne data model comprises **25+ entities** organized across **7 domains**. The schema is designed for relational integrity, audit compliance, and efficient querying of the trust graph.

All timestamps use UTC. Soft deletes are preferred for audit-sensitive entities. Enums are stored as PostgreSQL native enums for type safety and query performance.

### Domain Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IDENTITY LAYER                               │
│  User ─── Account ─── Membership                                    │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                        ROLE SYSTEM                                   │
│  TaxonomyGroup ─── Role ─── RoleProfile ─── RoleProfileField        │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                      PROJECTS LAYER                                  │
│  Project ─── ProjectMember ─── Requisition ─── Application          │
│              Offer ─── ProjectAssignment ─── Credit                  │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                      TRUST NETWORK                                   │
│  WorkedWithEdge ─── Endorsement ─── Availability                    │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                    CASTING WORKFLOW                                   │
│  Breakdown ─── Submission ─── Audition ─── ShortlistEntry           │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                       PAYMENTS                                       │
│  Invoice ─── Payout                                                  │
│  (Two-lane: vendor payouts now, payroll Phase 3)                    │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                  DOCUMENTS & AUDIT                                    │
│  Document ─── DocumentAccess ─── AuditEvent                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Entity-Relationship Diagram (Text)

```
User (1) ──────────────── (*) Account
  │
  ├──(1)────────────────── (0..1) Membership
  │
  ├──(1)────────────────── (*) RoleProfile
  │                              │
  │                              └──(1)── (*) RoleProfileField
  │
  ├──(1)────────────────── (*) ProjectMember
  │                              │
  │                              └──── Project (*)
  │
  ├──(1)────────────────── (*) Application
  │                              │
  │                              └──── Requisition (*)
  │
  ├──(1)────────────────── (*) Offer
  │
  ├──(1)────────────────── (*) ProjectAssignment
  │                              │
  │                              └──── Credit (0..1)
  │
  ├──(1)── (*) WorkedWithEdge ──(*) ──(1) User
  │
  ├──(1)── (*) Endorsement (as endorser)
  │              └──── (*) Endorsement (as endorsee) ──(1) User
  │
  ├──(1)────────────────── (*) Availability
  │
  ├──(1)────────────────── (*) Submission
  │                              │
  │                              └──── Breakdown (*)
  │
  ├──(1)────────────────── (*) Invoice
  │                              │
  │                              └──── Payout (0..1)
  │
  ├──(1)────────────────── (*) Document
  │                              │
  │                              └──── (*) DocumentAccess
  │
  └──(1)────────────────── (*) AuditEvent

TaxonomyGroup (1) ─────── (*) Role
Role (1) ──────────────── (*) RoleProfile

Project (1) ───────────── (*) Requisition
Project (1) ───────────── (*) Breakdown
Project (1) ───────────── (*) ProjectAssignment

Breakdown (1) ─────────── (*) Submission
Breakdown (1) ─────────── (*) Audition
Breakdown (1) ─────────── (*) ShortlistEntry
```

### Model Definitions

#### 3.1 Identity Layer

**User**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | String | Unique, indexed |
| passwordHash | String | bcrypt, never exposed |
| firstName | String | |
| lastName | String | |
| displayName | String | Computed or custom |
| avatarUrl | String? | S3 path |
| bio | Text? | Markdown-enabled |
| city | String? | |
| state | String? | |
| country | String | Default "US" |
| phone | String? | E.164 format |
| timezone | String | IANA timezone |
| isVerified | Boolean | Email verification |
| isActive | Boolean | Soft deactivation |
| lastLoginAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Account**

Stores OAuth/external account links for future social login.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userId | UUID | FK → User |
| provider | String | "credentials", "google", etc. |
| providerAccountId | String | External ID |
| accessToken | String? | Encrypted at rest |
| refreshToken | String? | Encrypted at rest |
| expiresAt | DateTime? | |

**Membership**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userId | UUID | FK → User, unique |
| tier | Enum | FREE, PRO_SUPPLY, HIRING_PRO, DEPT_HEAD, AGENCY |
| stripeCustomerId | String? | |
| stripeSubscriptionId | String? | |
| currentPeriodStart | DateTime? | |
| currentPeriodEnd | DateTime? | |
| cancelAtPeriodEnd | Boolean | Default false |
| features | JSON | Tier-specific feature flags |

#### 3.2 Role System

**TaxonomyGroup**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| name | String | "Above-the-Line", "Camera/Lighting/Grip", etc. |
| slug | String | URL-safe, unique |
| sortOrder | Int | Display ordering |
| description | Text? | |

**Role**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| taxonomyGroupId | UUID | FK → TaxonomyGroup |
| name | String | "Gaffer", "Line Producer", etc. |
| slug | String | Unique |
| description | Text? | |
| isHiringRole | Boolean | Can this role create requisitions? |
| isDepartmentHead | Boolean | Can this role staff a department? |
| requiredFields | JSON | Which profile fields are mandatory for this role |

**RoleProfile**

A user can hold multiple role profiles (e.g., a DP who also directs).

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userId | UUID | FK → User |
| roleId | UUID | FK → Role |
| isPrimary | Boolean | One primary per user |
| headline | String? | Role-specific headline |
| yearsExperience | Int? | |
| dayRate | Decimal? | In USD |
| weekRate | Decimal? | |
| isAvailableForHire | Boolean | |
| visibility | Enum | PUBLIC, CONNECTIONS, PRIVATE |
| createdAt | DateTime | |

**RoleProfileField**

Dynamic key-value fields per role profile (e.g., a DP's camera systems, a Gaffer's lighting inventory).

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| roleProfileId | UUID | FK → RoleProfile |
| fieldKey | String | "cameraSystem", "unionStatus", etc. |
| fieldValue | Text | |
| fieldType | Enum | TEXT, URL, LIST, BOOLEAN, FILE |

#### 3.3 Projects Layer

**Project**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| ownerId | UUID | FK → User (the creating producer) |
| title | String | |
| slug | String | Unique |
| type | Enum | FEATURE, SHORT, SERIES, COMMERCIAL, DOCUMENTARY, MUSIC_VIDEO, OTHER |
| status | Enum | DEVELOPMENT, PRE_PRODUCTION, PRODUCTION, POST_PRODUCTION, COMPLETED, CANCELLED |
| logline | Text? | |
| description | Text? | |
| budget | Enum? | MICRO, LOW, MID, HIGH, STUDIO |
| currency | String | Default "USD" |
| startDate | Date? | |
| endDate | Date? | |
| city | String? | |
| state | String? | |
| country | String? | |
| isPublic | Boolean | Listed in discovery |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**ProjectMember**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| projectId | UUID | FK → Project |
| userId | UUID | FK → User |
| roleId | UUID | FK → Role |
| authorityLevel | Enum | OWNER, ADMIN, DEPARTMENT_HEAD, MEMBER, VIEWER |
| canCreateRequisitions | Boolean | Derived from authority + role |
| canApproveInvoices | Boolean | |
| canManageCasting | Boolean | |
| joinedAt | DateTime | |
| departedAt | DateTime? | |

**Requisition**

A job opening within a project.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| projectId | UUID | FK → Project |
| createdById | UUID | FK → User (the hiring authority) |
| roleId | UUID | FK → Role (what role is being hired) |
| title | String | |
| description | Text | |
| status | Enum | DRAFT, OPEN, FILLED, CANCELLED |
| quantity | Int | Default 1 |
| rateType | Enum | DAY, WEEK, FLAT, NEGOTIABLE |
| rateMin | Decimal? | |
| rateMax | Decimal? | |
| startDate | Date? | |
| endDate | Date? | |
| isRemote | Boolean | |
| requiresUnion | Boolean? | |
| applicationDeadline | Date? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Application**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| requisitionId | UUID | FK → Requisition |
| applicantId | UUID | FK → User |
| roleProfileId | UUID | FK → RoleProfile |
| coverNote | Text? | |
| status | Enum | SUBMITTED, REVIEWED, SHORTLISTED, INTERVIEW, OFFERED, ACCEPTED, REJECTED, WITHDRAWN |
| reviewedById | UUID? | FK → User |
| reviewNotes | Text? | Internal, never shown to applicant |
| submittedAt | DateTime | |
| reviewedAt | DateTime? | |

**Offer**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| applicationId | UUID? | FK → Application (null if direct offer) |
| projectId | UUID | FK → Project |
| recipientId | UUID | FK → User |
| roleId | UUID | FK → Role |
| issuedById | UUID | FK → User |
| status | Enum | DRAFT, SENT, VIEWED, ACCEPTED, DECLINED, EXPIRED, RESCINDED |
| rateType | Enum | DAY, WEEK, FLAT |
| rateAmount | Decimal | |
| startDate | Date | |
| endDate | Date? | |
| terms | Text? | |
| expiresAt | DateTime? | |
| respondedAt | DateTime? | |
| createdAt | DateTime | |

**ProjectAssignment**

Created when an offer is accepted. Represents active engagement.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| projectId | UUID | FK → Project |
| userId | UUID | FK → User |
| roleId | UUID | FK → Role |
| offerId | UUID | FK → Offer |
| status | Enum | ACTIVE, COMPLETED, TERMINATED |
| startDate | Date | |
| endDate | Date? | |
| completedAt | DateTime? | |

**Credit**

Verified work credits, created upon assignment completion.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| assignmentId | UUID | FK → ProjectAssignment |
| userId | UUID | FK → User |
| projectId | UUID | FK → Project |
| roleId | UUID | FK → Role |
| projectTitle | String | Denormalized for display |
| year | Int | |
| isVerified | Boolean | Auto-verified via platform |
| imdbLink | String? | Optional external verification |

#### 3.4 Trust Network

**WorkedWithEdge**

Bidirectional collaboration record. Created automatically when two users have overlapping ProjectAssignments on the same project.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userAId | UUID | FK → User |
| userBId | UUID | FK → User |
| projectId | UUID | FK → Project |
| userARole | String | Role name at time of collaboration |
| userBRole | String | |
| createdAt | DateTime | |
| **Unique** | | (userAId, userBId, projectId) |

**Endorsement**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| endorserId | UUID | FK → User |
| endorseeId | UUID | FK → User |
| roleId | UUID | FK → Role (which role is being endorsed) |
| workedWithEdgeId | UUID? | FK → WorkedWithEdge (optional proof) |
| category | Enum | SKILL, RELIABILITY, COMMUNICATION, LEADERSHIP, CREATIVITY |
| comment | Text? | |
| isPublic | Boolean | |
| createdAt | DateTime | |

**Availability**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userId | UUID | FK → User |
| startDate | Date | |
| endDate | Date | |
| status | Enum | AVAILABLE, TENTATIVE, BOOKED, UNAVAILABLE |
| note | String? | |
| projectId | UUID? | FK → Project (if booked) |

#### 3.5 Casting Workflow

**Breakdown**

A casting call within a project.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| projectId | UUID | FK → Project |
| createdById | UUID | FK → User (Casting Director or Producer) |
| characterName | String | |
| description | Text | |
| ageRangeMin | Int? | |
| ageRangeMax | Int? | |
| gender | String? | |
| ethnicity | String? | |
| unionStatus | Enum? | SAG_AFTRA, NON_UNION, EITHER |
| rateInfo | String? | |
| status | Enum | DRAFT, OPEN, CLOSED, FILLED |
| submissionDeadline | DateTime? | |
| createdAt | DateTime | |

**Submission**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| breakdownId | UUID | FK → Breakdown |
| actorId | UUID | FK → User |
| submittedById | UUID | FK → User (self or agent) |
| headshot | String? | S3 URL |
| reelUrl | String? | |
| note | Text? | |
| status | Enum | SUBMITTED, REVIEWED, SHORTLISTED, REJECTED |
| submittedAt | DateTime | |

**Audition**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| breakdownId | UUID | FK → Breakdown |
| submissionId | UUID? | FK → Submission |
| userId | UUID | FK → User |
| scheduledAt | DateTime | |
| location | String? | |
| isVirtual | Boolean | |
| virtualLink | String? | |
| status | Enum | SCHEDULED, CONFIRMED, COMPLETED, NO_SHOW, CANCELLED |
| notes | Text? | Internal casting notes |
| rating | Int? | 1-5 scale |

**ShortlistEntry**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| breakdownId | UUID | FK → Breakdown |
| userId | UUID | FK → User |
| submissionId | UUID? | FK → Submission |
| rank | Int? | |
| holdStatus | Enum? | FIRST_CHOICE, SECOND_CHOICE, ALTERNATE |
| notes | Text? | |
| addedById | UUID | FK → User |
| addedAt | DateTime | |

#### 3.6 Payments

**Invoice**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| projectId | UUID | FK → Project |
| submittedById | UUID | FK → User (vendor) |
| approvedById | UUID? | FK → User (production authority) |
| invoiceNumber | String | Auto-generated, unique |
| description | Text | |
| amount | Decimal | |
| currency | String | Default "USD" |
| status | Enum | DRAFT, SUBMITTED, APPROVED, REJECTED, PAID, DISPUTED |
| lineItems | JSON | Array of {description, quantity, unitPrice, total} |
| dueDate | Date? | |
| submittedAt | DateTime? | |
| approvedAt | DateTime? | |
| paidAt | DateTime? | |
| createdAt | DateTime | |

**Payout**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| invoiceId | UUID | FK → Invoice |
| stripeTransferId | String? | Stripe transfer ID |
| stripePayoutId | String? | Stripe payout ID |
| amount | Decimal | |
| currency | String | |
| status | Enum | PENDING, PROCESSING, COMPLETED, FAILED |
| lane | Enum | VENDOR, PAYROLL |
| failureReason | String? | |
| processedAt | DateTime? | |
| createdAt | DateTime | |

#### 3.7 Documents & Audit

**Document**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| ownerId | UUID | FK → User |
| projectId | UUID? | FK → Project |
| type | Enum | CONTRACT, NDA, DEAL_MEMO, W9, I9, CERTIFICATE, RESUME, REEL, OTHER |
| title | String | |
| fileUrl | String | S3 path |
| mimeType | String | |
| fileSizeBytes | Int | |
| confidentialityLevel | Enum | PUBLIC, PROJECT_MEMBERS, ADMIN_ONLY, OWNER_ONLY |
| expiresAt | DateTime? | For certificates, insurance |
| createdAt | DateTime | |

**DocumentAccess**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| documentId | UUID | FK → Document |
| grantedToId | UUID | FK → User |
| grantedById | UUID | FK → User |
| accessLevel | Enum | VIEW, DOWNLOAD |
| expiresAt | DateTime? | |
| createdAt | DateTime | |

**AuditEvent**

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | |
| userId | UUID? | FK → User (null for system events) |
| action | String | "offer.created", "invoice.approved", etc. |
| entityType | String | "Offer", "Invoice", "Project", etc. |
| entityId | UUID | |
| metadata | JSON | Context-specific payload |
| ipAddress | String? | |
| userAgent | String? | |
| createdAt | DateTime | Immutable |

### Key Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_user_email ON "User" (email);
CREATE INDEX idx_role_profile_user ON "RoleProfile" (userId);
CREATE INDEX idx_role_profile_role ON "RoleProfile" (roleId);
CREATE INDEX idx_project_member_project ON "ProjectMember" (projectId);
CREATE INDEX idx_project_member_user ON "ProjectMember" (userId);
CREATE INDEX idx_requisition_project ON "Requisition" (projectId);
CREATE INDEX idx_requisition_status ON "Requisition" (status);
CREATE INDEX idx_application_requisition ON "Application" (requisitionId);
CREATE INDEX idx_application_applicant ON "Application" (applicantId);
CREATE INDEX idx_worked_with_users ON "WorkedWithEdge" (userAId, userBId);
CREATE INDEX idx_availability_user_dates ON "Availability" (userId, startDate, endDate);
CREATE INDEX idx_endorsement_endorsee ON "Endorsement" (endorseeId);
CREATE INDEX idx_audit_entity ON "AuditEvent" (entityType, entityId);
CREATE INDEX idx_audit_user ON "AuditEvent" (userId);
CREATE INDEX idx_invoice_project ON "Invoice" (projectId);
CREATE INDEX idx_breakdown_project ON "Breakdown" (projectId);
CREATE INDEX idx_credit_user ON "Credit" (userId);
```

---

## 4. Role Taxonomy

### Why Taxonomy Matters

Entertainment production is organized by **departments**, not job titles. A production's org chart looks nothing like a corporate one:

- **Hiring flows through department heads.** A Gaffer hires electricians. A Production Designer hires the art department. A DP hires the camera team. These are not HR decisions — they are craft decisions made by domain experts.
- **Authority is scoped.** A Gaffer has no say in who the Costume Designer hires. Project-level permissions must respect department boundaries.
- **Search must be department-aware.** When a DP searches for a 1st AC, they need to see camera-department profiles with relevant fields (camera systems, film gauge experience, DIT capabilities) — not generic resumes.
- **Endorsements carry weight within departments.** A Gaffer's endorsement of a Best Boy Electric is vastly more credible than a random five-star review. The taxonomy enables weighted trust scoring.
- **Rate structures differ by department.** Camera department day rates differ from production office salaries. The taxonomy drives appropriate rate display.

### The Nine Department Groups

#### Group 1: Above-the-Line

Creative leadership and IP ownership. These roles drive the project and typically have profit participation.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 1 | Producer | Yes | No | Creates projects, hires all HODs |
| 2 | Executive Producer | Yes | No | Financial/distribution oversight |
| 3 | Director | Yes | No | Creative vision, hires key HODs |
| 4 | Screenwriter | No | No | Script development |
| 5 | Development Producer | Yes | No | Pre-greenlight development |
| 6 | Script Editor | No | No | Script continuity and development |

#### Group 2: Production Office

Day-to-day logistics, scheduling, and financial management of the production.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 7 | Line Producer | Yes | Yes | Budget authority, hires below-the-line HODs |
| 8 | Production Manager / UPM | Yes | Yes | Scheduling, logistics |
| 9 | Production Coordinator | No | No | Administrative coordination |
| 10 | Production Accountant | No | No | Payroll, cost reports |
| 11 | Production Assistant / Runner | No | No | Entry-level, general support |

#### Group 3: Assistant Directing

Set management, scheduling, and continuity. The backbone of on-set operations.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 12 | 1st Assistant Director | Yes | Yes | Set operations, scheduling |
| 13 | 2nd Assistant Director | No | No | Talent management, call sheets |
| 14 | Floor Runner | No | No | On-set support |
| 15 | Script Supervisor | No | No | Continuity, editor notes |

#### Group 4: Camera, Lighting & Grip

Image acquisition and set lighting. Often the largest below-the-line department.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 16 | Director of Photography (DP) | Yes | Yes | Camera dept head, hires camera team |
| 17 | Camera Operator | No | No | |
| 18 | 1st Assistant Camera (Focus Puller) | No | No | |
| 19 | DIT (Digital Imaging Tech) | No | No | |
| 20 | Gaffer | Yes | Yes | Lighting dept head |
| 21 | Key Grip | Yes | Yes | Grip dept head |
| 22 | Video Assist Operator | No | No | |

#### Group 5: Art, Costume & Hair/Makeup

Visual design of the production's world.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 23 | Production Designer | Yes | Yes | Art dept head |
| 24 | Art Director | Yes | No | Art dept second-in-command |
| 25 | Set Decorator | No | No | |
| 26 | Props Master | No | No | |
| 27 | Costume Designer | Yes | Yes | Costume dept head |
| 28 | Hair & Makeup Artist | No | No | |

#### Group 6: Sound

Production audio capture.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 29 | Sound Mixer | Yes | Yes | Sound dept head |
| 30 | Boom Operator | No | No | |

#### Group 7: Post-Production

Editing, color, VFX, and delivery.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 31 | Editor | No | No | |
| 32 | Post-Production Supervisor | Yes | Yes | Post dept head |
| 33 | Colorist | No | No | |

#### Group 8: Services & Vendors

Third-party service providers to productions. These roles use the invoice/payout system rather than payroll.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 34 | Catering | No | No | Vendor |
| 35 | Craft Services | No | No | Vendor |
| 36 | Transport Captain | Yes | Yes | Transport dept |
| 37 | Security | No | No | Vendor |
| 38 | Medic / On-Set Nurse | No | No | Vendor |
| 39 | Equipment Rental | No | No | Vendor |

#### Group 9: Representation & Legal

Talent-adjacent professionals who facilitate deals and compliance.

| # | Role | isHiringRole | isDepartmentHead | Notes |
|---|------|-------------|-----------------|-------|
| 40 | Casting Director | Yes | Yes | Manages casting workflow |
| 41 | Talent Agent | No | No | Represents talent roster |
| 42 | Manager | No | No | Career management |
| 43 | Entertainment Lawyer | No | No | Contracts, IP, compliance |

### Role-Specific Profile Fields

Each role has custom profile fields relevant to that craft:

```typescript
// Example: DP-specific fields
const dpFields = [
  { key: "cameraSystems",   label: "Camera Systems",    type: "LIST" },   // ARRI, RED, Sony, etc.
  { key: "lensExperience",  label: "Lens Preferences",  type: "LIST" },
  { key: "genres",          label: "Genre Experience",   type: "LIST" },
  { key: "reelUrl",         label: "Demo Reel",         type: "URL"  },
  { key: "unionStatus",     label: "Union Status",      type: "TEXT" },   // IATSE Local 600, etc.
  { key: "passportCountry", label: "Passport",          type: "TEXT" },
  { key: "driversLicense",  label: "Driver's License",  type: "BOOLEAN" },
];

// Example: Gaffer-specific fields
const gafferFields = [
  { key: "lightingInventory",  label: "Lighting Inventory",   type: "LIST" },
  { key: "generatorCertified", label: "Generator Certified",  type: "BOOLEAN" },
  { key: "truckOwner",         label: "Owns Grip Truck",      type: "BOOLEAN" },
  { key: "unionLocal",         label: "IATSE Local",          type: "TEXT" },
];

// Example: Casting Director fields
const castingFields = [
  { key: "specialties",  label: "Casting Specialties", type: "LIST" },  // Film, TV, Commercial, Theatre
  { key: "csaAccess",    label: "CSA Member",          type: "BOOLEAN" },
  { key: "breakdownAccess", label: "Breakdown Services", type: "LIST" },
];
```

---

## 5. Membership Tiers

### Tier Overview

| Tier | Slug | Target Persona | Monthly Price | Annual Price | Seats |
|------|------|---------------|--------------|-------------|-------|
| **Free** | `FREE` | Entry-level talent/crew | $0 | $0 | 1 |
| **Pro Supply** | `PRO_SUPPLY` | Established specialists | $19/mo | $190/yr | 1 |
| **Department Head** | `DEPT_HEAD` | HODs & key crew | $49/mo | $490/yr | 1 |
| **Hiring Pro** | `HIRING_PRO` | Producers, Casting Directors, LPs | $149/mo | $1,490/yr | 1 |
| **Agency / Studio** | `AGENCY` | Production companies, talent agencies | $499/mo | $4,990/yr | 10 |

### Feature Matrix

| Feature | Free | Pro Supply | Dept Head | Hiring Pro | Agency |
|---------|------|-----------|-----------|-----------|--------|
| Basic profile | Yes | Yes | Yes | Yes | Yes |
| Multi-role enrollment | 1 role | 3 roles | 3 roles | 5 roles | Unlimited |
| Apply to requisitions | 5/mo | Unlimited | Unlimited | N/A | Unlimited |
| Availability calendar | View only | Full | Full | Full | Full |
| Endorsement requests | 2/mo | Unlimited | Unlimited | Unlimited | Unlimited |
| Media uploads (headshots, reels) | 1 | 10 | 10 | 20 | Unlimited |
| Document vault | 100MB | 1GB | 1GB | 5GB | 25GB |
| Profile visibility boost | No | Yes | Yes | Yes | Yes |
| Priority in search results | No | Yes | Yes | N/A | Yes |
| Availability alerts | No | Yes | Yes | Yes | Yes |
| **Create projects** | No | No | No | Yes | Yes |
| **Create requisitions** | No | No | Dept-scoped | Unlimited | Unlimited |
| **Send offers** | No | No | Dept-scoped | Unlimited | Unlimited |
| **Casting (breakdowns, auditions)** | No | No | No | Yes | Yes |
| **Approve invoices** | No | No | No | Yes | Yes |
| **Multi-seat management** | No | No | No | No | Yes (10) |
| **API access** | No | No | No | No | Yes |
| **Bulk operations** | No | No | No | No | Yes |
| **Compliance dashboard** | No | No | No | Basic | Full |
| **Custom branding** | No | No | No | No | Yes |

### Revenue Model Assumptions

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Total registered users | 5,000 | 15,000 | 30,000 |
| Free tier (80%) | 4,000 | 12,000 | 24,000 |
| Pro Supply (12%) | 600 | 1,800 | 3,600 |
| Dept Head (3%) | 150 | 450 | 900 |
| Hiring Pro (4%) | 200 | 600 | 1,200 |
| Agency (1%) | 50 | 150 | 300 |
| **Monthly recurring revenue** | **$50K** | **$150K** | **$300K** |
| Vendor payout fee (2.5%) | $5K | $25K | $75K |
| **Total monthly revenue** | **$55K** | **$175K** | **$375K** |

---

## 6. Core Workflows

### 6.1 Registration and Onboarding

```
Step 1: Sign Up
├── User provides: email, password, first name, last name
├── Email verification sent (Resend)
├── JWT session created (NextAuth)
└── Redirect → Onboarding

Step 2: Role Selection
├── Browse 9 taxonomy groups
├── Select 1+ roles (limited by tier)
├── Primary role designated
└── RoleProfile records created

Step 3: Profile Setup (per role)
├── Headline, bio, location
├── Role-specific fields populated
├── Day/week rate (optional)
├── Upload headshot / avatar
├── Upload reel (if applicable)
└── RoleProfileField records created

Step 4: Membership Selection
├── Display tier comparison
├── Free tier: continue immediately
├── Paid tiers: Stripe Checkout redirect
├── Membership record created/updated
└── Redirect → Dashboard

Step 5: Dashboard
├── Role-aware dashboard renders
├── Supply users see: available jobs, applications, endorsements
├── Hiring users see: projects, requisitions, applications received
└── Onboarding checklist shown until profile is 80%+ complete
```

### 6.2 Hiring Authority Chain

This is the core differentiator. FrameOne enforces the real-world chain-of-command.

```
Producer (OWNER authority)
│
├── Creates Project
│   └── ProjectMember created (authorityLevel: OWNER)
│
├── Creates Requisitions for key hires
│   ├── Line Producer
│   ├── Director
│   └── Casting Director
│
├── Reviews Applications → Sends Offers
│
└── Offer Accepted → ProjectAssignment created
    │
    ├── Line Producer (ADMIN authority)
    │   ├── Can create requisitions for ALL below-the-line roles
    │   ├── Can approve invoices
    │   └── Hires:
    │       ├── DP → ProjectMember (DEPARTMENT_HEAD authority)
    │       │   └── DP hires: Camera Op, 1st AC, DIT, Video Assist
    │       ├── Gaffer → ProjectMember (DEPARTMENT_HEAD authority)
    │       │   └── Gaffer hires: Best Boy Electric, Electricians
    │       ├── Key Grip → ProjectMember (DEPARTMENT_HEAD authority)
    │       │   └── Key Grip hires: Best Boy Grip, Grips
    │       ├── Production Designer → ProjectMember (DEPARTMENT_HEAD)
    │       │   └── PD hires: Art Director, Set Dec, Props
    │       ├── Costume Designer → ProjectMember (DEPARTMENT_HEAD)
    │       │   └── Costume hires: Wardrobe team
    │       └── Sound Mixer → ProjectMember (DEPARTMENT_HEAD)
    │           └── Mixer hires: Boom Op
    │
    ├── 1st AD (ADMIN authority)
    │   ├── Creates requisitions for AD dept
    │   └── Hires: 2nd AD, Floor Runner, Script Supervisor
    │
    └── Casting Director (DEPARTMENT_HEAD authority)
        ├── Creates Breakdowns
        ├── Manages Submissions, Auditions, Shortlists
        └── Recommends talent → Producer/Director make final decisions
```

**Authority Level Permissions:**

| Authority Level | Create Requisitions | Send Offers | Approve Invoices | Manage Casting | Edit Project |
|----------------|-------------------|------------|-----------------|---------------|-------------|
| OWNER | All roles | Yes | Yes | Yes | Yes |
| ADMIN | All roles | Yes | Yes | Yes | Settings only |
| DEPARTMENT_HEAD | Own dept only | Own dept | No | If Casting Dir | No |
| MEMBER | No | No | No | No | No |
| VIEWER | No | No | No | No | No |

### 6.3 Casting Flow

```
1. Casting Director creates Breakdown
   ├── Character name, description, requirements
   ├── Age range, gender, ethnicity preferences
   ├── Union status requirement
   └── Submission deadline

2. Breakdown published (status: OPEN)
   ├── Visible in /casting/breakdowns
   ├── Matching actors receive notifications
   └── Agents can submit on behalf of clients

3. Submissions received
   ├── Actor submits: headshot, reel link, note
   ├── Agent submits: same, on behalf of client
   └── Submission status: SUBMITTED

4. Casting Director reviews
   ├── View submissions grid
   ├── Filter by attributes
   ├── Mark as REVIEWED, SHORTLISTED, or REJECTED
   └── Add internal notes

5. Audition scheduling
   ├── Create Audition for shortlisted submissions
   ├── In-person or virtual (with link)
   ├── Actor/agent notified
   └── Status flow: SCHEDULED → CONFIRMED → COMPLETED

6. Shortlisting
   ├── Post-audition, add to ShortlistEntry
   ├── Rank: FIRST_CHOICE, SECOND_CHOICE, ALTERNATE
   ├── Share shortlist with Producer/Director
   └── Collaborative decision-making

7. Booking
   ├── Decision made → Offer created for selected actor
   ├── Offer accepted → ProjectAssignment created
   ├── Breakdown status → FILLED
   └── WorkedWithEdge created upon project completion
```

### 6.4 Invoice and Payment Flow

```
1. Vendor submits Invoice
   ├── Select project (must be ProjectMember)
   ├── Add line items (description, quantity, unit price)
   ├── Upload supporting documents
   ├── Total auto-calculated
   └── Status: SUBMITTED

2. Production reviews
   ├── LP/PM or Producer sees pending invoices
   ├── Review line items and documents
   ├── APPROVE or REJECT with notes
   └── Audit event logged

3. Payment processing (on approval)
   ├── Payout record created (lane: VENDOR)
   ├── Stripe Connect Transfer initiated
   │   ├── Vendor must have Stripe Connect account
   │   ├── Platform takes 2.5% fee
   │   └── Transfer ID stored
   ├── Status: PROCESSING → COMPLETED or FAILED
   └── Vendor notified of payment

4. Reconciliation
   ├── Invoice status: PAID
   ├── Payout status: COMPLETED
   ├── Production accountant can view all transactions
   └── Exportable for tax/accounting
```

### 6.5 Trust Building

```
1. Assignment Completion
   ├── Project wraps or crew member departs
   ├── ProjectAssignment status → COMPLETED
   └── Credit record auto-created

2. WorkedWithEdge Creation
   ├── System scans completed assignments on same project
   ├── For each pair of users with overlapping dates:
   │   └── WorkedWithEdge created (if not exists)
   ├── Edge is bidirectional
   └── Stores role context at time of collaboration

3. Endorsement Eligibility
   ├── User A can endorse User B if:
   │   ├── WorkedWithEdge exists between them, OR
   │   └── User A has HIRING_PRO or AGENCY tier (reduced requirement)
   ├── Endorsement categories: SKILL, RELIABILITY, COMMUNICATION, LEADERSHIP, CREATIVITY
   └── Optional: link to specific WorkedWithEdge for proof

4. Trust Score (future)
   ├── Weighted endorsement count
   ├── Credit verification rate
   ├── WorkedWithEdge density
   ├── Response rate to offers/applications
   └── Displayed on profile as trust indicators
```

---

## 7. API Routes

### Route Inventory (21 Endpoints)

All API routes live under `/api/` and follow RESTful conventions. Authentication is required unless noted.

#### Projects

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/projects` | List user's projects | Yes | Any member |
| POST | `/api/projects` | Create new project | Yes | HIRING_PRO+ tier |
| GET | `/api/projects/[id]` | Get project details | Yes | Project member |
| PATCH | `/api/projects/[id]` | Update project | Yes | OWNER or ADMIN |

#### Requisitions

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/requisitions` | List requisitions (filterable by project) | Yes | Any |
| POST | `/api/requisitions` | Create requisition | Yes | canCreateRequisitions flag |
| PATCH | `/api/requisitions/[id]` | Update requisition | Yes | Creator or project ADMIN+ |

#### Applications

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| POST | `/api/applications` | Submit application | Yes | Applicant |
| GET | `/api/applications` | List (own applications or received) | Yes | Context-dependent |
| PATCH | `/api/applications/[id]` | Update status | Yes | Hiring authority |

#### Offers

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| POST | `/api/offers` | Create and send offer | Yes | Hiring authority |
| PATCH | `/api/offers/[id]` | Accept/decline/rescind | Yes | Recipient or issuer |

#### Profiles

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/profiles/[userId]` | Get public profile | Optional | Public profiles visible to all |
| PATCH | `/api/profiles` | Update own profile | Yes | Self |

#### Endorsements

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| POST | `/api/endorsements` | Create endorsement | Yes | Must have WorkedWithEdge |
| GET | `/api/endorsements/[userId]` | Get endorsements for user | Optional | Public |

#### Availability

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/availability/[userId]` | Get availability windows | Yes | PRO_SUPPLY+ |
| POST | `/api/availability` | Set availability | Yes | Self |

#### Casting

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| POST | `/api/casting/breakdowns` | Create breakdown | Yes | canManageCasting flag |
| GET | `/api/casting/breakdowns` | List breakdowns | Yes | Filtered by project access |
| POST | `/api/casting/submissions` | Submit to breakdown | Yes | Actor or agent |

#### Invoices

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| POST | `/api/invoices` | Submit invoice | Yes | Vendor on project |
| PATCH | `/api/invoices/[id]` | Approve/reject | Yes | canApproveInvoices flag |

#### Search & Discovery

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/search` | Search profiles, projects, requisitions | Optional | Results filtered by visibility |

#### Taxonomy

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/taxonomy` | Get all groups and roles | No | Public |

#### User

| Method | Route | Description | Auth Required | Authority |
|--------|-------|-------------|--------------|-----------|
| GET | `/api/users/me` | Get authenticated user with memberships, roles | Yes | Self |

### Request/Response Patterns

All endpoints follow consistent patterns:

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {                    // For paginated endpoints
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [               // Zod validation errors
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Validation Layer

All request bodies are validated with Zod schemas before processing:

```typescript
// Example: Create Project schema
const CreateProjectSchema = z.object({
  title: z.string().min(2).max(200),
  type: z.enum(["FEATURE", "SHORT", "SERIES", "COMMERCIAL", "DOCUMENTARY", "MUSIC_VIDEO", "OTHER"]),
  logline: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
  budget: z.enum(["MICRO", "LOW", "MID", "HIGH", "STUDIO"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("US"),
  isPublic: z.boolean().default(true),
});

// Example: Create Requisition schema
const CreateRequisitionSchema = z.object({
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  quantity: z.number().int().min(1).max(50).default(1),
  rateType: z.enum(["DAY", "WEEK", "FLAT", "NEGOTIABLE"]),
  rateMin: z.number().positive().optional(),
  rateMax: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isRemote: z.boolean().default(false),
  requiresUnion: z.boolean().optional(),
  applicationDeadline: z.string().datetime().optional(),
});
```

---

## 8. Page Routes & Navigation

### Route Map

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | Landing | Public | Marketing page, value proposition, CTA |
| `/auth/signin` | Sign In | Public | Email/password login |
| `/auth/signup` | Sign Up | Public | Registration form |
| `/auth/error` | Auth Error | Public | Authentication error display |
| `/auth/verify` | Email Verify | Public | Email verification handler |
| `/onboarding` | Onboarding | Authenticated | Multi-step: role select → profile → plan |
| `/dashboard` | Dashboard | Authenticated | Role-aware home. Crew see jobs; hiring see projects |
| `/discover` | Discovery | Authenticated | Search/browse talent, crew, vendors |
| `/projects` | Project List | Authenticated | User's projects (as member) |
| `/projects/new` | Create Project | HIRING_PRO+ | New project form |
| `/projects/[id]` | Project Detail | Project member | Overview, members, requisitions, casting |
| `/projects/[id]/requisitions` | Requisitions | Project member | Project's open positions |
| `/projects/[id]/requisitions/new` | New Requisition | Hiring authority | Create job opening |
| `/projects/[id]/casting` | Casting Hub | Casting authority | Breakdowns, submissions, auditions |
| `/casting` | My Casting | Authenticated | Actor's submissions and auditions |
| `/casting/breakdowns` | Open Breakdowns | Authenticated | Browse casting calls |
| `/messages` | Messaging | Authenticated | Direct messages (Phase 2) |
| `/profile` | My Profile | Authenticated | Edit own profile(s) |
| `/profile/[userId]` | Public Profile | Public/Auth | View another user's profile |
| `/availability` | Availability | PRO_SUPPLY+ | Manage availability calendar |
| `/applications` | My Applications | Authenticated | Track submitted applications |
| `/payments` | Payments | HIRING_PRO+ | Invoice approval, payment history |
| `/invoices` | My Invoices | Vendor roles | Submit and track invoices |
| `/settings` | Settings | Authenticated | Account, notifications, membership, privacy |

### Navigation Structure

```
┌─────────────────────────────────────────────────┐
│ FrameOne                          [Avatar] [Bell]│
├─────────────────────────────────────────────────┤
│                                                  │
│  SIDEBAR (role-aware)                           │
│                                                  │
│  ── Everyone ──                                 │
│  Dashboard                                       │
│  Discover                                        │
│  Messages                                        │
│  Profile                                         │
│  Settings                                        │
│                                                  │
│  ── Supply Roles ──                             │
│  Applications                                    │
│  Availability                                    │
│  Casting (if actor)                             │
│  Invoices (if vendor)                           │
│                                                  │
│  ── Hiring Roles ──                             │
│  Projects                                        │
│  Payments                                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 9. Security & Compliance

### 9.1 Authentication

- **Method:** NextAuth v4 with JWT strategy
- **Session Duration:** 7 days, sliding window
- **Password Policy:** Minimum 8 characters, at least one uppercase, one lowercase, one number
- **Password Storage:** bcrypt with cost factor 12
- **Email Verification:** Required before full platform access
- **Future:** OAuth2 (Google, Apple), SAML SSO for Agency tier

### 9.2 Authorization (RBAC)

Authorization is **project-scoped** and enforced at the API route level:

```typescript
// Authorization middleware pattern
async function requireProjectAuthority(
  projectId: string,
  userId: string,
  minimumLevel: AuthorityLevel
): Promise<ProjectMember> {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, userId },
  });

  if (!member) throw new ForbiddenError("Not a project member");

  const levels = ["VIEWER", "MEMBER", "DEPARTMENT_HEAD", "ADMIN", "OWNER"];
  const memberIndex = levels.indexOf(member.authorityLevel);
  const requiredIndex = levels.indexOf(minimumLevel);

  if (memberIndex < requiredIndex) {
    throw new ForbiddenError("Insufficient authority level");
  }

  return member;
}
```

**Key Authorization Rules:**

| Action | Required Authority |
|--------|-------------------|
| View project | VIEWER+ |
| Apply to requisition | Any authenticated user |
| Create requisition | DEPARTMENT_HEAD+ with `canCreateRequisitions` |
| Send offer | DEPARTMENT_HEAD+ (own dept) or ADMIN+ (any) |
| Approve invoice | ADMIN+ with `canApproveInvoices` |
| Manage casting | DEPARTMENT_HEAD+ with `canManageCasting` |
| Edit project settings | OWNER or ADMIN |
| Delete project | OWNER only |

### 9.3 OWASP Top 10 Adherence

| Threat | Mitigation |
|--------|-----------|
| **A01: Broken Access Control** | Project-scoped RBAC, authority level checks on every mutating endpoint |
| **A02: Cryptographic Failures** | bcrypt passwords, HTTPS-only, encrypted tokens at rest |
| **A03: Injection** | Prisma parameterized queries (no raw SQL), Zod input validation |
| **A04: Insecure Design** | Threat modeling per workflow, principle of least privilege |
| **A05: Security Misconfiguration** | Environment-based config, no defaults in production, CSP headers |
| **A06: Vulnerable Components** | Dependabot alerts, `npm audit` in CI pipeline |
| **A07: Authentication Failures** | Rate limiting on auth endpoints, account lockout after 10 failures |
| **A08: Data Integrity Failures** | Signed JWTs, Stripe webhook signature verification |
| **A09: Logging & Monitoring** | AuditEvent for all sensitive operations, Sentry for errors |
| **A10: SSRF** | No user-supplied URLs fetched server-side (media stored in S3) |

### 9.4 PCI DSS Compliance

FrameOne **never touches raw card data**. All payment processing is handled through Stripe:

- Credit card numbers entered exclusively in Stripe-hosted iframes (Stripe Elements)
- No card data stored, processed, or transmitted by FrameOne servers
- Stripe Connect handles vendor payout compliance (KYC, tax reporting)
- Platform operates at **SAQ A** level (lowest PCI burden)

### 9.5 Data Privacy & Minimization

| Data Category | Retention | Access |
|---------------|----------|--------|
| Account credentials | Until deletion | System only |
| Profile information | Until deletion | Per visibility settings |
| Project data | 3 years after completion | Project members |
| Financial records | 7 years (tax compliance) | ADMIN+, accountants |
| Audit logs | 5 years | System administrators |
| Messages | 2 years | Participants only |
| Documents | Per confidentiality level | Explicit grants only |

### 9.6 Document Confidentiality

```
OWNER_ONLY      → Only the document owner can access
ADMIN_ONLY      → Project OWNER and ADMIN can access
PROJECT_MEMBERS → All project members can access
PUBLIC          → Accessible via public profile
```

Access to non-public documents requires explicit `DocumentAccess` grants. All document views are logged in `AuditEvent`.

### 9.7 Audit Logging

Every sensitive operation creates an immutable `AuditEvent`:

```typescript
// Audited actions
const AUDITED_ACTIONS = [
  "user.login",
  "user.logout",
  "user.password_changed",
  "project.created",
  "project.deleted",
  "requisition.created",
  "offer.sent",
  "offer.accepted",
  "offer.declined",
  "invoice.submitted",
  "invoice.approved",
  "invoice.rejected",
  "payout.initiated",
  "payout.completed",
  "payout.failed",
  "document.uploaded",
  "document.accessed",
  "document.shared",
  "membership.upgraded",
  "membership.cancelled",
];
```

---

## 10. Scaling to 30K Users

### 10.1 Traffic Projections

| Metric | 5K Users | 15K Users | 30K Users |
|--------|----------|-----------|-----------|
| Daily active users (30%) | 1,500 | 4,500 | 9,000 |
| Peak concurrent sessions | 300 | 900 | 1,800 |
| API requests/minute (peak) | 500 | 1,500 | 3,000 |
| Database queries/minute (peak) | 1,000 | 3,000 | 6,000 |
| Media uploads/day | 50 | 200 | 500 |
| Search queries/minute | 20 | 80 | 200 |

### 10.2 Architecture for Scale

```
                    ┌──────────────┐
                    │   CDN        │
                    │  (CloudFront │
                    │   / Vercel)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Edge       │
                    │   Functions  │  ← Static pages, ISR
                    └──────┬───────┘
                           │
              ┌────────────▼────────────┐
              │    Load Balancer         │
              └───┬──────┬──────┬───────┘
                  │      │      │
            ┌─────▼┐ ┌───▼──┐ ┌▼──────┐
            │ App  │ │ App  │ │ App   │  ← Stateless Next.js instances
            │  #1  │ │  #2  │ │  #3   │
            └──┬───┘ └──┬───┘ └──┬────┘
               │        │        │
        ┌──────▼────────▼────────▼──────┐
        │         Connection Pool        │
        │         (PgBouncer)            │
        └──────┬─────────────┬──────────┘
               │             │
        ┌──────▼──────┐ ┌───▼──────────┐
        │  Primary DB │ │  Read Replica │
        │  (Write)    │ │  (Read)       │
        └─────────────┘ └──────────────┘
```

### 10.3 Scaling Strategies

**Stateless Application Tier**

- Next.js instances are stateless; JWT sessions require no server-side session store.
- Horizontal scaling via container orchestration (Vercel serverless or ECS).
- No sticky sessions required.

**Database Layer**

- **Connection Pooling:** PgBouncer in front of PostgreSQL to handle connection surge from serverless functions.
- **Read Replicas:** Route search, discovery, and profile views to read replicas.
- **Query Optimization:** Composite indexes on frequently joined columns (see Key Indexes section).
- **Partitioning:** AuditEvent table partitioned by month after 1M rows.

**Caching Layer**

| Cache Target | Strategy | TTL | Invalidation |
|-------------|----------|-----|-------------|
| Taxonomy data | In-memory (singleton) | 24 hours | Manual on seed |
| Public profiles | Redis / Vercel KV | 15 minutes | On profile update |
| Search results | Redis / Vercel KV | 5 minutes | Background refresh |
| User session data | JWT (client-side) | 7 days | On logout |
| Project member lists | Redis | 10 minutes | On member change |

**Media Delivery**

- All media stored in S3-compatible storage (AWS S3 or Cloudflare R2).
- CloudFront / Cloudflare CDN for global distribution.
- Signed URLs for private documents (time-limited access).
- Image resizing via on-demand transformation (Sharp / Cloudflare Images).

**Search Optimization**

| Phase | Technology | Capability |
|-------|-----------|------------|
| MVP | PostgreSQL full-text search with `tsvector` | Basic keyword search, role filtering |
| Phase 2 | Elasticsearch / Meilisearch | Faceted search, fuzzy matching, geo-proximity |
| Phase 3 | Custom ranking algorithm | Trust-weighted results, availability-aware |

### 10.4 Monitoring & Observability

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking, performance tracing |
| PostHog | Product analytics, feature flags |
| AWS CloudWatch / Vercel Analytics | Infrastructure monitoring |
| PgHero | Database query performance |
| Stripe Dashboard | Payment health monitoring |
| Custom dashboard | Trust graph metrics, marketplace health |

### 10.5 Disaster Recovery

| Component | RPO | RTO | Strategy |
|-----------|-----|-----|----------|
| Database | 1 hour | 4 hours | Automated daily backups + WAL archiving |
| Media storage | 0 (S3 durability) | Minutes | S3 cross-region replication |
| Application | 0 | Minutes | Vercel instant rollback / blue-green deploy |
| Stripe data | 0 | N/A | Managed by Stripe |

---

## 11. Phased Roadmap

### Phase 1: MVP (Months 1-4)

**Goal:** Launch a functional three-sided marketplace with core hiring and trust features.

| Feature | Models | Routes | Status |
|---------|--------|--------|--------|
| Authentication & authorization | User, Account | /auth/*, /api/auth | Priority |
| Multi-role enrollment | TaxonomyGroup, Role, RoleProfile, RoleProfileField | /onboarding, /api/taxonomy, /api/profiles | Priority |
| Profile management | RoleProfile, RoleProfileField | /profile, /profile/[userId] | Priority |
| Membership tiers | Membership | /settings, Stripe Checkout | Priority |
| Project creation & management | Project, ProjectMember | /projects, /api/projects | Priority |
| Requisitions | Requisition | /projects/[id]/requisitions, /api/requisitions | Priority |
| Applications | Application | /applications, /api/applications | Priority |
| Offers & assignments | Offer, ProjectAssignment | /api/offers | Priority |
| Credits | Credit | /profile (credits section) | Priority |
| Worked-with graph | WorkedWithEdge | Auto-generated on completion | Priority |
| Endorsements | Endorsement | /api/endorsements | Priority |
| Availability calendar | Availability | /availability, /api/availability | Priority |
| Search & discovery | — | /discover, /api/search | Priority |
| Vendor invoices | Invoice, Payout | /invoices, /payments, /api/invoices | Priority |
| Document vault | Document, DocumentAccess | /settings (documents) | Priority |
| Audit logging | AuditEvent | Internal | Priority |
| Casting basics | Breakdown, Submission | /casting, /api/casting | Priority |

**MVP Success Criteria:**
- 500 registered users within 60 days of launch
- 50 projects created
- 200 applications submitted
- 10 vendor invoices paid through platform
- Net Promoter Score > 30 from early adopters

### Phase 2: Collaboration & Intelligence (Months 5-8)

**Goal:** Deepen engagement with communication, scheduling, and analytics tools.

| Feature | Description |
|---------|-------------|
| **Call sheets** | Automated daily call sheet generation from project schedule and crew assignments |
| **E-signatures** | Digital contract signing integrated with Document vault (DocuSign or native) |
| **Post-production pipeline** | Status tracking for editorial, color, VFX, sound mix, deliverables |
| **Analytics dashboard** | Hiring metrics, application funnel, marketplace supply/demand by role |
| **In-platform messaging** | Direct messages and project-scoped group channels |
| **Department scheduling** | Calendar views for department heads to manage crew schedules |
| **Notifications system** | Email + in-app notifications for applications, offers, endorsements, availability |
| **Advanced search** | Elasticsearch/Meilisearch integration, faceted search, geo-proximity |
| **Mobile-responsive** | Full responsive optimization (not native app yet) |
| **Audition self-tape upload** | Actors upload self-tape submissions directly |

### Phase 3: Enterprise & Compliance (Months 9-14)

**Goal:** Enterprise features for studios, agencies, and union compliance.

| Feature | Description |
|---------|-------------|
| **Payroll integrations** | Integration with entertainment payroll providers (EP, Cast & Crew, ABS) |
| **Union verification** | SAG-AFTRA, IATSE, DGA, WGA membership verification |
| **Fraud detection** | Anomaly detection on fake profiles, fraudulent invoices, review manipulation |
| **Enterprise SSO** | SAML 2.0 / OIDC for Agency/Studio tier |
| **Mobile app** | Native iOS/Android app (React Native or Flutter) |
| **API v2** | Public API for Agency tier integrations |
| **Bulk operations** | CSV import/export for crew lists, contact sheets |
| **Custom workflows** | Configurable approval chains for large productions |
| **Insurance verification** | Workers' comp, general liability certificate tracking |
| **Tax document automation** | W-9 / 1099 generation and distribution |
| **Multi-currency** | GBP, EUR, CAD support for international productions |
| **Localization** | UK English, Canadian French for primary international markets |

### Phase 4: Intelligence & Network Effects (Months 15+)

**Goal:** Leverage the trust graph and data for intelligent matching and industry insights.

| Feature | Description |
|---------|-------------|
| **Smart recommendations** | ML-powered crew recommendations based on trust graph, past collaborations, and role fit |
| **Availability matching** | Auto-suggest available crew for open requisitions based on calendar and preferences |
| **Market intelligence** | Anonymous, aggregated rate data by role, region, and production type |
| **Career insights** | Career trajectory analysis for crew members (roles held, progression, earnings) |
| **Production planning** | AI-assisted crew planning based on project type, budget, and location |
| **Trust score v2** | Graph-based trust scoring considering endorsement chains and collaboration density |

---

## 12. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **Above-the-Line (ATL)** | Creative leadership: producers, directors, writers, principal cast. Named for the accounting line separating creative from technical costs. |
| **Below-the-Line (BTL)** | Technical crew: camera, lighting, grip, art, sound, etc. |
| **Breakdown** | A casting call describing a character role to be filled. |
| **Call Sheet** | Daily production schedule listing who is needed, when, and where. |
| **Day Rate** | Standard daily compensation for freelance crew. |
| **Deal Memo** | Summary of employment terms before a formal contract. |
| **Department Head (HOD)** | The lead of a specific department (DP for camera, Gaffer for lighting, etc.). |
| **DIT** | Digital Imaging Technician — manages on-set digital workflows. |
| **DP** | Director of Photography, also known as Cinematographer. |
| **Gaffer** | Chief lighting technician; head of the lighting department. |
| **Key Grip** | Head of the grip department; manages rigging, dollies, cranes. |
| **Line Producer** | Manages day-to-day budget and operations of a production. |
| **Requisition** | A formal job opening within a project, created by a hiring authority. |
| **Self-Tape** | A remotely recorded audition submitted digitally. |
| **Sides** | Pages of a script provided to actors for auditions. |
| **Shortlist** | A ranked list of preferred actors for a role after auditions. |
| **UPM** | Unit Production Manager — manages logistics and scheduling. |
| **Wrap** | The completion of production (daily or overall). |

### Appendix B: Enum Definitions

```typescript
enum MembershipTier {
  FREE = "FREE",
  PRO_SUPPLY = "PRO_SUPPLY",
  DEPT_HEAD = "DEPT_HEAD",
  HIRING_PRO = "HIRING_PRO",
  AGENCY = "AGENCY",
}

enum ProjectType {
  FEATURE = "FEATURE",
  SHORT = "SHORT",
  SERIES = "SERIES",
  COMMERCIAL = "COMMERCIAL",
  DOCUMENTARY = "DOCUMENTARY",
  MUSIC_VIDEO = "MUSIC_VIDEO",
  OTHER = "OTHER",
}

enum ProjectStatus {
  DEVELOPMENT = "DEVELOPMENT",
  PRE_PRODUCTION = "PRE_PRODUCTION",
  PRODUCTION = "PRODUCTION",
  POST_PRODUCTION = "POST_PRODUCTION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

enum BudgetLevel {
  MICRO = "MICRO",       // < $100K
  LOW = "LOW",           // $100K - $1M
  MID = "MID",           // $1M - $10M
  HIGH = "HIGH",         // $10M - $50M
  STUDIO = "STUDIO",     // $50M+
}

enum AuthorityLevel {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  DEPARTMENT_HEAD = "DEPARTMENT_HEAD",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

enum RequisitionStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  FILLED = "FILLED",
  CANCELLED = "CANCELLED",
}

enum ApplicationStatus {
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW = "INTERVIEW",
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

enum OfferStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
  RESCINDED = "RESCINDED",
}

enum AssignmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED",
}

enum RateType {
  DAY = "DAY",
  WEEK = "WEEK",
  FLAT = "FLAT",
  NEGOTIABLE = "NEGOTIABLE",
}

enum InvoiceStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  DISPUTED = "DISPUTED",
}

enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

enum PayoutLane {
  VENDOR = "VENDOR",
  PAYROLL = "PAYROLL",
}

enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  TENTATIVE = "TENTATIVE",
  BOOKED = "BOOKED",
  UNAVAILABLE = "UNAVAILABLE",
}

enum BreakdownStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FILLED = "FILLED",
}

enum AuditionStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  CANCELLED = "CANCELLED",
}

enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
}

enum EndorsementCategory {
  SKILL = "SKILL",
  RELIABILITY = "RELIABILITY",
  COMMUNICATION = "COMMUNICATION",
  LEADERSHIP = "LEADERSHIP",
  CREATIVITY = "CREATIVITY",
}

enum HoldStatus {
  FIRST_CHOICE = "FIRST_CHOICE",
  SECOND_CHOICE = "SECOND_CHOICE",
  ALTERNATE = "ALTERNATE",
}

enum ProfileVisibility {
  PUBLIC = "PUBLIC",
  CONNECTIONS = "CONNECTIONS",
  PRIVATE = "PRIVATE",
}

enum DocumentType {
  CONTRACT = "CONTRACT",
  NDA = "NDA",
  DEAL_MEMO = "DEAL_MEMO",
  W9 = "W9",
  I9 = "I9",
  CERTIFICATE = "CERTIFICATE",
  RESUME = "RESUME",
  REEL = "REEL",
  OTHER = "OTHER",
}

enum ConfidentialityLevel {
  PUBLIC = "PUBLIC",
  PROJECT_MEMBERS = "PROJECT_MEMBERS",
  ADMIN_ONLY = "ADMIN_ONLY",
  OWNER_ONLY = "OWNER_ONLY",
}

enum FieldType {
  TEXT = "TEXT",
  URL = "URL",
  LIST = "LIST",
  BOOLEAN = "BOOLEAN",
  FILE = "FILE",
}

enum UnionStatus {
  SAG_AFTRA = "SAG_AFTRA",
  NON_UNION = "NON_UNION",
  EITHER = "EITHER",
}
```

### Appendix C: Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://frameone.io
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/frameone?schema=public
DATABASE_URL_READ=postgresql://user:pass@read-host:5432/frameone?schema=public

# Authentication
NEXTAUTH_URL=https://frameone.io
NEXTAUTH_SECRET=<random-32-byte-hex>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# Storage
S3_BUCKET=frameone-media
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://s3.amazonaws.com  # or Cloudflare R2 endpoint

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@frameone.io

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_KEY=phc_...

# Search (Phase 2)
ELASTICSEARCH_URL=https://...
```

### Appendix D: Brand & Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0f0f14` | Page background |
| `--color-surface` | `#1a1a24` | Cards, panels |
| `--color-surface-hover` | `#24243a` | Interactive surface states |
| `--color-border` | `#2a2a3e` | Borders, dividers |
| `--color-text-primary` | `#f0f0f5` | Primary text |
| `--color-text-secondary` | `#8888a0` | Secondary text |
| `--color-accent` | `#6366f1` | Primary accent (indigo) |
| `--color-accent-hover` | `#818cf8` | Accent hover state |
| `--color-gold` | `#f59e0b` | Secondary accent (gold), premium indicators |
| `--color-success` | `#10b981` | Success states |
| `--color-warning` | `#f59e0b` | Warning states |
| `--color-error` | `#ef4444` | Error states |
| `--font-sans` | `Inter, system-ui` | Body text |
| `--font-display` | `Plus Jakarta Sans` | Headings |
| `--radius-sm` | `0.375rem` | Small elements |
| `--radius-md` | `0.5rem` | Cards, inputs |
| `--radius-lg` | `0.75rem` | Modals, large containers |

---

*This document is maintained alongside the codebase and updated as architecture evolves. For questions, contact the engineering team.*

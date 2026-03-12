# FrameOne — Platform White Paper

**Prepared for:** Ralph, Shahpoor & the FrameOne Founding Team
**Prepared by:** Brandon Bible (Technical Lead)
**Date:** March 9, 2026
**Version:** 2.0

---

> ### Document Update — March 12, 2026
>
> **Version 2.0** — The following updates have been made to this white paper:
>
> **AI-Powered Intelligence Layer (New Section 9)**
> - Documented all 6 built-in AI features: Smart Match, Natural Language Search, Auto-Categorization, Crew Recommendations, Role Suggestions, and Pre-Screen Questions
> - All 6 AI features are fully built and functional, powered by Anthropic's Claude (claude-sonnet-4)
> - AI costs are absorbed by the platform — not passed to users
>
> **✦ AI-Enhanced Markers Throughout**
> - Inline "✦ AI-Enhanced" indicators added to every feature section that uses artificial intelligence
> - Covers: Discover/Search, Hiring/Matching, Profile Onboarding, Crew Recommendations, Skill Extraction
>
> **Phase 2 Feature Roadmap (14 New Features Planned)**
> - Self-Tape & Audition Management System
> - Saved Searches with Smart Alerts (instant/daily/weekly)
> - Collaborator Permissions (full vs. shortlist-only access)
> - Bulk Actions (message, shortlist, reject multiple candidates)
> - Applicant Pipeline Kanban (To Review → Shortlisted → Audition → Offer → Hired)
> - Pre-Screen Questionnaires (custom questions per requisition)
> - Geographic Radius Search (distance-based filtering)
> - Content Creator Profiles (UGC, branded content, package pricing)
> - Listing Boost / Featured Placement (paid visibility)
> - Calendar Integration (Google Calendar / iCal sync)
> - Physical Attributes & Voice Filters (height, hair, eye color, voice type)
> - Script Sides & Document Sharing (attach to casting breakdowns)
> - Native Portfolio & Reel Hosting (built-in video player)
> - Exportable Shortlists (PDF/CSV for offline sharing)
>
> **Executive Summary & Competitive Landscape Updated**
> - AI highlighted as a core platform differentiator
> - FrameOne positioned as the first entertainment industry platform with production-aware AI
>
> **Complete UI/UX Redesign**
> - Full design system overhaul: cinematic editorial aesthetic with Plus Jakarta Sans typography
> - New color system: deep charcoal, marble/cream text, bronze accents
> - All 17 pages and 8 UI components restyled
>
> **Admin Portal (New Section 10)**
> - Full admin dashboard with KPIs, user management, content moderation, message monitoring, financial overview, reports & violations, AI intelligence settings, platform rules, and activity audit log
> - Role-based access: ADMIN and SUPER_ADMIN levels
>
> **New Backend Infrastructure**
> - 6 new database models added (SavedSearch, SelfTapeRequest, PreScreenQuestion, PreScreenAnswer, Collaborator, ListingBoost)
> - 8 new API endpoints deployed
> - 1 new AI function (AI-suggested pre-screen questions)
> - Resend added as transactional email provider (free tier, 100 emails/day)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem We're Solving](#2-the-problem-were-solving)
3. [What FrameOne Is](#3-what-frameone-is)
4. [How the Platform Works](#4-how-the-platform-works)
5. [User Types & Roles](#5-user-types--roles)
6. [Complete Role Directory](#6-complete-role-directory)
7. [Membership & Pricing](#7-membership--pricing)
8. [Core Features Breakdown](#8-core-features-breakdown)
9. [AI-Powered Intelligence Layer](#9-ai-powered-intelligence-layer)
10. [Admin Portal](#10-admin-portal)
11. [User Journeys](#11-user-journeys)
12. [Payment System](#12-payment-system)
13. [Trust & Reputation System](#13-trust--reputation-system)
14. [Technical Architecture Overview](#14-technical-architecture-overview)
15. [Site Map & Page Structure](#15-site-map--page-structure)
16. [API Endpoints](#16-api-endpoints)
17. [Database Structure](#17-database-structure)
18. [Security & Privacy](#18-security--privacy)
19. [Development Roadmap](#19-development-roadmap)
20. [Access & Login Information](#20-access--login-information)
21. [How to Deploy & Run](#21-how-to-deploy--run)
22. [Competitive Landscape](#22-competitive-landscape)
23. [Revenue Projections](#23-revenue-projections)
24. [AI Integration (Technical Detail)](#24-ai-integration-technical-detail)

---

## 1. Executive Summary

**FrameOne** is a professional networking, hiring, and project management platform purpose-built for the entertainment industry. It serves as the bridge between talent (actors, crew, vendors) and the people who hire them (producers, casting directors, department heads).

Unlike generic platforms like LinkedIn or Indeed, FrameOne understands how the entertainment industry actually works:

- **Projects are temporary.** A film crew assembles for weeks or months, then disperses.
- **Hiring is referral-based.** Over 80% of crew hires come through personal networks.
- **Authority is hierarchical.** A Producer hires a Line Producer, who hires Department Heads, who staff their teams.
- **Trust is everything.** One unreliable crew member can cost a production $50,000+ per day.
- **Availability is critical.** Holds, bookings, and date conflicts drive every hiring decision.

FrameOne captures all of this in a platform that lets professionals:

- **Create and manage profiles** across multiple roles (a person can be both a Director and a Writer)
- **Build verified trust networks** through real project collaborations
- **Staff entire productions** with a department-aware hiring system
- **Run casting** with breakdowns, submissions, auditions, and shortlists
- **Process payments** between productions and vendors
- **Search and discover** talent by role, department, location, availability, and experience
- **Leverage AI intelligence** to match candidates, parse natural language searches, and surface crew recommendations

The platform's embedded AI intelligence layer — powered by Anthropic's Claude — transforms hiring from manual filtering into intelligent matching, making FrameOne the first entertainment industry platform with production-aware artificial intelligence.

### What We've Built

| Metric | Count |
|--------|-------|
| Lines of code | 7,173 |
| Database tables | 25 |
| API endpoints | 24 |
| User-facing pages | 7 |
| UI components | 9 |
| AI features (built & functional) | 6 |
| Industry roles supported | 43 |
| Department categories | 9 |
| Membership tiers | 5 |

The platform is built with **Next.js 14** (React), **TypeScript**, **PostgreSQL** (database), **Stripe Connect** (payments), **Anthropic Claude** (AI intelligence layer), **Resend** (transactional email), and **Tailwind CSS** (styling). It is designed to scale to **30,000+ concurrent users**.

---

## 2. The Problem We're Solving

### The Entertainment Labor Market Is Broken Online

The entertainment industry is a **$180 billion annual market** in the US alone, with **2.6 million workers**. Yet the tools available to these professionals are either:

1. **Too generic** — LinkedIn, Indeed, and Glassdoor don't understand departments, roles, or the project-based nature of the work.
2. **Too narrow** — Backstage and Casting Networks focus only on actors. StaffMeUp is crew-only. Neither connects the full ecosystem.
3. **Non-existent for operations** — No platform combines hiring, project management, payments, and professional networking in one place.

### The Result

- **Producers** maintain private spreadsheets and text message chains to staff productions.
- **Crew members** rely on word-of-mouth and hope their phone rings.
- **Casting directors** juggle multiple platforms, email chains, and paper headshots.
- **Vendors** (catering, transport, equipment) get hired through phone calls and lose invoices.
- **New entrants** can't break in because the "who you know" barrier is invisible.

### What the Industry Needs

A single platform that:
- Mirrors the actual department structure and hiring hierarchy
- Builds trust through verified collaborations, not self-reported resumes
- Handles the full lifecycle: discover → hire → work → pay → endorse
- Serves ALL roles — from Executive Producers to Set PAs to Caterers

**That's FrameOne.**

---

## 3. What FrameOne Is

FrameOne is a **three-sided marketplace**:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRAMEONE                             │
│                                                             │
│   ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│   │   SUPPLY    │  │    DEMAND    │  │    SERVICES     │   │
│   │             │  │              │  │                 │   │
│   │  Actors     │  │  Producers   │  │  Catering       │   │
│   │  Crew       │  │  Directors   │  │  Transport      │   │
│   │  Writers    │  │  Casting     │  │  Equipment      │   │
│   │  Designers  │  │  Line Prod.  │  │  Security       │   │
│   │  Technicians│  │  Dept Heads  │  │  Medical        │   │
│   │             │  │              │  │                 │   │
│   │  GOAL:      │  │  GOAL:       │  │  GOAL:          │   │
│   │  Get hired, │  │  Find & hire │  │  Get booked,    │   │
│   │  build      │  │  the right   │  │  get paid       │   │
│   │  reputation │  │  people fast │  │  on time         │   │
│   └─────────────┘  └──────────────┘  └─────────────────┘   │
│                                                             │
│                    TRUST NETWORK                            │
│          (Worked-with edges + Endorsements)                 │
└─────────────────────────────────────────────────────────────┘
```

### Core Concepts

| Concept | What It Means |
|---------|---------------|
| **Multi-Role Identity** | One person can hold multiple professional roles (e.g., Director + Writer). Each role has its own profile, portfolio, and endorsements. |
| **Project-Based Hiring** | Every hire happens within a Project. Projects have stages (Development → Production → Post), budgets, locations, and team members with specific authority levels. |
| **Authority Chain** | Not everyone can hire everyone. A Producer can hire a Line Producer. A Line Producer can hire Department Heads. A DP can hire camera crew. Permissions are project-scoped. |
| **Worked-With Graph** | When two people are assigned to the same project, a verified "worked-with" connection is automatically created. This is the trust backbone of the platform. |
| **Endorsements** | After working together, professionals can endorse each other for specific qualities (skill, reliability, professionalism, creativity, leadership). Endorsements carry the weight of the endorser's reputation. |
| **Availability System** | Every professional has a calendar showing their status: Available, Soft Hold, Firm Hold, or Booked. This is searchable by date and location. |
| **Two-Lane Payments** | Lane 1 (now): Vendor invoices → approval → Stripe payout. Lane 2 (future): Labor payroll with tax compliance. |

---

## 4. How the Platform Works

### The User Flow (High Level)

```
VISITOR
  │
  ├─→ Lands on FrameOne.com (public landing page)
  │     - Sees role showcase, features, pricing
  │     - Clicks "Get Started Free"
  │
  ├─→ REGISTRATION
  │     - Name, email, password
  │     - Account created automatically
  │
  ├─→ ONBOARDING (4-step wizard)
  │     │
  │     ├─ Step 1: CHOOSE ROLES ✦ AI-Enhanced — intelligent role suggestions from natural language
  │     │    - Browse 9 department groups
  │     │    - Select one or more roles (e.g., Director + Screenwriter)
  │     │    - Each role has a level badge (HOD, Key, Assistant, Trainee)
  │     │    - Or: describe what you do in plain English and AI suggests your roles
  │     │
  │     ├─ Step 2: BUILD PROFILES ✦ AI-Enhanced — automatic skill extraction from bio
  │     │    - For each selected role, enter:
  │     │      Display name, bio, city, state, country
  │     │    - AI auto-categorizes your bio into searchable skills, genres, and tools
  │     │    - (Later: portfolio URL, reel URL, resume)
  │     │
  │     ├─ Step 3: SELECT PLAN
  │     │    - Free ($0) — basic profile, apply to jobs
  │     │    - Pro Supply ($19/mo) — featured, rich media
  │     │    - Hiring Pro ($149/mo) — create projects, post jobs
  │     │    - Department Head ($49/mo) — dept management
  │     │    - Agency/Studio ($499/mo) — enterprise
  │     │
  │     └─ Step 4: WELCOME
  │          - Success screen
  │          - Links to complete profile, browse projects, search talent
  │
  └─→ DASHBOARD (authenticated home)
        - Stats: active projects, applications, profile views, endorsements
        - Quick actions: create project, browse, update availability
        - Recent activity feed
```

### The Hiring Flow

```
PRODUCER creates a Project
  │  (title, format, budget band, dates, locations)
  │
  ├─→ Invites LINE PRODUCER as project member
  │     (given authority: canHire, canApproveOffers, canApproveInvoices)
  │
  ├─→ Line Producer hires DEPARTMENT HEADS
  │     ├─ Director of Photography
  │     ├─ Production Designer
  │     ├─ First Assistant Director
  │     ├─ Production Sound Mixer
  │     └─ etc.
  │
  ├─→ Each Department Head opens REQUISITIONS
  │     (role needed, dates, rate range, requirements)
  │     ✦ AI-Enhanced — intelligent candidate ranking via Smart Match
  │
  ├─→ Crew members APPLY to requisitions
  │     (cover note, materials/reel links)
  │
  ├─→ Department Head reviews, creates OFFER
  │     (proposed rate, terms)
  │     │
  │     ├─→ Offer goes through APPROVAL GATE
  │     │     (LP or Producer must approve offers above threshold)
  │     │
  │     └─→ Applicant ACCEPTS or COUNTERS
  │
  └─→ ASSIGNMENT created
        │
        ├─→ Worked-with edges generated with all other project members
        ├─→ Endorsement eligibility unlocked
        └─→ Credit added to professional's profile
```

### The Casting Flow

```
CASTING DIRECTOR creates a BREAKDOWN
  │  (role name, description, age range, gender, compensation, deadline)
  │
  ├─→ TALENT submits to breakdown
  │     (headshot, reel link, cover note)
  │
  ├─→ Casting Director reviews SUBMISSIONS
  │     ├─ Views / shortlists / rejects
  │     │
  │     ├─→ Schedules AUDITIONS
  │     │     (in-person, self-tape, or virtual)
  │     │
  │     └─→ Creates SHORTLIST
  │           (ranked candidates with hold status)
  │
  └─→ Final selection → BOOKING
        (assignment created, worked-with edges generated)
```

---

## 5. User Types & Roles

FrameOne supports **43 specialized roles** organized into **9 department groups**. This is critical — the entertainment industry doesn't have generic "workers." Every role has specific responsibilities, hiring relationships, and network dependencies.

### The 9 Department Groups

| # | Department | What They Do | # of Roles |
|---|-----------|-------------|-----------|
| 1 | **Above-the-Line** | Creative and financial leadership | 6 |
| 2 | **Production Office** | Logistics, administration, cost control | 5 |
| 3 | **Assistant Directing** | Scheduling, set management, safety | 4 |
| 4 | **Camera / Lighting / Grip** | Image capture and physical support | 7 |
| 5 | **Art / Costume / HMU** | Visual world-building and appearance | 6 |
| 6 | **Sound** | Production audio capture | 2 |
| 7 | **Post-Production** | Editing, VFX, delivery | 3 |
| 8 | **Services & Vendors** | Catering, transport, equipment, etc. | 6 |
| 9 | **Representation & Legal** | Agents, managers, casting, lawyers | 4 |

### Why This Matters

Ralph's original site had 7 roles: Director, Project Manager, Casting Agent, Lawyer, Talent, Crew, Caterer.

**The problem:** "Crew" is not a role — it's dozens of roles across different departments with different skills, different hiring paths, and different rates. A Gaffer and a Costume Designer have nothing in common except both being "below the line." Lumping them together makes the platform useless for actual hiring.

FrameOne's taxonomy mirrors how productions actually staff: by department, with specific roles at specific levels.

---

## 6. Complete Role Directory

### Above-the-Line (Creative & Financial Leadership)

| Role | Level | Description |
|------|-------|-------------|
| **Producer** | HOD | Principal project authority. Responsible for all aspects from development to distribution. Hires the Line Producer and key creative team. |
| **Executive Producer** | HOD | Oversees the journey from script to screen. Manages relationships with commissioners and financiers. |
| **Director** | HOD | Creative visionary. Interprets the script and guides all creative departments. |
| **Screenwriter** | Principal | Develops and writes screenplays, treatments, and story materials. |
| **Development Producer** | HOD | Finds and develops stories/scripts to production readiness. |
| **Script Editor** | Key | Liaises between writer and production to improve scripts through structured feedback. |

### Production Office (Logistics & Administration)

| Role | Level | Description |
|------|-------|-------------|
| **Line Producer** | HOD | Hires crew, allocates budget, ensures filming is safe, on budget, and on time. The "hiring spine" of every production. |
| **Production Manager / UPM** | HOD | Manages day-to-day logistics, schedules, resources, and personnel. |
| **Production Coordinator** | Key | Prepares and distributes crew lists, progress reports, call sheets, and transport requirements. |
| **Production Accountant** | Key | Manages accounts, processes payments, conducts payroll checks, ensures tax/employment compliance. |
| **Production Assistant / Runner** | Trainee | Distributes paperwork, handles errands, provides general production support. Entry-level position. |

### Assistant Directing (Schedule & Set Management)

| Role | Level | Description |
|------|-------|-------------|
| **First Assistant Director** | HOD | Plans the filming schedule, breaks down the script, manages the set during filming. The Director's operational right hand. |
| **Second Assistant Director** | Key | Organizes fittings/rehearsals, prepares call sheets, coordinates actor readiness. |
| **Floor Runner / Set PA** | Trainee | Supports the AD team with on-set errands, messages, and logistics. |
| **Script Supervisor** | Key | Monitors continuity, coverage, and serves as the link between director and editorial. |

### Camera / Lighting / Grip (Image Capture & Support)

| Role | Level | Description |
|------|-------|-------------|
| **Director of Photography** | HOD | Defines the photographic look. Determines lighting and framing. Supervises camera, grip, and lighting departments. |
| **Camera Operator** | Key | Plans movement, frames and composes shots, coordinates with grips. |
| **First Assistant Camera** | Assistant | Manages camera crew, sets up and maintains cameras, executes focus pulling. |
| **Digital Imaging Technician** | Key | Manages digital workflow, advises on exposure/contrast, ensures image pipeline integrity. |
| **Gaffer** | HOD | Head of lighting. Plans and executes on-set lighting. Responsible for electrical safety. |
| **Key Grip** | HOD | Makes camera movement physically possible. Plans rigging and camera support execution. |
| **Video Assist Operator** | Assistant | Assists director and script supervisor with monitored playback and continuity. |

### Art / Costume / HMU (Visual World-Building)

| Role | Level | Description |
|------|-------|-------------|
| **Production Designer** | HOD | Creates the visual world of the production. Coordinates all visual departments. |
| **Art Director** | Key | Interprets and operationalizes the production designer's vision. |
| **Set Decorator** | Key | Creates background environments — walls, floors, furniture, vehicles. |
| **Props Master** | Key | Runs the property department. Makes, stores, transports, and prepares all props. |
| **Costume Designer** | HOD | Designs, creates, and sources all costumes in collaboration with the creative team. |
| **Hair & Makeup Designer** | HOD | Creates hair and makeup looks. Breaks down script requirements. Recruits HMU team. |

### Sound (Production Audio)

| Role | Level | Description |
|------|-------|-------------|
| **Production Sound Mixer** | HOD | Head of sound department. Responsible for all audio captured during filming. |
| **Boom Operator** | Assistant | Handles mic placement on set. Operates boom pole. Places personal mics on talent. |

### Post-Production (Editing & Delivery)

| Role | Level | Description |
|------|-------|-------------|
| **Editor** | HOD | Crafts the story from assembly through picture lock. Works closely with director and producers. |
| **Post-Production Supervisor** | HOD | Manages post budget, schedules, vendors, and technical delivery requirements. |
| **Colorist** | Key | Performs color grading and correction to achieve the final visual look. |

### Services & Vendors

| Role | Level | Type | Description |
|------|-------|------|-------------|
| **Catering** | Key | Vendor | Provides scheduled meals for cast and crew on location. |
| **Craft Services** | Key | Vendor | Provides continuous snacks, drinks, and refreshment support throughout the day. |
| **Transportation Captain** | Key | Staff | Oversees movement of all cast, crew, equipment, and picture vehicles. |
| **Security** | Key | Vendor | Provides set and location security services. |
| **Set Medic** | Key | Vendor | Provides on-set medical support and first aid. |
| **Equipment Rental** | Key | Vendor | Provides camera, lighting, grip, and other production equipment. |

### Representation & Legal

| Role | Level | Description |
|------|-------|-------------|
| **Casting Director** | HOD | Matches actors to roles. Manages auditions and talent recommendations. Hired by the production. |
| **Talent Agent** | Key | Represents and promotes clients. Handles contract negotiation and submissions. |
| **Talent Manager** | Key | Provides long-term career strategy, packaging, and professional guidance. |
| **Entertainment Lawyer** | Key | Handles contracts, rights clearance, chain-of-title documentation, and legal compliance. |

---

## 7. Membership & Pricing

### Pricing Strategy

Our pricing separates **what you do** (your role) from **what you pay** (your tier). A Producer on the Free tier and a PA on the Free tier both have basic profiles — but a Producer who wants to create projects and hire people needs the Hiring Pro tier.

This is the opposite of Ralph's original approach, where each role had a fixed price. That model breaks when someone is both a Director ($99/mo) and a Producer — do they pay both?

### Tier Structure

| Tier | Monthly Price | Target Users | What You Get |
|------|-------------|-------------|-------------|
| **Free** | $0 | Talent & Crew (entry) | Basic profile, apply to public jobs, limited messages, browse projects |
| **Pro Supply** | $19/mo | Talent & Crew (serious) | Featured search placement, rich media portfolio, availability alerts, priority applications, endorsement badges |
| **Hiring Pro** | $149/mo | Producers, Line Producers, Production Managers, Casting Directors | Create unlimited projects, post requisitions, send offers, casting breakdowns, shortlist management, invoice workflows, team collaboration |
| **Department Head** | $49/mo | DPs, Production Designers, Sound Mixers, 1st ADs | Department requisitions, crew roster management, limited offer approvals, enhanced portfolio, priority search |
| **Agency / Studio** | $499/mo | Agencies, Management Companies, Production Studios | Multi-user seats, slate management, compliance filters, bulk workflows, API access, dedicated support, custom branding |

### Revenue Model

| Revenue Stream | When | How |
|---------------|------|-----|
| **Subscriptions** | MVP | Monthly recurring revenue from paid tiers |
| **Transaction fees** | MVP | Percentage fee on vendor invoice payouts (e.g., 2.9% + $0.30) |
| **Featured listings** | Phase 2 | Vendors and service providers pay for featured placement in search |
| **Enterprise contracts** | Phase 3 | Annual contracts with studios and agencies |

### Why Free Tier Matters

The supply side (talent and crew) must be free or very cheap. They are the "inventory" of the marketplace. If we charge $50/mo for actors (like Ralph's original pricing), we'll never reach the density needed for producers to find value. The industry standard (Backstage, Casting Networks) charges $20-30/mo for talent. We undercut them at $0 for basic and $19 for premium.

Revenue comes from the **demand side** — the people who hire. A Producer saving 20 hours of phone calls to staff a production will gladly pay $149/mo.

---

## 8. Core Features Breakdown

### 8.1 Multi-Role Profiles

Every user can maintain profiles across multiple roles. This is unique to FrameOne. ✦ AI-Enhanced — automatic skill extraction parses your bio into searchable tags for skills, genres, tools, and specialties.

**Example:** Sarah is a Director of Photography on feature films but also works as a Camera Operator on commercials and teaches as a DIT on training films. On FrameOne, she has three role profiles:
- **DP profile** — feature film reel, credits from major projects, endorsements from directors
- **Camera Operator profile** — commercial reel, different credits
- **DIT profile** — training work, technical certifications

Each profile has its own: bio, portfolio, reel, credits, endorsements, and availability settings.

### 8.2 Project Management

Projects are the organizational unit for all hiring, casting, and payments.

**A Project includes:**
- Title and logline
- Format (Feature, Episodic, Short, Commercial, Music Video, Documentary, Web Series, Theater)
- Stage (Development, Pre-Production, Production, Post-Production, Distribution)
- Budget band (optional, visible only to authorized members)
- Date range
- Locations
- Team members with specific authority permissions

### 8.3 Requisitions & Applications

Within a project, authorized members post **Requisitions** — specific job openings. ✦ AI-Enhanced — intelligent candidate ranking scores and ranks top matches for every requisition.

**A Requisition includes:**
- Role (from the 43-role taxonomy)
- Department
- Level (HOD, Key, Assistant, Trainee)
- Date range
- Rate range and rate type (hourly, daily, weekly, flat)
- Location requirements
- Status: Draft → Open → Filled → Cancelled

Professionals **Apply** to requisitions with a cover note and materials (reel links, portfolio).

### 8.4 Offers & Assignments

When a hiring authority selects an applicant, they create an **Offer** with specific terms and rate. The offer goes through an **Approval Gate** — if the rate exceeds the Line Producer's threshold, the Producer must also approve.

When accepted, an **Assignment** is created, which:
- Confirms the person on the project
- Generates **worked-with edges** with all other assigned team members
- Unlocks **endorsement eligibility** between collaborators
- Creates a **Credit** on the professional's profile

### 8.5 Casting Workflow

For talent roles, the casting flow is separate and more nuanced:

1. **Breakdown** — Casting Director posts character descriptions with age range, gender, ethnicity, compensation
2. **Submissions** — Talent (or their agents) submit headshots, reels, and cover notes
3. **Auditions** — In-person, self-tape, or virtual auditions are scheduled
4. **Shortlist** — Ranked candidates with hold status (Soft Hold, Firm Hold)
5. **Booking** — Final selection converts to an assignment

### 8.6 Search & Discovery

The Discover page lets anyone search across the entire platform. ✦ AI-Enhanced — natural language search powered by Claude. Type queries like "Looking for a DP in LA available in June" and AI parses it into structured database filters.

- **By role/department** — "Show me all DPs in Atlanta"
- **By availability** — "Who's available in March?"
- **By location** — city, state, country, radius
- **By experience level** — HOD, Key, Assistant, Trainee
- **By keywords** — name, bio, skills
- **By natural language** — type what you need in plain English and AI handles the rest

Results show: avatar, name, primary role, location, availability status (green/yellow/red dot), credit count, endorsement count.

### 8.7 Availability Management

Every professional can set availability blocks:

| Status | Meaning | Visual |
|--------|---------|--------|
| **Available** | Open for work | Green dot (pulsing) |
| **Soft Hold** | Tentatively reserved but not confirmed | Yellow dot |
| **Firm Hold** | Reserved, awaiting contract | Yellow dot |
| **Booked** | Confirmed and committed | Red dot |

Availability is searchable by date range and location, so hiring managers can filter for people who are actually free.

### 8.8 Document Vault

Every project has a secure document vault for:
- Contracts and deal memos
- Call sheets and sides
- NDAs
- Chain-of-title documents
- Insurance certificates

Documents have confidentiality levels: Public, Project Members, Restricted, Top Secret. Access is controlled per-user with read/write/sign permissions.

---

## 9. AI-Powered Intelligence Layer

FrameOne is the first entertainment industry platform with production-aware artificial intelligence built directly into its core workflows. The AI intelligence layer is not a roadmap item — it is **built and functional today**, powering six distinct features across hiring, search, profiles, networking, onboarding, and casting.

All AI features use **Anthropic's Claude** (model: `claude-sonnet-4-20250514`) via the standard Anthropic API. Cost is included in platform operating expenses and is not passed to users. At current API pricing, each AI call costs approximately $0.003 to $0.01, making the entire AI layer negligible relative to subscription revenue.

---

### 9.1 Smart Match — AI-Powered Candidate Ranking ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/smart-match` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

When a Producer or Department Head posts a job requisition, they can click **"Find Best Matches"** and the AI analyzes the entire candidate pool, returning a ranked list of the top 10 matches. Each match includes a score from 0 to 100 and a written explanation of why the candidate fits.

**What the AI evaluates:**
- **Availability** — Is the candidate free during the shoot dates?
- **Location** — Are they near the production or willing to travel?
- **Experience** — How many past projects and endorsements do they have?
- **Endorsements** — What do past collaborators say about their work?
- **Bio relevance** — Does their described experience align with what the production needs?

**Example output:** "Marcus Johnson — 95% match. Based in Atlanta, available March through May, 14 past projects, 8 endorsements from DPs. His bio mentions extensive experience with LED lighting on indie features, which aligns with this production's format."

---

### 9.2 Natural Language Search ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/natural-search` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

Users type queries in plain English — like **"Looking for a DP in LA available in June"** — and the AI parses the sentence into structured database filters: role, department, location, dates, level, keywords, and intent.

**What the AI extracts:**
- **Role** — maps informal terms ("camera guy") to the correct taxonomy role (Camera Operator)
- **Department** — infers the department group from context
- **Location** — resolves city names, abbreviations, and regions
- **Dates** — parses availability windows from natural phrasing
- **Level** — detects experience tier references (HOD, senior, entry-level)
- **Keywords** — captures genre, specialty, and skill references
- **Intent** — determines if the user is hiring, browsing, or looking for a specific person

This makes the Discover page feel like talking to an assistant rather than filling out a form.

---

### 9.3 Auto-Categorization — Intelligent Profile Tagging ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/categorize` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

When a member writes or updates their bio, the AI reads it and automatically extracts structured metadata:

- **Skills** — LED lighting, DMX programming, Steadicam operation, etc.
- **Genres** — horror, thriller, documentary, commercial, etc.
- **Tools** — ARRI SkyPanel, RED Komodo, DaVinci Resolve, etc.
- **Specialties** — atmospheric lighting, underwater cinematography, etc.
- **Experience indicators** — years of experience, project volume, career stage

These are saved as searchable profile tags, making every member's profile automatically more discoverable — even when searchers use different terminology than what appears in the bio.

---

### 9.4 Crew Recommendations — Network-Aware Matching ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/crew-recommendations` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

When a project has open requisitions, the AI analyzes the hiring manager's **worked-with network** — every person they have collaborated with on past projects — and recommends specific people for each open role.

**Prioritization criteria:**
- Role match — the contact's role directly matches the open position
- Endorsement strength — more endorsements indicate higher trust and reliability
- Direct collaboration history — people you have personally worked with carry lower hiring risk
- Recency — recent collaborators are weighted higher

This mirrors how the industry actually works: people hire people they know. The AI makes that process instant instead of requiring phone calls and mental Rolodexes.

---

### 9.5 Role Suggestions — Onboarding Intelligence ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/role-suggestions` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

During onboarding, new members can describe what they do in their own words — like **"I work in camera departments, mostly pulling focus and operating on commercials, but I also do some DIT work on smaller shoots"** — and the AI suggests the top 3-5 matching roles from the 40+ role taxonomy.

Each suggestion includes a confidence level (high, medium, low) and a brief explanation of why that role fits. This removes the friction of navigating 43 roles across 9 departments, especially for people earlier in their careers who may not know the formal industry terminology.

---

### 9.6 Pre-Screen Questions — Casting Intelligence ✦ AI-Enhanced

> **Status:** BUILT AND FUNCTIONAL | **Backend API:** `/api/ai/pre-screen-questions` | **AI Provider:** Anthropic Claude (`claude-sonnet-4-20250514`) | **Subscription:** Anthropic standard API pricing (pay-per-use, cost absorbed by platform) | **Tier:** Free tier deployed

When a Casting Director or Producer creates a casting breakdown, they can generate AI-suggested pre-screen questions tailored to the specific role requirements. The `suggestPreScreenQuestions` function analyzes the breakdown details — character description, role type, age range, compensation, and production context — and generates relevant screening questions that help filter candidates before the audition stage.

**What the AI considers:**
- **Role requirements** — physical attributes, skills, or experience specified in the breakdown
- **Production context** — format (feature, episodic, commercial), genre, and tone
- **Practical logistics** — availability, travel willingness, union status, special skills
- **Character-specific needs** — accent requirements, stunt work, dialect, or technical abilities mentioned in the description
- **Industry standards** — common pre-screen questions used by professional casting directors

**Example output:** For a breakdown seeking a lead actress for an action thriller, the AI might suggest: "Do you have experience with choreographed fight sequences or stunt work?", "Are you comfortable performing your own stunts with a stunt coordinator?", "Do you have a valid passport for potential international shoots?", "Can you provide a self-tape within 48 hours of request?", and "Are you available for a 6-week continuous shoot?"

This saves Casting Directors significant time crafting screening questionnaires from scratch and ensures that important logistical and creative questions are not overlooked during the early filtering stage.

---

### How the AI Connects to the Platform

The AI is not a bolt-on feature. It is woven into existing workflows:

| Platform Surface | AI Feature | What It Does |
|-----------------|-----------|-------------|
| **Discover page** | Natural Language Search | Type instead of clicking filters |
| **Requisition detail page** | Smart Match | "Find Best Matches" button ranks candidates |
| **Project dashboard** | Crew Recommendations | "Recommended Crew" section from your network |
| **Profile edit page** | Auto-Categorization | "Auto-tag my profile" extracts skills from bio |
| **Onboarding wizard** | Role Suggestions | "Describe what you do" suggests matching roles |
| **Casting breakdown editor** | Pre-Screen Questions | "Suggest Questions" generates screening questions for the role |

---

## 10. Admin Portal

FrameOne includes a full-featured admin portal for platform management, content moderation, and operational oversight. The admin portal is accessible only to users with elevated roles and provides comprehensive tools for managing every aspect of the platform.

### 10.1 Admin Dashboard

The admin dashboard provides a real-time overview of platform health and key performance indicators (KPIs):

- **Total users** — registered accounts, active users, new signups (daily/weekly/monthly)
- **Platform activity** — projects created, requisitions posted, applications submitted, offers made
- **Revenue metrics** — MRR, subscription breakdown by tier, transaction volume
- **AI usage** — total AI calls, calls per feature, average response time, cost tracking
- **System health** — error rates, API response times, uptime

### 10.2 User Management

Admins can search, view, and manage all platform users:

- **Search and filter** — by name, email, role, subscription tier, registration date, status
- **User detail view** — full profile information, subscription history, activity log, linked projects
- **Ban / suspend users** — temporarily suspend or permanently ban accounts with reason tracking
- **Role assignment** — assign or revoke platform-level roles (USER, ADMIN, SUPER_ADMIN)
- **Impersonation** — SUPER_ADMIN can view the platform as any user for debugging and support (all impersonation actions are audit-logged)

### 10.3 Content Moderation

Tools for reviewing and moderating user-generated content:

- **Profile review queue** — flagged bios, photos, and portfolio content
- **Project moderation** — review reported projects and requisitions
- **Casting breakdown review** — ensure breakdowns comply with platform guidelines and anti-discrimination policies
- **Bulk actions** — approve, reject, or flag multiple items at once
- **Moderation history** — full log of all moderation decisions with moderator attribution

### 10.4 Message Monitoring

Oversight tools for platform communications:

- **Flagged messages** — automatically flagged messages containing prohibited content, spam, or harassment indicators
- **Reported conversations** — user-reported message threads for review
- **Message search** — search messages by keyword, sender, recipient, or date range (restricted to SUPER_ADMIN)
- **Action tools** — warn users, delete messages, suspend messaging privileges

### 10.5 Financial Overview / Payments

Comprehensive view of all platform financial activity:

- **Transaction history** — all Stripe transactions with status, amount, parties, and timestamps
- **Invoice tracking** — pending, approved, disputed, and paid invoices across all projects
- **Subscription analytics** — active subscriptions by tier, churn rate, upgrade/downgrade trends
- **Payout monitoring** — vendor payout status and Stripe Connect account health
- **Revenue reports** — exportable reports by date range, tier, and transaction type

### 10.6 Reports & Violations

Centralized system for handling platform reports and policy violations:

- **Report queue** — all user-submitted reports (harassment, fraud, impersonation, spam) with priority levels
- **Violation tracking** — per-user violation history with escalation status
- **Resolution workflow** — assign reports to admins, add internal notes, resolve with documented outcomes
- **Strike system** — configurable warning/strike thresholds before automatic suspension
- **Appeal management** — users can appeal moderation decisions; admins review and resolve

### 10.7 AI Intelligence Settings

Full control over the platform's AI intelligence layer:

- **Feature toggles** — enable or disable individual AI features (Smart Match, Natural Language Search, Auto-Categorization, Crew Recommendations, Role Suggestions, Pre-Screen Questions)
- **Model selection** — change the AI model (e.g., switch between Claude Sonnet and Claude Haiku for cost optimization)
- **Token limits** — set maximum input and output token limits per AI feature
- **Temperature control** — adjust AI response creativity/determinism per feature (0.0 to 1.0)
- **Page attachment** — configure which platform pages and surfaces each AI feature is active on
- **Custom prompts** — edit and version the system prompts used by each AI feature, with rollback capability
- **Usage dashboard** — real-time and historical AI usage metrics, cost per feature, error rates

### 10.8 Platform Rules & Settings

Global platform configuration:

- **Membership tier settings** — adjust pricing, feature limits, and tier descriptions
- **Platform policies** — manage terms of service, community guidelines, and privacy policy content
- **Feature flags** — toggle platform-wide features on/off for staged rollouts
- **Rate limits** — configure API rate limits per tier and per endpoint
- **Notification templates** — manage email and in-app notification templates
- **Taxonomy management** — add, edit, or deprecate roles and department groups

### 10.9 Activity Audit Log

Immutable record of all administrative and sensitive platform actions:

- **Full audit trail** — every admin action is logged with actor, action, target, timestamp, and metadata
- **Filterable views** — filter by admin user, action type, date range, and target entity
- **Export capability** — export audit logs as CSV for compliance and external review
- **Retention policy** — audit logs are retained indefinitely and cannot be modified or deleted
- **Covers all domains** — user management actions, moderation decisions, financial operations, AI setting changes, role assignments, and system configuration changes

### 10.10 Role-Based Access Control

The admin portal enforces two levels of administrative access:

| Role | Access Level | Capabilities |
|------|-------------|-------------|
| **ADMIN** | Standard admin | User management (search, view, suspend), content moderation, report handling, financial overview (read-only), audit log viewing |
| **SUPER_ADMIN** | Full platform control | Everything ADMIN can do, plus: user banning, role assignment, AI intelligence settings, platform rules & settings, message monitoring (full search), user impersonation, audit log export, taxonomy management |

All admin actions are logged in the audit trail regardless of role level. SUPER_ADMIN access is restricted to founding team members and designated technical leads.

---

## 11. User Journeys

### Journey 1: Actor Looking for Work

1. Signs up → Free tier
2. Onboarding: selects "Talent" role (under Above-the-Line group... wait, talent would typically be in a general category). Actually selects from available roles
3. Builds profile: headshot, reel link, bio, location (Los Angeles), training
4. Sets availability: Available March 1 – June 30, LA area
5. Browses casting breakdowns → finds a role matching their type
6. Submits to breakdown with headshot and reel
7. Gets audition callback → attends virtual audition
8. Shortlisted → Put on Firm Hold
9. Booked → Assignment created
10. After production: receives endorsements from Director and Casting Director
11. Worked-with edges connect them to 30+ crew members from the project

### Journey 2: Producer Staffing a Feature Film

1. Signs up → Hiring Pro tier ($149/mo)
2. Onboarding: selects "Producer" role
3. Creates a Project: "Midnight Runner" — Feature Film, Pre-Production, $2M budget, Atlanta
4. Invites Line Producer (existing FrameOne member) with full authority
5. Line Producer posts requisitions for Department Heads:
   - DP, Production Designer, 1st AD, Production Sound Mixer, Costume Designer
6. Applications come in → LP reviews, shortlists, sends offers
7. DP is hired → DP now has authority to post requisitions for camera crew
8. DP posts: Camera Operator, 1st AC, Gaffer, Key Grip, DIT
9. Process cascades through all departments
10. 45 crew members hired through the platform
11. Production completes → 45 × 44 / 2 = 990 worked-with edges created
12. Trust network grows exponentially

### Journey 3: Catering Company Getting Booked

1. Signs up → Free tier (vendor)
2. Onboarding: selects "Catering" role (vendor type)
3. Builds profile: service region (Georgia), capacity (up to 200), mobile kitchen specs, dietary capabilities
4. Appears in search when producers look for catering in Atlanta
5. Gets booked for "Midnight Runner" project
6. After providing meals for 6 weeks, submits invoice through platform
7. Producer's Production Accountant approves the invoice
8. Payout processed through Stripe Connect
9. Receives endorsement from UPM for reliability

---

## 12. Payment System

### Two-Lane Architecture

FrameOne implements payments in two phases to manage complexity and compliance risk:

**Lane 1: Vendor Payouts (MVP — built now)**
```
Vendor submits Invoice
  → Line Items (description, quantity, unit price, amount)
  → Attached to a Project
  → Total amount + currency

Production Accountant or LP reviews
  → Approves or Disputes

On Approval:
  → Stripe Connect processes payout to vendor's connected account
  → Audit event logged
  → Payout status tracked: Pending → Processing → Completed
```

This handles: catering, equipment rental, location fees, transportation, craft services, etc.

**Lane 2: Labor Payroll (Phase 3 — future)**
```
Crew member completes work period
  → Timesheet submitted
  → Rate applied from assignment terms

Production Accountant verifies
  → Tax withholding calculated (jurisdiction-dependent)
  → Payrun batch created

Payroll processed
  → Compliance with W-2/1099 requirements
  → Tax documents generated
```

This is significantly more complex due to employment law, tax withholding, union requirements, and state-by-state regulations. We build Lane 1 first and add Lane 2 once we have legal counsel on compliance.

### Why Stripe Connect?

- **Industry standard** for marketplace payments
- **Handles onboarding** — vendors connect their bank accounts through Stripe's hosted flow
- **PCI compliant** — we never touch or store credit card numbers
- **Global** — supports 40+ countries
- **Transparent fees** — 2.9% + $0.30 per transaction (we can add a platform fee on top)

---

## 13. Trust & Reputation System

### The Problem with Self-Reported Resumes

On LinkedIn, anyone can claim "10 years of experience as a DP." There's no verification. In the entertainment industry, this is dangerous — an unqualified grip can cause a safety incident that shuts down production.

### FrameOne's Trust Model

**Layer 1: Worked-With Graph**

When two people are assigned to the same project, a **WorkedWithEdge** is automatically created with:
- The project they worked on
- Each person's role on that project
- The date range

This is **unfakeable** — you can't create a worked-with edge without both people being assigned to the same project by someone with hiring authority.

**Layer 2: Endorsements**

After working together, professionals can endorse each other. Endorsements are:
- **Role-scoped** — a DP endorses a Gaffer for lighting skill, not for catering
- **Type-categorized** — Skill, Professionalism, Reliability, Creativity, Leadership
- **Optional text and rating** — 1-5 stars with written comments
- **Project-linked** — endorsements can reference the specific project

**Layer 3: Verified Credits**

Every project assignment creates a credit on the professional's profile. Over time, this builds an **IMDb-like credit history** that's verified by the hiring chain, not self-reported.

**The Network Effect** ✦ AI-Enhanced — network-aware crew suggestions powered by Claude

As more productions run through FrameOne:
- More worked-with edges are created
- Search results can be ranked by "degrees of connection" to the searcher
- A Producer can see: "This Gaffer was endorsed by my DP from last project" — instant trust signal
- AI analyzes your worked-with network and recommends past collaborators for open positions
- The platform becomes more valuable as more people use it (classic network effect)

---

## 14. Technical Architecture Overview

### Tech Stack (for non-engineers)

| Component | Technology | What It Does |
|-----------|-----------|-------------|
| **Frontend** | Next.js + React | What users see and click on. Renders pages, forms, dashboards. |
| **Backend** | Next.js API Routes | Handles business logic. Processes requests, enforces rules, talks to database. |
| **Database** | PostgreSQL | Stores all data — users, roles, projects, applications, payments, etc. |
| **Authentication** | NextAuth | Manages login sessions. Encrypts passwords. Handles "remember me." |
| **Payments** | Stripe Connect | Processes vendor payouts. Handles bank account connections. |
| **AI Layer** | Anthropic Claude | Powers Smart Match, natural language search, auto-categorization, crew recommendations, role suggestions, and pre-screen questions. |
| **Email** | Resend | Transactional email service for password resets, notifications, and system communications. Free tier (100 emails/day). |
| **Styling** | Tailwind CSS | Makes everything look good. Dark theme with indigo/gold brand colors. |
| **Validation** | Zod | Checks that data is correct before saving. Prevents invalid inputs. |
| **Language** | TypeScript | JavaScript with type safety. Catches bugs before they reach users. |

### Why We Chose This Stack

1. **Next.js** — Used by Netflix, TikTok, Hulu, Notion. Handles both the website and the API in one codebase.
2. **PostgreSQL** — The world's most advanced open-source database. Perfect for the complex relationships between users, roles, projects, and credits.
3. **Stripe Connect** — The industry standard for marketplace payments. Uber, Lyft, Shopify, and DoorDash all use it.
4. **Tailwind CSS** — Fastest way to build beautiful, responsive UIs. No separate design files needed.

### Why NOT Laravel (Ralph's Original Choice)

Ralph's original site was built with Laravel (PHP). Here's why we moved to Next.js:

| Aspect | Laravel (Ralph's) | Next.js (Ours) |
|--------|-------------------|----------------|
| Language | PHP | TypeScript |
| Real-time features | Requires separate WebSocket server | Built-in |
| API + Frontend | Separate layers | Unified in one codebase |
| Deployment | Cloudways only | Vercel, AWS, Railway, self-hosted |
| Type safety | None built-in | Full TypeScript |
| Scaling | PHP workers (vertical) | Serverless (horizontal) |
| Developer pool | Shrinking | Growing rapidly |

---

## 15. Site Map & Page Structure

### Public Pages (No Login Required)

| Page | URL | Purpose |
|------|-----|---------|
| **Landing Page** | `/` | Marketing page. Hero, features, role showcase, pricing, CTAs. |
| **Login** | `/auth/login` | Email + password login form. |
| **Register** | `/auth/register` | Account creation form. |
| **Forgot Password** | `/auth/forgot-password` | Request a password reset link via email. |
| **Reset Password** | `/auth/reset-password` | Set a new password using a secure reset token. |

### Onboarding (Requires Login, Before Dashboard Access)

| Page | URL | Purpose |
|------|-----|---------|
| **Onboarding Wizard** | `/onboarding` | 4-step process: Choose Roles → Build Profiles → Select Plan → Welcome |

### Authenticated Pages (Main App)

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/dashboard` | Home. Stats, quick actions, recent activity. |
| **Discover** | `/discover` | Search talent, crew, vendors by role, location, availability. |
| **Projects** | `/projects` | List of user's projects. Create new project. |
| **Project Detail** | `/projects/[id]` | Project management: members, requisitions, casting, documents. |
| **Casting** | `/casting` | Browse casting breakdowns. Submit to roles. |
| **Messages** | `/messages` | Notification-based communication. |
| **My Profiles** | `/profile/edit` | Edit role profiles, portfolio, reel, bio. |
| **Availability** | `/availability` | Set and manage availability calendar. |
| **Applications** | `/applications` | Track job applications and their status. |
| **Payments** | `/payments` | Payment history and Stripe Connect setup. |
| **Invoices** | `/invoices` | Submit and track invoices. |
| **Settings** | `/settings` | Account settings, billing, preferences. |

---

## 16. API Endpoints

The backend exposes 24 API endpoints that handle all data operations:

### Authentication
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST/GET | `/api/auth/[...nextauth]` | Login, session management |

### User
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/PATCH | `/api/users/me` | Get or update current user |

### Onboarding
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| POST | `/api/onboarding/complete` | Save role selections, profiles, plan |

### Projects
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/POST | `/api/projects` | List or create projects |
| GET/PATCH/DELETE | `/api/projects/[id]` | Get, update, or delete a project |
| GET/POST | `/api/projects/[id]/members` | List or add project members |

### Hiring
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/POST | `/api/requisitions` | List or create job requisitions |
| GET/PATCH | `/api/requisitions/[id]` | Get or update a requisition |
| GET/POST | `/api/applications` | List or submit applications |
| GET/PATCH | `/api/applications/[id]` | Get or update application status |
| POST | `/api/offers` | Create an offer |
| GET/PATCH | `/api/offers/[id]` | Get or respond to an offer |

### Profiles & Trust
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/POST | `/api/profiles` | List or add role profiles |
| GET/PATCH | `/api/profiles/[id]` | View or edit a profile |
| GET/POST | `/api/endorsements` | List or create endorsements |
| GET/POST/DELETE | `/api/availability` | Manage availability blocks |

### Casting
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/POST | `/api/casting/breakdowns` | List or create casting breakdowns |
| GET/PATCH | `/api/casting/breakdowns/[id]` | View or update a breakdown |
| GET/POST | `/api/casting/submissions` | List or submit to breakdowns |

### Finance
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET/POST | `/api/invoices` | List or create invoices |
| GET/PATCH | `/api/invoices/[id]` | View or approve/reject invoices |

### Discovery
| Method | Endpoint | What It Does |
|--------|---------|-------------|
| GET | `/api/search` | Search profiles, projects, requisitions |
| GET | `/api/taxonomy` | Get all department groups and roles |

---

## 17. Database Structure

The platform stores data in **25 interconnected tables** across 7 domains:

### Domain Map

```
IDENTITY (who you are)
  ├── users — login credentials, name, avatar
  ├── accounts — billing entity (individual or company)
  └── memberships — subscription tier and status

ROLES (what you do)
  ├── taxonomy_groups — 9 department categories
  ├── roles — 43 specific positions
  ├── role_profiles — your profile for each role
  └── role_profile_fields — extensible per-role data

PROJECTS (where you work)
  ├── projects — productions with dates, budget, locations
  ├── project_members — who's on the project and their authority
  ├── requisitions — job openings within a project
  ├── applications — people applying to requisitions
  ├── offers — terms proposed to applicants
  ├── project_assignments — confirmed team members
  └── credits — verified work history entries

TRUST (who vouches for you)
  ├── worked_with_edges — verified collaboration connections
  ├── endorsements — skill/quality ratings from collaborators
  └── availability — schedule and hold status

CASTING (talent-specific workflow)
  ├── breakdowns — character/role descriptions
  ├── submissions — talent applying to breakdowns
  ├── auditions — scheduled audition sessions
  └── shortlist_entries — ranked candidates

PAYMENTS (money movement)
  ├── invoices — vendor bills with line items
  └── payouts — processed payments

SYSTEM
  ├── documents — uploaded files with access control
  ├── document_access — per-user file permissions
  └── audit_events — immutable activity log
```

---

## 18. Security & Privacy

### Authentication
- Passwords are hashed with **bcrypt** (12 rounds) — even if the database is breached, passwords cannot be recovered
- Sessions use **JWT tokens** stored in HTTP-only cookies
- Session duration: 30 days with automatic refresh

### Authorization
- Every API endpoint checks authentication before processing
- Project-level permissions are enforced through **authority flags**:
  - `canHire` — can post requisitions and send offers
  - `canApproveOffers` — can approve offers above a threshold
  - `canApproveInvoices` — can approve vendor payments
  - `canManageDocs` — can upload and manage project documents

### Payment Security
- **PCI DSS compliant** through Stripe — we never see, store, or transmit credit card numbers
- All payment operations are logged in the audit trail
- Invoice approvals require authorized users

### Data Protection
- Document confidentiality levels prevent unauthorized access
- Sensitive personal data (measurements, IDs) stored in encrypted fields
- All database queries use parameterized inputs (SQL injection protection)
- Input validation on every API endpoint (XSS/injection prevention)

### Audit Trail
- Every sensitive operation creates an immutable **AuditEvent** record:
  - Who did it (actor user ID)
  - What they did (action)
  - What they did it to (entity type + ID)
  - When (timestamp)
  - Additional context (metadata JSON)

---

## 19. Development Roadmap

### Phase 1: MVP (Current — What's Built)

**Status: Complete**

- User registration and authentication
- Multi-role onboarding wizard (4 steps)
- 43-role taxonomy across 9 departments
- 5 membership tiers
- Project creation and management
- Requisition/application/offer hiring flow
- Casting breakdown/submission workflow
- Worked-with graph (auto-generated)
- Endorsement system (project-bound)
- Availability management (available/hold/booked)
- Universal search across profiles, projects, requisitions
- Vendor invoice/payout system (Stripe Connect)
- Document vault with confidentiality levels
- Audit event logging
- AI intelligence layer: Smart Match, Natural Language Search, Auto-Categorization, Crew Recommendations, Role Suggestions, Pre-Screen Questions
- Landing page, dashboard, discover, projects pages
- Dark theme with indigo/gold brand

### Phase 2: Sticky Features & Power Tools (Next 2-3 months)

- **Call sheet creation and distribution** — AD and coordinator tools
- **E-signatures** — sign contracts and deal memos in-platform
- **Post-production pipeline** — editor and post supervisor workflows
- **Real-time messaging** — direct messages between professionals
- **Analytics dashboard** — time-to-fill, rehire rates, offer acceptance
- **Mobile optimization** — responsive improvements for on-set use
- **Department scheduling** — visual calendar per department per project
- **Self-Tape & Audition Management System** — built-in self-tape submission, review, and feedback tools
- **Saved Searches with Smart Alerts** — instant, daily, or weekly digest notifications when new matches appear
- **Collaborator Permissions** — granular sharing (full access vs shortlist-only) for team-based hiring
- **Bulk Actions** — message, shortlist, or reject multiple candidates at once
- **Applicant Pipeline Kanban** — visual pipeline: To Review → Shortlisted → Audition → Offer → Hired → Passed
- **Pre-Screen Questionnaires** — custom questions per requisition, answered before full application
- **Geographic Radius Search** — distance-based filtering, not just city match
- **Content Creator Profiles** — UGC, branded content, and package pricing for the creator economy
- **Listing Boost / Featured Placement** — paid visibility for profiles and requisitions
- **Calendar Integration** — Google Calendar / iCal sync for availability and audition scheduling
- **Physical Attributes & Voice Filters** — height, hair color, eye color, voice type, accent (for casting)
- **Script Sides & Document Sharing** — attach scripts and sides directly to casting breakdowns
- **Native Portfolio & Reel Hosting** — built-in video player, no external links required
- **Exportable Shortlists** — PDF/CSV export for offline sharing with directors and producers

### Phase 3: Scale & Compliance (3-6 months)

- **Payroll integrations** — labor payment processing with tax compliance
- **Union verification** — optional IATSE/SAG-AFTRA roster checks
- **Fraud detection** — AI-powered scam and impersonation prevention
- **Enterprise SSO** — studio-grade single sign-on
- **Advanced search** — Elasticsearch with faceted filtering
- **API access** — public API for agency/studio integrations

### Phase 4: Advanced Intelligence (6-12 months)

> **Note:** Core AI features (Smart Match, Natural Language Search, Auto-Categorization, Crew Recommendations, Role Suggestions, Pre-Screen Questions) are already built and deployed. Phase 4 extends the intelligence layer with deeper capabilities.

- **Predictive availability** — forecast who will be free based on project timelines
- **Market rate intelligence** — anonymous rate benchmarking by role and region
- **Production planning AI** — suggest department staffing based on script breakdown
- **Script breakdown AI** — upload a screenplay and AI suggests departments, roles, and headcount
- **Schedule optimization** — AI suggests optimal shooting schedules based on crew availability and location constraints
- **Career path AI** — personalized growth recommendations based on role, experience, and industry trajectories
- **Portfolio matching** — AI embeddings to find professionals with similar styles even when described differently
- **Mobile app** — native iOS/Android for on-set use

---

## 20. Access & Login Information

### GitHub Repository

| Item | Value |
|------|-------|
| **Repository URL** | `https://github.com/addyanddaddy/Demo` |
| **Branch** | `main` |
| **Clone (SSH)** | `git clone git@github.com:addyanddaddy/Demo.git` |
| **Clone (HTTPS)** | `git clone https://github.com/addyanddaddy/Demo.git` |

### Technology Requirements

To run the platform locally, you need:

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20+ | JavaScript runtime |
| **npm** | 9+ | Package manager |
| **PostgreSQL** | 15+ | Database |
| **Git** | Any | Version control |

### Environment Variables

Create a `.env` file in the project root with:

```
# Database connection
DATABASE_URL="postgresql://user:password@host:5432/frameone"

# NextAuth (authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Stripe (payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Quick Start Database Options

| Option | Cost | Setup Time | Best For |
|--------|------|-----------|----------|
| **Supabase** | Free tier | 5 minutes | Development and testing |
| **Neon** | Free tier | 5 minutes | Development and testing |
| **Railway** | $5/mo | 5 minutes | Staging and demos |
| **AWS RDS** | $15+/mo | 30 minutes | Production |

---

## 21. How to Deploy & Run

### Local Development

```bash
# 1. Clone the repository
git clone git@github.com:addyanddaddy/Demo.git
cd Demo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Push database schema
npx prisma db push

# 5. Seed the database (creates all 43 roles)
npm run db:seed

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

### Production Deployment (Vercel)

```bash
# 1. Push to GitHub (already done)
# 2. Go to vercel.com → Import → select addyanddaddy/Demo
# 3. Add environment variables in Vercel dashboard
# 4. Deploy — Vercel handles the rest
```

### Database Management

```bash
# View database in browser GUI
npm run db:studio

# Apply schema changes
npm run db:push

# Re-seed roles (safe to run multiple times)
npm run db:seed

# Full reset (DESTROYS ALL DATA)
npm run db:reset
```

---

## 22. Competitive Landscape

| Platform | What It Does | Limitation vs FrameOne |
|----------|-------------|----------------------|
| **Backstage** | Actor casting, auditions | Talent only. No crew, no projects, no payments. |
| **Casting Networks** | Casting breakdowns, submissions | Casting only. No crew hiring, no project management. |
| **StaffMeUp** | Crew job board | Flat job listings. No departments, no authority chains, no trust graph. |
| **ProductionHUB** | Directory + job board | Directory only. No project management, no payments, no endorsements. |
| **LinkedIn** | Professional networking | Too generic. No department structure, no availability, no casting. |
| **IMDbPro** | Credits database + contacts | View-only credits. No hiring flow, no project management. |
| **FrameOne** | **Full ecosystem** | **All roles. Hiring flow. Casting. Payments. Trust network. Project management.** |

### Our Unfair Advantages

**1. The worked-with graph.** Every platform above is a directory or a job board. FrameOne builds a verifiable trust network that gets more valuable with every production. After 1,000 projects run through the platform, FrameOne will have a dataset of real industry relationships that no competitor can replicate.

**2. Production-aware AI.** No existing platform in this space offers AI-powered matching, natural language search, or intelligent crew recommendations. FrameOne is first to market with production-aware AI. While other platforms require manual filtering through dropdown menus and keyword searches, FrameOne's embedded intelligence layer — powered by Anthropic's Claude — understands roles, departments, availability, and professional networks. The AI is not a future feature: it is built, functional, and deployed today across five core platform surfaces.

---

## 23. Revenue Projections

### Conservative Model (Year 1)

| Segment | Users | Tier | Monthly Revenue |
|---------|-------|------|----------------|
| Free talent/crew | 20,000 | $0 | $0 |
| Pro Supply | 2,000 | $19 | $38,000 |
| Hiring Pro | 200 | $149 | $29,800 |
| Department Head | 500 | $49 | $24,500 |
| Agency/Studio | 20 | $499 | $9,980 |
| **Subscriptions** | | | **$102,280/mo** |
| Transaction fees (est.) | | 2.9% | ~$15,000/mo |
| **Total MRR** | | | **~$117,280/mo** |
| **Annual Run Rate** | | | **~$1.41M** |

### Path to 30,000 Active Members

| Quarter | Action | Projected Members |
|---------|--------|------------------|
| Q1 | Launch MVP, seed LA/Atlanta markets | 500 |
| Q2 | Add messaging, e-signatures, mobile | 2,000 |
| Q3 | Payroll integration, union features | 8,000 |
| Q4 | AI matching, mobile app, NYC/London | 15,000 |
| Q5-Q6 | Enterprise deals, API partnerships | 30,000 |

---

## 24. AI Integration (Technical Detail)

FrameOne integrates Claude AI (by Anthropic) directly into the platform. The AI handles six core functions: matching talent to jobs, understanding natural language searches, automatically categorizing member profiles, recommending crew from your network, suggesting roles during signup, and generating pre-screen questions for casting breakdowns. All of these work together to make the platform smarter than any job board or directory.

### Feature 1: Smart Match

When a Producer or Department Head posts a job requisition, they can click "Find Best Matches" and the AI analyzes every candidate in the system and ranks them by fit.

The AI looks at the requisition requirements (role, location, dates, rate, description) and compares them against every matching profile in the database. It considers availability (are they free during the shoot dates?), location (are they near the production?), experience (how many past projects and endorsements do they have?), and bio relevance (does their described experience match what the production needs?). It returns a ranked list with a match score from 0 to 100 and a written explanation for each recommendation.

Example: A Line Producer posts a requisition for a Gaffer in Atlanta, March 15 through April 30, at $650 per day. The AI scans all Gaffer profiles and returns something like: "Marcus Johnson, 95% match. Based in Atlanta, available March through May, 14 past projects, 8 endorsements from DPs. His bio mentions extensive experience with LED lighting on indie features, which aligns with this production's format."

### Feature 2: Natural Language Search

Instead of clicking through dropdown filters, users can type a search in plain English and the AI understands what they want.

The user types something like "find me a DP in Atlanta who's available in March and has worked on horror films." The AI parses that sentence and extracts the structured information: role is Director of Photography, location is Atlanta, available dates are March 2026, and the keyword is horror. Then it runs that structured query against the database and returns matching profiles.

Most people don't think in dropdown menus. They think in sentences. This makes the search feel like talking to an assistant rather than filling out a form. It also handles ambiguity. If someone types "camera guy in LA" the AI knows they mean Camera Operator in Los Angeles.

### Feature 3: Auto-Categorization

When a member writes their bio, the AI automatically extracts skills, genres, tools, and specialties and saves them as searchable tags on their profile.

A Gaffer writes in their bio: "15 years lighting features and episodic television. Experienced with ARRI SkyPanels, LED walls, and DMX programming. Specialize in horror and thriller atmospherics." The AI reads that and extracts skills (LED lighting, DMX programming, atmospheric lighting), genres (horror, thriller), tools (ARRI SkyPanel, LED wall), and specialties (atmospheric lighting, episodic television). These get saved as structured tags that make the profile show up in relevant searches even if someone doesn't search for the exact words in the bio.

Most professionals write bios in paragraph form. Without AI extraction, that information is locked in unstructured text and invisible to search. This makes every member's profile automatically more discoverable.

### Feature 4: Crew Recommendations

When a Producer or Department Head has a project with open positions, the AI looks at their professional network (people they have worked with on past projects) and recommends specific people for each open role.

The AI pulls the user's entire worked-with history from the platform — every person they have been on a project with, what role each person had, and how many endorsements they have received. Then it looks at the open requisitions on the current project and matches network contacts to open positions. It prioritizes people whose role directly matches the open position, who have more endorsements (indicating they are trusted and reliable), and who the user has personally collaborated with before (lower hiring risk).

This is how the industry actually works — people hire people they have worked with before. The AI just makes that process instant instead of requiring phone calls and text chains. It also surfaces connections the user might have forgotten about.

### Feature 5: Role Suggestion During Onboarding

When a new member signs up and goes through the onboarding wizard, they can describe what they do in their own words and the AI suggests which of the 43 platform roles they should select.

The user types something like "I work in camera departments, mostly pulling focus and operating on commercials, but I also do some DIT work on smaller shoots." The AI reads that and suggests First Assistant Camera (high confidence, they mentioned pulling focus), Camera Operator (medium confidence, they mentioned operating), and Digital Imaging Technician (medium confidence, they mentioned DIT work).

A new user looking at 43 roles across 9 departments can feel overwhelming. Not everyone knows the industry terminology, especially people earlier in their careers. This removes the friction from signup and makes sure people select the right roles so they show up in the right searches.

### Feature 6: Pre-Screen Question Generation

When a Casting Director creates a casting breakdown, the AI can generate a set of relevant pre-screen questions tailored to the specific role requirements. The `suggestPreScreenQuestions` function analyzes the breakdown details and produces targeted screening questions.

The AI reads the breakdown — character description, role type, age range, compensation, format, and any special requirements — and generates questions that help filter candidates early. For an action thriller lead, it might suggest questions about stunt experience, passport availability, schedule flexibility, and self-tape turnaround. For a period drama, it might ask about dialect skills, horseback riding, or comfort with corsetry.

This saves casting professionals significant time. Instead of writing screening questions from scratch for every breakdown, they get an intelligent starting point that covers the practical, logistical, and creative dimensions of the role. The questions can be edited, reordered, or supplemented before being attached to the breakdown.

### How the AI Connects to the Platform

The AI is not a separate product. It is woven into the existing features:

The Discover page uses natural language search so members can find talent by typing instead of clicking filters.

The Requisition detail page has a "Find Best Matches" button that runs Smart Match and shows ranked candidates.

The Project dashboard has a "Recommended Crew" section that pulls from the user's network using Crew Recommendations.

The Profile edit page has an "Auto-tag my profile" button that runs Auto-Categorization on the bio.

The Onboarding wizard has an optional "Describe what you do" text field that runs Role Suggestion before showing the department and role picker.

The Casting breakdown editor has a "Suggest Questions" button that runs Pre-Screen Question generation and populates screening questions for the role.

### AI Cost Analysis

The AI is powered by Claude Sonnet, which provides fast response times (under 3 seconds) with high accuracy. All AI responses are returned as structured data that the platform processes directly.

At current API pricing, each AI call costs approximately $0.003 to $0.01. Even at 10,000 AI-assisted searches per month, the total cost would be under $100 per month. This is negligible compared to the platform's subscription revenue.

The AI features are optional. If the API key is not configured, every other feature on the platform works normally. The AI is an enhancement layer, not a dependency.

### Future AI Features (Phase 2 and 3)

Script Breakdown AI: Upload a screenplay and the AI analyzes it to suggest what departments and roles you will need to staff, with estimated headcount per department.

Schedule Optimization: AI suggests optimal shooting schedules based on crew availability windows and location constraints.

Rate Intelligence: Anonymous benchmarking that tells users "the average rate for a Gaffer in Atlanta is $575 to $700 per day" based on aggregated platform data.

Career Path AI: Suggests growth paths based on a member's current role and experience, like "based on your experience as a Key Grip with 8 projects, here is what it typically takes to move into a DP role."

Portfolio Matching: Using AI embeddings to find professionals with similar styles, specialties, or experience even when they describe their work differently.

---

*This document is confidential and intended for the FrameOne founding team. For the full technical specification, see the ARCHITECTURE.md document in the repository.*

---

Prepared by Brandon Bible, Technical Lead
March 9, 2026

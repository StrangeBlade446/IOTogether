# IOTogether — Multi-Institution Electronics Resource-Sharing Platform
**Tagline:** *Share Resources. Build Possibilities.*  
**Category:** Institutional electronics inventory, borrowing, and resource-sharing network.

---

## 1. Executive Summary & Problem Statement

Educational laboratories, engineering colleges, and makerspaces frequently invest in high-tier electronics development boards, sensors, and test equipment that sit underused in locked cabinets for months. Concurrently, student innovators and project teams face steep monetary barriers when purchasing single-use microcontrollers or lab-grade test equipment for semester projects.

**IOTogether** solves this imbalance by providing a secure, accountable, cross-institutional resource-sharing network. Institutions retain full ownership and approval authority over their inventory, while verified students gain fair, transparent, and affordable access.

---

## 2. Key Platform Features

- **Cross-Institutional Catalog & Discovery (`/explore`):**
  Search and filter by category, institution, availability, pricing (free vs. paid), and prerequisite training requirements. Real-time availability dynamically computes unreserved inventory.
- **Project-to-Inventory Matcher (`/project-matcher`):**
  Deterministic compatibility engine that maps student project descriptions (e.g., *"Obstacle-avoiding 4WD robot car"*, *"IoT weather station"*) to available laboratory hardware.
- **Atomic Stock Reservation Guard:**
  Server-enforced concurrency locks prevent double-booking. Overlapping requests exceeding stock are rejected atomically and routed to a FIFO waitlist.
- **Two-Way Condition Inspection (`/manage/loans` & `/manage/returns`):**
  Staff inspect and record initial and return condition grades, notes, and photos, ensuring non-repudiable accountability for borrowed assets.
- **Append-Only Platform Audit Ledger (`/admin/audit`):**
  Immutable transaction timeline recording every reservation, manager approval, checkout handover, return, and incident resolution.
- **Transparent Pricing Model (Paise Arithmetic):**
  Zero rental rates for common learning kits, daily rates with refundable security deposits for specialized instruments. All prices are calculated in integer paise to eliminate floating-point arithmetic errors.
- **Live Demo Role Switcher:**
  Interactive persona switcher in the navigation bar allowing hackathon judges to switch seamlessly between Student, Lab Manager, and Admin roles without manual database edits.

---

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript (Strict Mode), Tailwind CSS, Lucide React
- **Backend & Persistence:** Next.js Server Actions, PostgreSQL (Supabase Migrations + Zero-Config Persistent Local Storage Engine)
- **Security:** PostgreSQL Row Level Security (RLS) policies, session-derived authorization, self-approval prevention
- **Auxiliary:** QR code token generator (`qrcode`), date interval logic (`date-fns`), test execution (`tsx`)

---

## 4. Quickstart & Installation

### Prerequisites
- Node.js v18.17+ or v20+ or v22+
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/iotogether.git
cd iotogether
npm install
```

### 2. Run Automated Verification Tests
```bash
npm run test
```
*Executes all 12 automated unit and integration tests verifying seed data, paise pricing, atomic overlap blocking, lifecycle transitions, and waitlist queuing.*

### 3. Run Production Build
```bash
npm run build
```
*Compiles and optimizes all 24 static and dynamic routes cleanly.*

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Demonstration Accounts for Judges

Use the **Role Switcher** in the top-right navbar to switch between personas instantly:

| Persona | Name | Role Context |
| :--- | :--- | :--- |
| **Student (Primary)** | Aarav Sharma | Enrolled borrower with Lab Safety & Oscilloscope certifications |
| **Student 2** | Priya Patel | Student on waitlist for high-demand test equipment |
| **Lab Manager (NIT)** | Prof. Ananya Roy | Manages Arduino, RPi, DHT11, and Oscilloscope inventory at NIT |
| **Lab Manager (GEC)** | Marcus Chen | Manages ESP-32 and Fluke Multimeter inventory at Greenfield GEC |
| **Platform Admin** | Dr. Vikram Seth | Full oversight of institutional verifications and audit logs |

---

## 6. Supabase Cloud Configuration (Optional)

The platform runs out-of-the-box with complete data persistence and concurrency checks. To connect to a live Supabase PostgreSQL project:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute the migration script in Supabase SQL Editor:
   ```bash
   supabase/migrations/20241028000000_init_iotogether.sql
   ```
3. Load the deterministic seed data:
   ```bash
   supabase/seed.sql
   ```
4. Copy `.env.example` to `.env.local` and configure:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 7. Project Documentation

Detailed architecture, security, and verification documents are available in `docs/`:
- [`docs/architecture.md`](docs/architecture.md) — System architecture, data flow, and components
- [`docs/database-schema.md`](docs/database-schema.md) — PostgreSQL table definitions, foreign keys, and atomic functions
- [`docs/security.md`](docs/security.md) — RLS policies, permissions matrix, and threat mitigations
- [`docs/testing.md`](docs/testing.md) — Automated test suite report and security test results
- [`docs/demo-guide.md`](docs/demo-guide.md) — Step-by-step judge demonstration scenario walkthrough
- [`docs/limitations.md`](docs/limitations.md) — Implementation boundaries and future roadmap
- [`docs/team-contributions.md`](docs/team-contributions.md) — Engineering roles and attribution

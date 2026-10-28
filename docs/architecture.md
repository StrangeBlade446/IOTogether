# IOTogether — System Architecture & Data Flow

## 1. Architectural Overview

IOTogether is a multi-tenant institutional resource-sharing platform engineered to eliminate idle laboratory hardware in colleges, makerspaces, and research universities.

```
                           ┌───────────────────────────┐
                           │   Student / Lab Manager   │
                           │   Web Client (Next.js 14) │
                           └─────────────┬─────────────┘
                                         │
                         HTTPS / Server Actions / Cookies
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │ Next.js App Router (SSR)  │
                           │  - Role Guard & Sessions  │
                           │  - Zod & Route Validators │
                           │  - Price Snapshot Engine  │
                           └─────────────┬─────────────┘
                                         │
             ┌───────────────────────────┴───────────────────────────┐
             │                                                       │
             ▼                                                       ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│ Supabase Cloud Integration    │               │ Persistent Storage Engine     │
│  - PostgreSQL 15              │               │  - Transaction Atomic Lock    │
│  - Row Level Security (RLS)   │               │  - Interval Conflict Guard    │
│  - Stored Procedures          │               │  - Disk Persistence (.data)   │
│  - Supabase Storage (Evidence)│               │  - Deterministic Seed Loader  │
└───────────────────────────────┘               └───────────────────────────────┘
```

---

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router) with React 18
- **Language:** TypeScript with `strict: true`
- **Styling:** Tailwind CSS with custom technical aesthetic palette (`#0a0f1d` charcoal foundation, `#0f172a` slate surface, `#06b6d4` cyan accents)
- **Icons:** Lucide React
- **Persistence Layer (Dual-Mode):**
  1. **Supabase PostgreSQL / Cloud:** Full migrations (`supabase/migrations/20241028000000_init_iotogether.sql`) with Row-Level Security (RLS), check constraints, and stored procedure `create_booking_atomic`.
  2. **Zero-Config Persistent Engine:** Robust file-backed storage (`src/lib/db/store.ts`) ensuring persistent operation, atomic inventory concurrency validation, and audit logging even before cloud configuration.
- **QR Code Handover Engine:** Offline QR code generation (`qrcode`) embedding cryptographically structured handover tokens.

---

## 3. Data Flow & Transaction Lifecycle

1. **Discovery & Search:**
   User browses `/explore` or queries `/project-matcher`. The catalog filters active resources across institutions and computes real-time availability by subtracting active reservations (`pending`, `approved`, `checked_out`) overlapping the current timestamp.

2. **Atomic Booking Reservation:**
   When a student submits a booking request:
   - Server checks `due_at > start_at` and duration within `min_loan_duration` and `max_loan_duration`.
   - Checks institutional sharing policies and user training prerequisites.
   - Evaluates overlapping interval requests:
     $$\text{Overlapping Requests} = \{ b \in \text{Bookings} \mid b.\text{resource\_id} = r.\text{id} \land b.\text{status} \in \{\text{pending}, \text{approved}, \text{checked\_out}\} \land b.\text{start\_at} < \text{new}.\text{due\_at} \land b.\text{due\_at} > \text{new}.\text{start\_at} \}$$
   - If $\sum \text{quantity}_{\text{overlap}} + \text{requested} > \text{total\_quantity}$, request is safely rejected with conflict notification and waitlist option.
   - If stock is sufficient, atomic transaction records the booking with locked price snapshots.

3. **Owner Approval & Notification:**
   Authorized lab manager reviews request in `/manage/requests` and approves or rejects with recorded audit reason. Borrower receives real-time in-app notification.

4. **Physical Check-Out Handover:**
   Manager in `/manage/loans` verifies student identity, pairs specific serialized asset tag (e.g. `NIT-RPI-01`), records initial physical condition, adds notes, and issues equipment.

5. **Physical Return & Incident Resolution:**
   Upon return in `/manage/returns`, manager inspects condition. If hardware is in good order, transaction completes. If damaged or missing parts, an incident is registered, booking enters `incident_review`, and resolution findings are documented in the immutable audit trail.

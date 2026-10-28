# IOTogether — Database Schema Specification

This document details the PostgreSQL schema implemented in `supabase/migrations/20241028000000_init_iotogether.sql` and mirrored in the TypeScript domain models (`src/types/database.ts`).

---

## Entity Relationship Diagram

```
[institutions] 1 ──── * [memberships] * ──── 1 [profiles]
      1                     │                      │
      │                     │                      │
      *                     ▼                      *
 [resources] 1 ──── * [eligibility_records]   [notifications]
   1      1
   │      │
   *      *
[resource_units]  [bookings] 1 ──── * [condition_reports]
                     1
                     │
                     *
                 [incidents]
```

---

## 1. Tables & Columns

### `profiles`
User identity metadata referencing Supabase `auth.users(id)`.
- `id`: UUID (Primary Key, references `auth.users`)
- `display_name`: TEXT NOT NULL
- `email`: TEXT NOT NULL
- `avatar_url`: TEXT
- `platform_role`: TEXT (`'student'`, `'staff'`, `'institution_admin'`, `'platform_admin'`)
- `verification_status`: TEXT (`'unverified'`, `'pending'`, `'verified'`, `'suspended'`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `institutions`
Educational entities, colleges, university labs, and makerspaces.
- `id`: UUID (Primary Key)
- `name`: TEXT NOT NULL
- `slug`: TEXT UNIQUE NOT NULL
- `institution_type`: TEXT (`'university'`, `'college'`, `'makerspace'`, `'school'`, `'lab'`)
- `description`: TEXT
- `city`: TEXT NOT NULL
- `address`: TEXT NOT NULL
- `verification_status`: TEXT (`'pending'`, `'verified'`, `'suspended'`)
- `verified_by`: UUID (references `profiles.id`)
- `verified_at`: TIMESTAMPTZ
- `sharing_policy`: TEXT (`'open_to_all'`, `'open_to_verified'`, `'internal_only'`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `memberships`
Relationship mapping users to institutions with specific scoped roles.
- `id`: UUID (Primary Key)
- `institution_id`: UUID (references `institutions.id` ON DELETE CASCADE)
- `user_id`: UUID (references `profiles.id` ON DELETE CASCADE)
- `role`: TEXT (`'student'`, `'inventory_manager'`, `'institution_admin'`)
- `status`: TEXT (`'pending'`, `'verified'`, `'rejected'`, `'suspended'`)
- `verified_by`: UUID (references `profiles.id`)
- `verified_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **Constraint:** `UNIQUE (institution_id, user_id)`

### `resources`
Inventory catalog items listed by institutions.
- `id`: UUID (Primary Key)
- `institution_id`: UUID (references `institutions.id` ON DELETE CASCADE)
- `name`: TEXT NOT NULL
- `slug`: TEXT NOT NULL
- `category`: TEXT (`'microcontrollers'`, `'single_board_computers'`, `'sensors'`, `'actuators_motors'`, `'prototyping'`, `'test_equipment'`, `'robotics'`, `'cameras_displays'`)
- `description`: TEXT NOT NULL
- `specifications`: JSONB DEFAULT `'{}'::jsonb`
- `image_url`: TEXT
- `total_quantity`: INTEGER NOT NULL (CHECK >= 0)
- `daily_rate_paise`: INTEGER NOT NULL DEFAULT 0 (CHECK >= 0)
- `deposit_paise`: INTEGER NOT NULL DEFAULT 0 (CHECK >= 0)
- `currency`: TEXT NOT NULL DEFAULT `'INR'`
- `condition`: TEXT (`'brand_new'`, `'excellent'`, `'good'`, `'fair'`, `'needs_maintenance'`)
- `location_description`: TEXT NOT NULL
- `min_loan_duration`: INTEGER NOT NULL DEFAULT 1
- `max_loan_duration`: INTEGER NOT NULL DEFAULT 14
- `approval_required`: BOOLEAN NOT NULL DEFAULT true
- `training_required`: BOOLEAN NOT NULL DEFAULT false
- `eligibility_policy`: TEXT (`'public'`, `'verified_members_only'`, `'training_certified'`)
- `status`: TEXT (`'active'`, `'maintenance'`, `'retired'`, `'draft'`)
- `created_by`: UUID (references `profiles.id`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `resource_units`
Individually tracked physical equipment instances with serial numbers and asset tags.
- `id`: UUID (Primary Key)
- `resource_id`: UUID (references `resources.id` ON DELETE CASCADE)
- `asset_tag`: TEXT UNIQUE NOT NULL
- `serial_number`: TEXT
- `condition`: TEXT DEFAULT `'good'`
- `unit_status`: TEXT (`'available'`, `'checked_out'`, `'maintenance'`, `'lost'`, `'retired'`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `eligibility_records`
Verified student prerequisites (e.g. lab safety, soldering certification, oscilloscope training).
- `id`: UUID (Primary Key)
- `user_id`: UUID (references `profiles.id` ON DELETE CASCADE)
- `institution_id`: UUID (references `institutions.id` ON DELETE CASCADE)
- `requirement_type`: TEXT NOT NULL
- `status`: TEXT (`'pending'`, `'approved'`, `'revoked'`, `'expired'`)
- `verified_by`: UUID (references `profiles.id`)
- `valid_from`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `expires_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `bookings`
Central transaction table holding immutable price snapshots and lifecycle state.
- `id`: UUID (Primary Key)
- `resource_id`: UUID (references `resources.id`)
- `borrower_id`: UUID (references `profiles.id`)
- `unit_id`: UUID (references `resource_units.id`)
- `quantity`: INTEGER NOT NULL (CHECK > 0)
- `start_at`: TIMESTAMPTZ NOT NULL
- `due_at`: TIMESTAMPTZ NOT NULL
- `status`: TEXT (`'pending'`, `'waitlisted'`, `'approved'`, `'rejected'`, `'cancelled'`, `'checked_out'`, `'overdue'`, `'return_review'`, `'incident_review'`, `'completed'`)
- `daily_rate_snapshot_paise`: INTEGER NOT NULL DEFAULT 0
- `deposit_snapshot_paise`: INTEGER NOT NULL DEFAULT 0
- `estimated_total_paise`: INTEGER NOT NULL DEFAULT 0
- `payment_status`: TEXT (`'not_required'`, `'pending'`, `'paid'`, `'refunded'`, `'waived'`)
- `purpose`: TEXT NOT NULL
- `usage_rules_acknowledged`: BOOLEAN NOT NULL DEFAULT true
- `approved_by`: UUID (references `profiles.id`)
- `approved_at`: TIMESTAMPTZ
- `issued_by`: UUID (references `profiles.id`)
- `issued_at`: TIMESTAMPTZ
- `returned_by`: UUID (references `profiles.id`)
- `returned_at`: TIMESTAMPTZ
- `cancellation_reason`: TEXT
- `rejection_reason`: TEXT
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **Constraint:** `CHECK (due_at > start_at)`

### `condition_reports`
Initial checkout and final return inspection records with evidence paths.
- `id`: UUID (Primary Key)
- `booking_id`: UUID (references `bookings.id` ON DELETE CASCADE)
- `report_type`: TEXT (`'checkout'`, `'return'`)
- `condition`: TEXT (`'brand_new'`, `'excellent'`, `'good'`, `'fair'`, `'damaged'`, `'parts_missing'`)
- `notes`: TEXT NOT NULL
- `evidence_paths`: TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
- `submitted_by`: UUID (references `profiles.id`)
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `incidents`
Damage reports, component loss, or condition disputes.
- `id`: UUID (Primary Key)
- `booking_id`: UUID (references `bookings.id` ON DELETE CASCADE)
- `reported_by`: UUID (references `profiles.id`)
- `incident_type`: TEXT (`'damage'`, `'missing'`, `'late'`, `'misuse'`, `'dispute'`)
- `description`: TEXT NOT NULL
- `evidence_paths`: TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
- `status`: TEXT (`'open'`, `'investigating'`, `'resolved'`)
- `assigned_to`: UUID (references `profiles.id`)
- `resolution_notes`: TEXT
- `resolved_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `waitlist_entries`
FIFO waitlist queue when equipment is fully reserved.
- `id`: UUID (Primary Key)
- `resource_id`: UUID (references `resources.id` ON DELETE CASCADE)
- `user_id`: UUID (references `profiles.id` ON DELETE CASCADE)
- `quantity`: INTEGER NOT NULL DEFAULT 1
- `status`: TEXT (`'active'`, `'allocated'`, `'cancelled'`, `'expired'`)
- `queue_position`: INTEGER NOT NULL DEFAULT 1
- `priority_reason`: TEXT
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **Constraint:** `UNIQUE (resource_id, user_id) WHERE status = 'active'`

### `audit_logs`
Append-only tamper-resistant platform audit trail.
- `id`: UUID (Primary Key)
- `actor_id`: UUID (references `profiles.id`)
- `institution_id`: UUID (references `institutions.id`)
- `entity_type`: TEXT NOT NULL
- `entity_id`: UUID NOT NULL
- `action`: TEXT NOT NULL
- `metadata`: JSONB NOT NULL DEFAULT `'{}'::jsonb`
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### `notifications`
In-app alerts for borrowers and lab managers.
- `id`: UUID (Primary Key)
- `user_id`: UUID (references `profiles.id` ON DELETE CASCADE)
- `event_type`: TEXT NOT NULL
- `title`: TEXT NOT NULL
- `message`: TEXT NOT NULL
- `related_booking_id`: UUID (references `bookings.id` ON DELETE SET NULL)
- `read_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

## 2. PostgreSQL Functions & Concurrency Logic

### `create_booking_atomic(...)`
```sql
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
    p_resource_id UUID,
    p_borrower_id UUID,
    p_quantity INTEGER,
    p_start_at TIMESTAMPTZ,
    p_due_at TIMESTAMPTZ,
    p_purpose TEXT,
    p_acknowledged BOOLEAN
) RETURNS JSONB ...
```
1. Locks resource record `FOR UPDATE`.
2. Validates duration constraints (`min_loan_duration`, `max_loan_duration`).
3. Computes sum of overlapping reservations: `b.start_at < p_due_at AND b.due_at > p_start_at` where status is `pending`, `approved`, or `checked_out`.
4. Returns conflict error if requested quantity exceeds unreserved stock.
5. Locks integer paise prices and inserts immutable booking snapshot.
6. Emits append-only audit log entry.

# IOTogether — Limitations & Future Roadmap

In compliance with the hackathon operating principles, this document provides an honest accounting of current implementation boundaries and future technical roadmap.

---

## 1. Current Implementation Boundaries

### A. Dual-Mode Database Operation
- **Implemented:** Full PostgreSQL migration files in `supabase/migrations/` with tables, triggers, indexes, and RLS policies, accompanied by a file-backed zero-config engine (`src/lib/db/store.ts`).
- **Limitation:** For local hackathon offline testing without requiring judges to configure remote Supabase secrets, the zero-config persistent store is enabled by default. To connect to a live Supabase instance, supply `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and apply `supabase/migrations/20241028000000_init_iotogether.sql`.

### B. Payment Gateway Sandbox
- **Implemented:** Precise monetary snapshotting in integer paise, separate refundable deposit handling, and payment state state-machine (`not_required`, `pending`, `paid`, `refunded`, `waived`).
- **Limitation:** Live payment gateways (e.g., Razorpay / Stripe) require merchant KYC in production. The hackathon MVP uses an offline deposit / lab arrangement workflow and clearly labels transactions accordingly, rather than simulating fake payment success pages.

### C. Physical QR Scanning Hardware
- **Implemented:** Real QR code generation on equipment pages and student booking handover tokens with embedded asset metadata.
- **Limitation:** Handover authorization uses the browser UI authenticated session rather than raw device webcam scanning. As specified in Section 15, QR codes act as identifiers; handover authorization is enforced by the authenticated manager backend session.

### D. File Storage Evidence
- **Implemented:** Structured photo reference URLs and multi-image evidence arrays attached to initial checkouts and return inspections.
- **Limitation:** Direct multipart binary upload uses URL path references. Production deployment would connect directly to a Supabase S3-compatible Storage bucket.

---

## 2. Future Improvements Roadmap

1. **Hardware Telemetry Integration:** RFID/NFC smart cabinet integration for automated checkout logging when sensors leave physical laboratory bins.
2. **Inter-Institution Courier Dispatch:** Logistics provider API integration for shipping components between distant educational campuses.
3. **Automated Late Return Deterrence:** Grace period warnings followed by progressive deposit deductions.

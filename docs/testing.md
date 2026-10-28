# IOTogether — Verification & Test Report

## 1. Test Suite Execution

The automated verification suite tests database operations, concurrency controls, price snapshots, lifecycle state transitions, and waitlist queuing.

### Running the Test Suite
```bash
npm run test
```

### Automated Test Results
```text
============================================================
  IOTOGETHER HACKATHON VERIFICATION TEST SUITE
============================================================

--- 1. DATABASE SEED DATA & INTEGRITY TESTS ---
  ✔ PASS Seed profiles exist and include demo roles
  ✔ PASS Institutions exist with valid verified status
  ✔ PASS Initial inventory includes free, paid, and training-restricted items

--- 2. PRICING & MONEY SNAPSHOT CALCULATIONS ---
  ✔ PASS Integer paise pricing calculations are exact without floating-point drift

--- 3. ATOMIC BOOKING & CONCURRENCY CONFLICT GUARD ---
  ✔ PASS Successful booking atomic insertion with sufficient stock
  ✔ PASS Rejects booking when return date is before or equal to start date
  ✔ PASS Overlapping competing bookings exceeding stock are blocked atomically

--- 4. LIFECYCLE STATE TRANSITIONS ---
  ✔ PASS Pending booking can be approved by manager
  ✔ PASS Check-out records initial condition and transitions to checked_out
  ✔ PASS Return inspection transitions booking to completed and appends audit log
  ✔ PASS Return with damage initiates incident review status

--- 5. WAITLIST QUEUE DISCIPLINE ---
  ✔ PASS Adding to waitlist increments queue position strictly FIFO

============================================================
  TEST RESULTS: 12 PASSED, 0 FAILED
============================================================
```

---

## 2. Tested Security Scenarios

1. **Self-Approval Prevention:**
   Proved that when a borrower tries to approve their own request, the action returns `Forbidden: Self-approval is strictly forbidden`.

2. **Concurrency Double-Booking Prevention:**
   Proved that with 1 unit in stock, when Student 1 reserves for Jan 10-12, Student 2 attempting Jan 11-13 is atomically rejected with `conflict: true` and `availableQuantity: 0`.

3. **Tamper-Resistant Price Snapshotting:**
   Proved that prices are calculated in integer paise ($100 \text{ paise} = ₹1.00$) on the server and locked at booking time.

4. **Return Inspection & Incident Transition:**
   Proved that when an item is returned with damage, the system sets status to `incident_review`, creates an incident record, and logs an immutable audit event.

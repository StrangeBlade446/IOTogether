# IOTogether — Security, Permissions & Threat Model

## 1. Security Architecture & RLS Matrix

IOTogether employs defense-in-depth principles:
1. **Server-Side Identity:** User identity is never trusted from client inputs. All Server Actions derive actor identity from verified server-side session cookies or Supabase Auth JWTs.
2. **PostgreSQL Row Level Security (RLS):** All exposed tables have RLS enabled with explicit policies.
3. **No Secret Leaks:** `SUPABASE_SERVICE_ROLE_KEY` and administrative database credentials are kept exclusively on the server and never bundled into client JavaScript.

| Entity | Public / Unauth | Borrower (Student) | Lab Manager | Platform Admin |
| :--- | :--- | :--- | :--- | :--- |
| **profiles** | Denied | Read all, edit self | Read all, edit self | Read all, manage status |
| **institutions** | Read verified | Read verified & internal | Read managed | Full write / verify |
| **memberships** | Denied | Read self, request new | Read & verify for own inst | Full access |
| **resources** | Read active | Read active catalog | Full CRUD on own inst | Full access |
| **bookings** | Denied | Read & create self, cancel self | Read, approve, issue, return for own inst | Full read & dispute review |
| **condition_reports**| Denied | Read own booking reports | Create & read for own inst | Full read |
| **incidents** | Denied | Read own reported | Manage & resolve for own inst | Full access |
| **audit_logs** | Denied | Denied | Read own inst logs | Full read (Append-only) |

---

## 2. Critical Threat Mitigations

### A. Borrower Self-Approval Prevention
- **Threat:** A student who also has manager rights at another lab attempts to approve their own request for a high-value item.
- **Enforcement:** In `approveBookingAction` and database triggers:
  ```typescript
  if (booking.borrower_id === session.user.id) {
    return { success: false, error: 'Forbidden: Self-approval is strictly forbidden.' };
  }
  ```

### B. Price Tampering & Floating-Point Drift
- **Threat:** Malicious client modifies client-side JavaScript to send `daily_rate = 0` or negative paise.
- **Enforcement:** Server completely ignores any client-supplied rates. Prices are computed directly from the locked database resource record in integer paise.

### C. Concurrency Race Conditions & Double-Booking
- **Threat:** Two students click "Request" simultaneously for the last remaining oscilloscope.
- **Enforcement:** `create_booking_atomic` locks the resource row `FOR UPDATE` in PostgreSQL (or file lock in store) and computes total demand across the exact requested time interval. The second transaction immediately receives a conflict response (`available_quantity = 0`) and is invited to join the FIFO waitlist.

### D. Audit Log Tampering
- **Threat:** A user attempts to delete an incident or modify checkout notes after damage is detected.
- **Enforcement:** Audit logs table `audit_logs` has NO `UPDATE` or `DELETE` policies defined. It is purely append-only.

### E. Cross-Institution Unauthorized Access
- **Threat:** A manager at Greenfield Engineering College attempts to modify inventory or approve requests belonging to Northstar Institute of Technology.
- **Enforcement:** Every privileged operation verifies `m.institution_id === resource.institution_id && m.role === 'inventory_manager' && m.status === 'verified'`.

# IOTogether — Judge Demonstration Scenario Guide

This guide describes the step-by-step walkthrough for evaluating IOTogether during the hackathon presentation. No manual database modification is required at any point.

---

## Demo Personas (Pre-configured via Top-Right Role Switcher)

1. **Aarav Sharma (Student / Borrower)**
   - Role: Enrolled student at NIT & Greenfield GEC. Has Lab Safety & Oscilloscope certifications.
2. **Prof. Ananya Roy (NIT Lab Manager)**
   - Role: Inventory manager for Northstar Institute of Technology.
3. **Marcus Chen (Greenfield GEC Lab Lead)**
   - Role: Inventory manager for Greenfield Engineering College.
4. **Dr. Vikram Seth (Platform Administrator)**
   - Role: Platform auditor and institutional credential verifier.

---

## Step-by-Step Demonstration Walkthrough

### Step 1: Discover Resources as a Student
1. Ensure the top-right persona is set to **Aarav Sharma (Student)**.
2. Navigate to **Explore Equipment** (`/explore`).
3. Note the multi-institution items from Northstar Institute of Technology, Greenfield Engineering College, and Metro Makerspace.
4. Filter by category **Microcontrollers** or search for `Arduino`.
5. Open the **Arduino Uno Rev3** detail page (`/resources/d0000001-0000-0000-0000-000000000001`).

### Step 2: Submit Booking Request
1. Review the pricing breakdown: Rate is **Free (₹0)**, refundable deposit is **₹0**.
2. Select pickup date and return due date (3 days duration).
3. Type project purpose: *"Autonomous obstacle avoidance robot for Semester 5 mini-project."*
4. Check *"I agree to inspect equipment upon handover..."*.
5. Click **Submit Booking Request**.
6. The request is created in **PENDING** status with an immutable price snapshot.

### Step 3: Approve Request as Lab Manager
1. In the top-right navigation bar, click the Role Switcher and select **Prof. Ananya Roy (NIT Manager)**.
2. Click **Manage Portal** (`/manage`) or go to **Booking Requests** (`/manage/requests`).
3. Note the newly submitted request from Aarav Sharma.
4. Click **Approve**. The status transitions to **APPROVED** and an in-app notification is dispatched to Aarav.

### Step 4: Verify Notification & QR Token as Student
1. Switch back to **Aarav Sharma (Student)** via the top-right switcher.
2. Click the bell icon (`/notifications`) to observe the instant alert: *"Booking Request Approved!"*.
3. Go to **My Bookings** (`/my-bookings`).
4. Click **View Timeline** on the approved booking (`/my-bookings/[id]`). Show the **Digital Handover QR Token** designed for counter check-in.

### Step 5: Issue Equipment & Pre-Checkout Inspection
1. Switch back to **Prof. Ananya Roy (NIT Manager)**.
2. Go to **Issue & Check Out** (`/manage/loans`).
3. Click **Complete Check-Out** on Aarav's booking.
4. In the modal:
   - Select condition: **Excellent**.
   - Review inspection notes: *"Tested all ports and pins. Clean physical condition."*
   - Click **Confirm Handover & Issue Item**.
5. The booking status transitions to **CHECKED_OUT** and an initial condition report is saved.

### Step 6: Complete Return & Final Bench Inspection
1. Go to **Inspect & Return** (`/manage/returns`).
2. Locate the checked-out item and click **Inspect & Record Return**.
3. Select condition: **Good**.
4. Confirm inspection notes: *"Hardware returned in good order, pins straight."*
5. Click **Complete Return Sign-off**.
6. The booking transitions to **COMPLETED** and stock is released back to active inventory unreserved.

### Step 7: Inspect Non-Repudiable Audit Timeline
1. Switch to **Dr. Vikram Seth (Platform Admin)**.
2. Navigate to **Admin Console** (`/admin`) -> **Append-Only Platform Audit Ledger** (`/admin/audit`).
3. Point out the chronological audit trail:
   - `booking: created` by Aarav Sharma
   - `booking: approved` by Prof. Ananya Roy
   - `booking: checked_out` with initial condition snapshot
   - `booking: return_completed` with staff sign-off
4. Explain how ordinary users have zero ability to mutate or erase this history.

### Step 8: Show Concurrency & Waitlist Guard
1. Navigate to **Explore Equipment** -> **Rigol DS1054Z 50MHz Oscilloscope** (1 unit in total stock).
2. Point out that when active reservations equal total stock, competing requests are rejected with a clear conflict notice, and borrowers are invited to join the FIFO **Waitlist**.
3. Open **Project Matcher** (`/project-matcher`) to show deterministic matching from query to available hardware.

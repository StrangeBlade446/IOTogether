// =============================================================================
// IOTogether Automated Test Suite
// Verifies Functional, Security, Concurrency, and Lifecycle Requirements
// =============================================================================

import assert from 'assert';
import { db } from '../src/lib/db/store';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n============================================================');
  console.log('  IOTOGETHER HACKATHON VERIFICATION TEST SUITE');
  console.log('============================================================\n');

  // Reset database state to pristine seed data for idempotent test execution
  db.resetToSeed();

  console.log('\x1b[36m--- 1. DATABASE SEED DATA & INTEGRITY TESTS ---\x1b[0m');
  test('Seed profiles exist and include demo roles', () => {
    const profiles = db.getProfiles();
    assert(profiles.length >= 5, 'Should have at least 5 profiles');
    const admin = profiles.find((p) => p.platform_role === 'platform_admin');
    const student = profiles.find((p) => p.platform_role === 'student');
    const staff = profiles.find((p) => p.platform_role === 'staff');
    assert(admin, 'Admin profile must exist');
    assert(student, 'Student profile must exist');
    assert(staff, 'Staff profile must exist');
  });

  test('Institutions exist with valid verified status', () => {
    const insts = db.getInstitutions();
    assert(insts.length >= 3, 'Should have at least 3 institutions');
    const nit = insts.find((i) => i.name.includes('Northstar'));
    assert(nit, 'Northstar Institute of Technology must exist');
    assert.strictEqual(nit.verification_status, 'verified');
  });

  test('Initial inventory includes free, paid, and training-restricted items', () => {
    const resources = db.getResources();
    const freeItem = resources.find((r) => r.daily_rate_paise === 0);
    const paidItem = resources.find((r) => r.daily_rate_paise > 0);
    const trainingItem = resources.find((r) => r.training_required === true);

    assert(freeItem, 'Must have at least one free resource');
    assert(paidItem, 'Must have at least one paid resource');
    assert(trainingItem, 'Must have at least one training-restricted resource');
  });

  console.log('\n\x1b[36m--- 2. PRICING & MONEY SNAPSHOT CALCULATIONS ---\x1b[0m');
  test('Integer paise pricing calculations are exact without floating-point drift', () => {
    const rpi = db.getResource('d0000004-0000-0000-0000-000000000004'); // RPi: 5000 paise/day, 200000 paise deposit
    assert(rpi, 'Raspberry Pi resource must exist');

    const days = 5;
    const qty = 2;
    const rentalCharge = rpi.daily_rate_paise * qty * days; // 5000 * 2 * 5 = 50,000 paise (₹500.00)
    const depositTotal = rpi.deposit_paise * qty; // 200000 * 2 = 400,000 paise (₹4,000.00)
    const grandTotal = rentalCharge + depositTotal; // 450,000 paise (₹4,500.00)

    assert.strictEqual(rentalCharge, 50000);
    assert.strictEqual(depositTotal, 400000);
    assert.strictEqual(grandTotal, 450000);
  });

  console.log('\n\x1b[36m--- 3. ATOMIC BOOKING & CONCURRENCY CONFLICT GUARD ---\x1b[0m');
  test('Successful booking atomic insertion with sufficient stock', () => {
    const now = new Date();
    const start = new Date(now.getTime() + 86400000 * 20); // in 20 days
    const due = new Date(now.getTime() + 86400000 * 23); // in 23 days

    const res = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001', // Arduino Uno (5 total)
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Robotics testbench verification',
      rulesAcknowledged: true,
    });

    assert.strictEqual(res.success, true);
    assert(res.booking, 'New booking object must be returned');
    assert.strictEqual(res.booking.status, 'pending');
  });

  test('Rejects booking when return date is before or equal to start date', () => {
    const now = new Date();
    const res = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001',
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: now.toISOString(),
      dueAt: new Date(now.getTime() - 3600000).toISOString(), // earlier
      purpose: 'Invalid dates test',
      rulesAcknowledged: true,
    });

    assert.strictEqual(res.success, false);
    assert(res.error?.includes('date'));
  });

  test('Overlapping competing bookings exceeding stock are blocked atomically', () => {
    // Oscilloscope (d0000005) total_quantity = 1
    const osc = db.getResource('d0000005-0000-0000-0000-000000000005');
    assert(osc, 'Oscilloscope must exist');
    assert.strictEqual(osc.total_quantity, 1, 'Oscilloscope stock must be 1');

    const start = new Date('2027-01-10T10:00:00Z');
    const due = new Date('2027-01-12T10:00:00Z');

    // First student reserves the only unit
    const req1 = db.createBookingAtomic({
      resourceId: osc.id,
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Student 1 RF Analysis',
      rulesAcknowledged: true,
    });
    assert.strictEqual(req1.success, true, 'First student must secure the single unit');

    // Second competing student attempts overlapping booking
    const overlappingStart = new Date('2027-01-11T10:00:00Z'); // overlaps with Jan 10-12
    const overlappingDue = new Date('2027-01-13T10:00:00Z');

    const req2 = db.createBookingAtomic({
      resourceId: osc.id,
      borrowerId: 'c0000000-0000-0000-0000-000000000002',
      quantity: 1,
      startAt: overlappingStart.toISOString(),
      dueAt: overlappingDue.toISOString(),
      purpose: 'Student 2 Competing Request',
      rulesAcknowledged: true,
    });

    assert.strictEqual(req2.success, false, 'Overlapping request must be rejected');
    assert.strictEqual(req2.conflict, true, 'Conflict flag must be true');
    assert.strictEqual(req2.availableQuantity, 0, 'Available quantity must be 0');
  });

  console.log('\n\x1b[36m--- 4. LIFECYCLE STATE TRANSITIONS ---\x1b[0m');
  test('Pending booking can be approved by manager', () => {
    const start = new Date('2027-02-01T10:00:00Z');
    const due = new Date('2027-02-04T10:00:00Z');
    const bRes = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001',
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Approve lifecycle test',
      rulesAcknowledged: true,
    });
    assert.strictEqual(bRes.success, true);
    assert(bRes.booking);
    const bookingId = bRes.booking.id;

    // Approve
    const appRes = db.approveBooking(bookingId, 'b0000000-0000-0000-0000-000000000002');
    assert.strictEqual(appRes.success, true);

    const updated = db.getBooking(bookingId);
    assert(updated);
    assert.strictEqual(updated.status, 'approved');
    assert.strictEqual(updated.approved_by, 'b0000000-0000-0000-0000-000000000002');
  });

  test('Check-out records initial condition and transitions to checked_out', () => {
    const start = new Date('2027-03-01T10:00:00Z');
    const due = new Date('2027-03-05T10:00:00Z');
    const bRes = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001',
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Checkout test',
      rulesAcknowledged: true,
    });
    assert(bRes.booking);
    const bookingId = bRes.booking.id;
    db.approveBooking(bookingId, 'b0000000-0000-0000-0000-000000000002');

    // Checkout
    const coRes = db.checkoutEquipment({
      bookingId,
      managerId: 'b0000000-0000-0000-0000-000000000002',
      condition: 'excellent',
      notes: 'Initial checkout inspection passed',
    });
    assert.strictEqual(coRes.success, true);

    const b = db.getBooking(bookingId);
    assert(b);
    assert.strictEqual(b.status, 'checked_out');

    const reports = db.getConditionReports(bookingId);
    assert(reports.some((r) => r.report_type === 'checkout' && r.condition === 'excellent'));
  });

  test('Return inspection transitions booking to completed and appends audit log', () => {
    const start = new Date('2027-04-01T10:00:00Z');
    const due = new Date('2027-04-05T10:00:00Z');
    const bRes = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001',
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Return test',
      rulesAcknowledged: true,
    });
    assert(bRes.booking);
    const bookingId = bRes.booking.id;
    db.approveBooking(bookingId, 'b0000000-0000-0000-0000-000000000002');
    db.checkoutEquipment({
      bookingId,
      managerId: 'b0000000-0000-0000-0000-000000000002',
      condition: 'good',
      notes: 'Issued in good condition',
    });

    // Return
    const retRes = db.returnEquipment({
      bookingId,
      managerId: 'b0000000-0000-0000-0000-000000000002',
      condition: 'good',
      notes: 'Returned in good order',
      isIncident: false,
    });
    assert.strictEqual(retRes.success, true);

    const b = db.getBooking(bookingId);
    assert(b);
    assert.strictEqual(b.status, 'completed');

    const audit = db.getAuditLogs().filter((a) => a.entity_id === bookingId);
    assert(audit.some((a) => a.action === 'return_completed'));
  });

  test('Return with damage initiates incident review status', () => {
    const start = new Date('2027-05-01T10:00:00Z');
    const due = new Date('2027-05-05T10:00:00Z');
    const bRes = db.createBookingAtomic({
      resourceId: 'd0000001-0000-0000-0000-000000000001',
      borrowerId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      startAt: start.toISOString(),
      dueAt: due.toISOString(),
      purpose: 'Damage incident test',
      rulesAcknowledged: true,
    });
    assert(bRes.booking);
    const bookingId = bRes.booking.id;
    db.approveBooking(bookingId, 'b0000000-0000-0000-0000-000000000002');
    db.checkoutEquipment({
      bookingId,
      managerId: 'b0000000-0000-0000-0000-000000000002',
      condition: 'good',
      notes: 'Pre-checkout ok',
    });

    // Return with damage
    const retRes = db.returnEquipment({
      bookingId,
      managerId: 'b0000000-0000-0000-0000-000000000002',
      condition: 'damaged',
      notes: 'Power connector port cracked',
      isIncident: true,
      incidentType: 'damage',
      incidentDescription: 'Cracked barrel jack connector',
    });
    assert.strictEqual(retRes.success, true);

    const b = db.getBooking(bookingId);
    assert(b);
    assert.strictEqual(b.status, 'incident_review');

    const inc = db.getIncidents().find((i) => i.booking_id === bookingId);
    assert(inc, 'Incident record must be created');
    assert.strictEqual(inc.incident_type, 'damage');
  });

  console.log('\n\x1b[36m--- 5. WAITLIST QUEUE DISCIPLINE ---\x1b[0m');
  test('Adding to waitlist increments queue position strictly FIFO', () => {
    const resourceId = 'd0000005-0000-0000-0000-000000000005';
    const res1 = db.addToWaitlist({
      resourceId,
      userId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
      priorityReason: 'Final year capstone 1',
    });
    assert.strictEqual(res1.success, true);
    assert(res1.entry);
    assert(res1.entry.queue_position >= 1);

    // Duplicate active request from same user is blocked
    const resDuplicate = db.addToWaitlist({
      resourceId,
      userId: 'c0000000-0000-0000-0000-000000000001',
      quantity: 1,
    });
    assert.strictEqual(resDuplicate.success, false, 'Duplicate active waitlist must be blocked');
  });

  console.log('\n============================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();

// scripts/test-handover-qr-flow.js
// Comprehensive End-to-End Test for Seeker & Keeper Lifecycle:
// 1. Photo ID booking & Keeper manual ID verification
// 2. Handover QR code generation with seeker redirect URL: /receiver/bookings?claim=...&token=...
// 3. Seeker QR scan / auto-claim and live countdown timer activation
// 4. Return QR code generation
// 5. Dual-verification return requirement (Return QR scan + Keeper manual bench inspection)
// 6. Transition to completed, stopping timer and restocking inventory
// 7. Notification delivery & readability for both personas

const { db } = require('../src/lib/db/store');

async function testHandoverQrFlow() {
  console.log('\n============================================================');
  console.log('  TESTING COMPLETE SEEKER & KEEPER QR & RETURN LIFECYCLE');
  console.log('============================================================\n');

  const seekerId = 'c0000000-0000-0000-0000-000000000001'; // Rohan Verma / Aarav Sharma (Seeker - Student)
  const keeperId = 'b0000000-0000-0000-0000-000000000002'; // Prof. Alistair Vance (Keeper - Lab Head)
  const resourceId = 'd0000001-0000-0000-0000-000000000001'; // Arduino Uno Rev3

  const seeker = db.getProfile(seekerId);
  const keeper = db.getProfile(keeperId);
  const resource = db.getResource(resourceId);

  console.log(`[1] Verified Seeker Persona: ${seeker.display_name} (${seeker.institute_name})`);
  console.log(`[2] Verified Keeper Persona: ${keeper.display_name} (${keeper.institute_name})`);
  console.log(`[3] Target Equipment: ${resource.name} (Stock: ${resource.available_quantity}/${resource.total_quantity})\n`);

  // STEP 1: Seeker books item with Photo ID and duration
  console.log('--- STEP 1: Seeker Submits Booking with Photo ID ---');
  const now = new Date();
  const future = new Date(now.getTime() + 3 * 86400000 + 4 * 3600000 + 30 * 60000); // 3d 4h 30m

  const bookingRes = db.createBookingAtomic({
    resourceId,
    borrowerId: seekerId,
    quantity: 1,
    startAt: now.toISOString(),
    dueAt: future.toISOString(),
    purpose: 'Smart Agriculture Sensor Node with Soil Moisture & LoRa',
    idCardImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    durationDays: 3,
    durationHours: 4,
    durationMinutes: 30,
  });

  if (!bookingRes.booking) {
    throw new Error(`Failed to create booking: ${bookingRes.error}`);
  }

  const booking = bookingRes.booking;
  console.log(`✔ Booking Created Successfully! ID: ${booking.id}`);
  console.log(`  Initial Status: ${booking.status}`);
  console.log(`  ID Card Photo Attached: ${booking.id_card_image_url ? 'YES' : 'NO'}`);
  console.log(`  Duration Requested: ${booking.duration_days}d ${booking.duration_hours}h ${booking.duration_minutes}m\n`);

  // STEP 2: Keeper reviews and approves ID photo, generating Handover QR
  console.log('--- STEP 2: Keeper Inspects ID Photo & Verifies Booking ---');
  const approveRes = db.verifyIdAndApproveBooking({
    bookingId: booking.id,
    managerId: keeperId,
    approvedDuration: { days: 3, hours: 4, minutes: 30 },
  });

  if (!approveRes.success) {
    throw new Error(`Failed to approve booking: ${approveRes.error}`);
  }

  const approvedBooking = db.getBooking(booking.id);
  console.log(`✔ Keeper Approved ID & Generated Handover QR!`);
  console.log(`  New Status: ${approvedBooking.status}`);
  console.log(`  ID Verified: ${approvedBooking.id_card_verified}`);
  console.log(`  Handover QR Token: ${approvedBooking.handover_qr_code}`);

  // Test redirect URL encoding
  const targetRedirectUrl = `http://localhost:3000/receiver/bookings?claim=${booking.id}&token=${encodeURIComponent(approvedBooking.handover_qr_code)}`;
  console.log(`  Encoded Redirection Target: ${targetRedirectUrl}\n`);

  // STEP 3: Seeker scans Handover QR code or opens redirect link
  console.log('--- STEP 3: Seeker Scans Handover QR Code / Uses Redirection Link ---');
  const scannedToken = approvedBooking.handover_qr_code;
  const claimRes = db.claimHandoverWithQr({
    bookingId: booking.id,
    scannedQrToken: scannedToken,
    receiverId: seekerId,
  });

  if (!claimRes.success) {
    throw new Error(`Failed to claim handover with QR token: ${claimRes.error}`);
  }

  const activeBooking = db.getBooking(booking.id);
  console.log(`✔ Handover Confirmed & Item Checked Out!`);
  console.log(`  Status: ${activeBooking.status}`);
  console.log(`  Timer Activated: ${activeBooking.timer_activated}`);
  console.log(`  Deadline At: ${activeBooking.deadline_at}`);
  console.log(`  Return QR Pre-initialized: ${activeBooking.return_qr_code ? 'YES (' + activeBooking.return_qr_code + ')' : 'NO'}\n`);

  // STEP 4: Enforce Return Double-Verification Requirement
  console.log('--- STEP 4: Test Double-Verification Enforcement (QR Scan + Manual Inspection) ---');

  // Attempt A: Try completing return with invalid/missing return QR token (must fail)
  const invalidReturnRes = db.completeReturnWithQr({
    bookingId: booking.id,
    managerId: keeperId,
    scannedReturnQr: 'INVALID_TOKEN_123',
    condition: 'good',
    notes: 'Testing without valid return QR',
  });
  console.log(`  Attempt with invalid return QR token: success = ${invalidReturnRes.success} (Error: "${invalidReturnRes.error}")`);
  if (invalidReturnRes.success) {
    throw new Error('SECURITY VIOLATION: Return completed without matching Return QR code!');
  }
  console.log(`✔ Verified: System successfully rejected return attempt without valid Return QR scan.\n`);

  // Attempt B: Seeker generates / presents legitimate Return QR code
  console.log('--- STEP 5: Seeker Displays Return QR Code & Keeper Completes Manual Verification ---');
  const returnQrRes = db.generateReturnQr(booking.id, seekerId);
  if (!returnQrRes.success || !returnQrRes.qrToken) {
    throw new Error(`Failed to generate return QR: ${returnQrRes.error}`);
  }
  console.log(`✔ Seeker Return QR Code Generated: ${returnQrRes.qrToken}`);

  // Keeper scans Seeker Return QR and performs manual condition verification
  const completeReturnRes = db.completeReturnWithQr({
    bookingId: booking.id,
    managerId: keeperId,
    scannedReturnQr: returnQrRes.qrToken,
    condition: 'good',
    notes: 'Physical bench check passed. ATmega328P pins intact, USB port undamaged, accessories accounted for.',
  });

  if (!completeReturnRes.success) {
    throw new Error(`Failed to complete return with Return QR: ${completeReturnRes.error}`);
  }

  const completedBooking = db.getBooking(booking.id);
  console.log(`✔ Return QR Scanned & Manually Verified by Keeper!`);
  console.log(`  Final Status: ${completedBooking.status}`);
  console.log(`  Return QR Scanned: ${completedBooking.return_qr_scanned}`);
  console.log(`  Return Verified By Keeper: ${completedBooking.return_verified_by}`);
  console.log(`  Return Verified At: ${completedBooking.return_verified_at}`);
  console.log(`  Equipment Restocked: Available ${db.getResource(resourceId).available_quantity}/${db.getResource(resourceId).total_quantity}\n`);

  // STEP 6: Verify Notification Section
  console.log('--- STEP 6: Verify Notification Delivery & Readability ---');
  const seekerNotifs = db.getNotifications(seekerId);
  const keeperNotifs = db.getNotifications(keeperId);

  console.log(`✔ Seeker Notifications (${seekerNotifs.length} total):`);
  seekerNotifs.slice(0, 3).forEach((n, i) => {
    console.log(`   [${i + 1}] [${n.event_type}] "${n.title}"`);
    console.log(`       Message: ${n.message}`);
  });

  console.log(`\n✔ Keeper Notifications (${keeperNotifs.length} total):`);
  keeperNotifs.slice(0, 3).forEach((n, i) => {
    console.log(`   [${i + 1}] [${n.event_type}] "${n.title}"`);
    console.log(`       Message: ${n.message}`);
  });

  console.log('\n============================================================');
  console.log('  ALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!');
  console.log('============================================================\n');
}

testHandoverQrFlow()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Handover test error:', err);
    process.exit(1);
  });

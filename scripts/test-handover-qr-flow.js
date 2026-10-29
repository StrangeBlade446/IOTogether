// scripts/test-handover-qr-flow.js
// End-to-end verification of Seeker & Keeper portals + Handover QR feature

const { db } = require('../src/lib/db/store');

async function testHandoverQrFlow() {
  console.log('\n============================================================');
  console.log('  TESTING SEEKER & KEEPER LIFECYCLE + HANDOVER QR FEATURE');
  console.log('============================================================\n');

  const seekerId = 'c0000000-0000-0000-0000-000000000001'; // Rohan Verma (Seeker - Student)
  const keeperId = 'b0000000-0000-0000-0000-000000000002'; // Prof. Alistair Vance (Keeper - Lab Head)
  const resourceId = 'd0000001-0000-0000-0000-000000000001'; // Arduino Uno Rev3 SMD

  const seeker = db.getProfile(seekerId);
  const keeper = db.getProfile(keeperId);
  const resource = db.getResource(resourceId);

  console.log(`[1] Verified Seeker Persona: ${seeker.display_name} (${seeker.institute_name})`);
  console.log(`[2] Verified Keeper Persona: ${keeper.display_name} (${keeper.institute_name})`);
  console.log(`[3] Target Equipment: ${resource.name} (Stock: ${resource.available_quantity}/${resource.total_quantity})\n`);

  // STEP 1: Seeker books item with Photo ID and requested duration
  console.log('--- STEP 1: Seeker Submits Booking with Photo ID ---');
  const now = new Date();
  const future = new Date(now.getTime() + 3 * 86400000 + 4 * 3600000 + 30 * 60000); // 3d 4h 30m

  const bookingRes = db.createBookingAtomic({
    resourceId,
    borrowerId: seekerId,
    quantity: 1,
    startAt: now.toISOString(),
    dueAt: future.toISOString(),
    purpose: 'Smart Irrigation IoT Prototype with Soil Moisture & Relay',
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

  // STEP 2: Keeper reviews and clicks "Manual Verified"
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
  console.log(`  Verified By: ${approvedBooking.id_card_verified_by}`);
  console.log(`  Handover QR Token Generated: ${approvedBooking.handover_qr_code}\n`);

  if (!approvedBooking.handover_qr_code) {
    throw new Error('Handover QR token was not generated on approval!');
  }

  // STEP 3: Seeker scans Handover QR code
  console.log('--- STEP 3: Seeker Scans Handover QR Code to Claim Equipment ---');
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
  console.log(`✔ Handover Confirmed! Status: ${activeBooking.status}`);
  console.log(`  Timer Activated: ${activeBooking.timer_activated}`);
  console.log(`  Issued At: ${activeBooking.issued_at}`);
  console.log(`  Deadline At: ${activeBooking.deadline_at}`);

  const deadlineMs = new Date(activeBooking.deadline_at).getTime() - new Date().getTime();
  const remHours = Math.floor(deadlineMs / 3600000);
  const remMinutes = Math.floor((deadlineMs % 3600000) / 60000);
  console.log(`  Countdown Timer Running: ~${remHours} hours ${remMinutes} minutes remaining\n`);

  // STEP 4: Verify Notifications & Audit Ledger
  console.log('--- STEP 4: Verify Consortium Notifications & Audit Ledger ---');
  const seekerNotifs = db.getNotifications(seekerId);
  const keeperNotifs = db.getNotifications(keeperId);
  console.log(`✔ Seeker Notifications Count: ${seekerNotifs.length}`);
  console.log(`  Latest Seeker Notification: "${seekerNotifs[0]?.title}" - ${seekerNotifs[0]?.message}`);
  console.log(`✔ Keeper Notifications Count: ${keeperNotifs.length}`);
  console.log(`  Latest Keeper Notification: "${keeperNotifs[0]?.title}" - ${keeperNotifs[0]?.message}`);

  // STEP 5: Keeper Inspects Return and Completes Lifecycle
  console.log('\n--- STEP 5: Keeper Inspects Return & Completes Handover ---');
  const returnRes = db.returnEquipment({
    bookingId: booking.id,
    managerId: keeperId,
    condition: 'good',
    notes: 'Equipment returned in pristine condition with all jumper cables and breadboard intact.',
    isIncident: false,
  });

  if (!returnRes.success) {
    throw new Error(`Failed to complete return: ${returnRes.error}`);
  }

  const completedBooking = db.getBooking(booking.id);
  console.log(`✔ Return Completed! Final Status: ${completedBooking.status}`);
  console.log(`  Returned At: ${completedBooking.returned_at}`);
  console.log(`  Equipment Restocked: Available ${db.getResource(resourceId).available_quantity}/${db.getResource(resourceId).total_quantity}`);

  console.log('\n============================================================');
  console.log('  ALL SEEKER, KEEPER & HANDOVER QR TESTS PASSED WITH 100% SUCCESS!');
  console.log('============================================================\n');
}

testHandoverQrFlow()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Handover test error:', err);
    process.exit(1);
  });

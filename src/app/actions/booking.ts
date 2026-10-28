'use server';

import { revalidatePath } from 'next/cache';
import { getSession, checkPermission } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { ConditionReport, Incident } from '@/types/database';

export async function requestBookingAction(formData: {
  resourceId: string;
  quantity: number;
  startAt: string;
  dueAt: string;
  purpose: string;
  rulesAcknowledged: boolean;
  durationDays?: number;
  durationHours?: number;
  durationMinutes?: number;
  idCardImageUrl?: string;
}) {
  const session = await getSession();
  if (!session.user) {
    return { success: false, error: 'You must be logged in to request a booking' };
  }

  // Check if resource has training restrictions and if borrower satisfies it
  const resource = db.getResource(formData.resourceId);
  if (!resource) {
    return { success: false, error: 'Resource not found' };
  }

  if (resource.training_required) {
    const eligibility = db.getEligibility(session.user.id, resource.institution_id);
    if (!eligibility) {
      return {
        success: false,
        error: `This equipment requires verified prerequisite training/certification at ${resource.institution?.name || 'the institution'} before booking.`,
      };
    }
  }

  const result = db.createBookingAtomic({
    resourceId: formData.resourceId,
    borrowerId: session.user.id,
    quantity: Number(formData.quantity),
    startAt: formData.startAt,
    dueAt: formData.dueAt,
    purpose: formData.purpose,
    rulesAcknowledged: formData.rulesAcknowledged,
    durationDays: formData.durationDays,
    durationHours: formData.durationHours,
    durationMinutes: formData.durationMinutes,
    idCardImageUrl: formData.idCardImageUrl,
  });

  if (result.success) {
    revalidatePath('/my-bookings');
    revalidatePath('/receiver/bookings');
    revalidatePath('/explore');
    revalidatePath('/receiver/explore');
    revalidatePath(`/resources/${formData.resourceId}`);
    revalidatePath('/manage/requests');
    revalidatePath('/sender/requests');
  }

  return result;
}

export async function verifyIdAndApproveBookingAction(
  bookingId: string,
  approvedDuration?: { days?: number; hours?: number; minutes?: number }
) {
  const session = await getSession();
  const booking = db.getBooking(bookingId);
  if (!booking || !booking.resource) {
    return { success: false, error: 'Booking not found' };
  }

  if (!checkPermission(session, 'manage_institution', booking.resource.institution_id)) {
    return { success: false, error: 'Forbidden: You do not have manager permissions for this institution' };
  }

  const res = db.verifyIdAndApproveBooking({
    bookingId,
    managerId: session.user.id,
    approvedDuration,
  });

  if (res.success) {
    revalidatePath('/manage/requests');
    revalidatePath('/sender/requests');
    revalidatePath('/manage/loans');
    revalidatePath('/sender/loans');
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${bookingId}`);
    revalidatePath('/receiver/bookings');
    revalidatePath(`/receiver/bookings/${bookingId}`);
  }
  return res;
}

export async function claimHandoverWithQrAction(bookingId: string, scannedQrToken: string) {
  const session = await getSession();
  if (!session.user) {
    return { success: false, error: 'You must be logged in to claim handover' };
  }

  const booking = db.getBooking(bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  const res = db.claimHandoverWithQr({
    bookingId,
    scannedQrToken,
    receiverId: session.user.id,
  });

  if (res.success) {
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${bookingId}`);
    revalidatePath('/receiver/bookings');
    revalidatePath(`/receiver/bookings/${bookingId}`);
    revalidatePath('/manage/requests');
    revalidatePath('/sender/requests');
    revalidatePath('/manage/loans');
    revalidatePath('/sender/loans');
  }

  return res;
}

export async function approveBookingAction(bookingId: string) {
  const session = await getSession();
  const booking = db.getBooking(bookingId);
  if (!booking || !booking.resource) {
    return { success: false, error: 'Booking not found' };
  }

  if (!checkPermission(session, 'manage_institution', booking.resource.institution_id)) {
    return { success: false, error: 'Forbidden: You do not have manager permissions for this institution' };
  }

  const res = db.approveBooking(bookingId, session.user.id);
  if (res.success) {
    revalidatePath('/manage/requests');
    revalidatePath('/sender/requests');
    revalidatePath('/manage/loans');
    revalidatePath('/sender/loans');
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${bookingId}`);
    revalidatePath('/receiver/bookings');
    revalidatePath(`/receiver/bookings/${bookingId}`);
  }
  return res;
}

export async function rejectBookingAction(bookingId: string, reason: string) {
  const session = await getSession();
  const booking = db.getBooking(bookingId);
  if (!booking || !booking.resource) {
    return { success: false, error: 'Booking not found' };
  }

  if (!checkPermission(session, 'manage_institution', booking.resource.institution_id)) {
    return { success: false, error: 'Forbidden: You do not have manager permissions for this institution' };
  }

  const res = db.rejectBooking(bookingId, session.user.id, reason);
  if (res.success) {
    revalidatePath('/manage/requests');
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${bookingId}`);
  }
  return res;
}

export async function cancelBookingAction(bookingId: string, reason: string) {
  const session = await getSession();
  const booking = db.getBooking(bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  if (booking.borrower_id !== session.user.id) {
    return { success: false, error: 'Forbidden: You can only cancel your own booking requests' };
  }

  const res = db.cancelBooking(bookingId, session.user.id, reason);
  if (res.success) {
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${bookingId}`);
    revalidatePath('/manage/requests');
  }
  return res;
}

export async function checkoutEquipmentAction(params: {
  bookingId: string;
  unitId?: string;
  condition: ConditionReport['condition'];
  notes: string;
  evidencePaths?: string[];
}) {
  const session = await getSession();
  const booking = db.getBooking(params.bookingId);
  if (!booking || !booking.resource) {
    return { success: false, error: 'Booking not found' };
  }

  if (!checkPermission(session, 'manage_institution', booking.resource.institution_id)) {
    return { success: false, error: 'Forbidden: You do not have manager permissions to issue this equipment' };
  }

  const res = db.checkoutEquipment({
    bookingId: params.bookingId,
    managerId: session.user.id,
    unitId: params.unitId,
    condition: params.condition,
    notes: params.notes,
    evidencePaths: params.evidencePaths,
  });

  if (res.success) {
    revalidatePath('/manage/requests');
    revalidatePath('/manage/loans');
    revalidatePath('/manage/returns');
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${params.bookingId}`);
  }
  return res;
}

export async function returnEquipmentAction(params: {
  bookingId: string;
  condition: ConditionReport['condition'];
  notes: string;
  evidencePaths?: string[];
  isIncident?: boolean;
  incidentType?: Incident['incident_type'];
  incidentDescription?: string;
}) {
  const session = await getSession();
  const booking = db.getBooking(params.bookingId);
  if (!booking || !booking.resource) {
    return { success: false, error: 'Booking not found' };
  }

  if (!checkPermission(session, 'manage_institution', booking.resource.institution_id)) {
    return { success: false, error: 'Forbidden: You do not have manager permissions to process this return' };
  }

  const res = db.returnEquipment({
    bookingId: params.bookingId,
    managerId: session.user.id,
    condition: params.condition,
    notes: params.notes,
    evidencePaths: params.evidencePaths,
    isIncident: params.isIncident,
    incidentType: params.incidentType,
    incidentDescription: params.incidentDescription,
  });

  if (res.success) {
    revalidatePath('/manage/loans');
    revalidatePath('/manage/returns');
    revalidatePath('/manage/incidents');
    revalidatePath('/my-bookings');
    revalidatePath(`/my-bookings/${params.bookingId}`);
  }
  return res;
}

export async function joinWaitlistAction(params: { resourceId: string; quantity: number; priorityReason?: string }) {
  const session = await getSession();
  if (!session.user) {
    return { success: false, error: 'Must be logged in to join waitlist' };
  }

  const res = db.addToWaitlist({
    resourceId: params.resourceId,
    userId: session.user.id,
    quantity: Number(params.quantity),
    priorityReason: params.priorityReason,
  });

  if (res.success) {
    revalidatePath('/my-bookings');
    revalidatePath(`/resources/${params.resourceId}`);
  }
  return res;
}

export async function resolveIncidentAction(incidentId: string, notes: string) {
  const session = await getSession();
  if (!session.managedInstitutions.length && !session.isPlatformAdmin) {
    return { success: false, error: 'Forbidden: Staff permissions required to resolve incidents' };
  }

  const res = db.resolveIncident(incidentId, session.user.id, notes);
  if (res.success) {
    revalidatePath('/manage/incidents');
    revalidatePath('/admin/incidents');
  }
  return res;
}

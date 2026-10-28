'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types/database';
import { verifyIdAndApproveBookingAction, rejectBookingAction } from '@/app/actions/booking';
import { SenderHandoverQrModal } from '@/components/qr/SenderHandoverQrModal';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  UserCheck,
  AlertCircle,
  Eye,
  Check,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';

interface SenderRequestsClientProps {
  initialBookings: Booking[];
  currentUserId: string;
}

export function SenderRequestsClient({ initialBookings, currentUserId }: SenderRequestsClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeQrModalBooking, setActiveQrModalBooking] = useState<Booking | null>(null);
  const [zoomPhotoUrl, setZoomPhotoUrl] = useState<string | null>(null);

  // Duration adjustments map: bookingId -> { days, hours, minutes }
  const [durations, setDurations] = useState<Record<string, { days: number; hours: number; minutes: number }>>(() => {
    const map: Record<string, { days: number; hours: number; minutes: number }> = {};
    for (const b of initialBookings) {
      map[b.id] = {
        days: b.duration_days ?? 3,
        hours: b.duration_hours ?? 0,
        minutes: b.duration_minutes ?? 0,
      };
    }
    return map;
  });

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const handleDurationChange = (bookingId: string, field: 'days' | 'hours' | 'minutes', val: number) => {
    setDurations((prev) => ({
      ...prev,
      [bookingId]: {
        ...(prev[bookingId] || { days: 3, hours: 0, minutes: 0 }),
        [field]: Math.max(0, val),
      },
    }));
  };

  const handleManualVerified = async (booking: Booking) => {
    setProcessingId(booking.id);
    const customDur = durations[booking.id] || {
      days: booking.duration_days ?? 3,
      hours: booking.duration_hours ?? 0,
      minutes: booking.duration_minutes ?? 0,
    };

    try {
      const res = await verifyIdAndApproveBookingAction(booking.id, customDur);
      if (res.success && res.qrCode) {
        const updatedBooking: Booking = {
          ...booking,
          status: 'approved',
          id_card_verified: true,
          handover_qr_code: res.qrCode,
          duration_days: customDur.days,
          duration_hours: customDur.hours,
          duration_minutes: customDur.minutes,
        };

        setBookings((prev) => prev.map((b) => (b.id === booking.id ? updatedBooking : b)));
        // Open QR modal on Lab Head screen immediately!
        setActiveQrModalBooking(updatedBooking);
      }
    } finally {
      setProcessingId(null);
      router.refresh();
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Please enter the reason for rejecting this request (e.g., ID photo illegible, insufficient stock):');
    if (!reason) return;

    setProcessingId(bookingId);
    try {
      const res = await rejectBookingAction(bookingId, reason);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b)));
      }
    } finally {
      setProcessingId(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filter === 'pending'
              ? 'bg-amber-500 text-navy-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <span>Pending ID Verification</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-neutral-800 text-amber-300">
            {bookings.filter((b) => b.status === 'pending').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('approved')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            filter === 'approved'
              ? 'bg-amber-500 text-navy-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <span>Approved (Show Handover QR)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-neutral-800 text-cyan-300">
            {bookings.filter((b) => b.status === 'approved').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-amber-500 text-navy-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          All Requests ({bookings.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <ShieldCheck className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No requests in this view</h3>
          <p className="text-xs text-slate-500 mt-1">All borrower photo IDs and loan periods have been handled.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((b) => {
            const isPending = b.status === 'pending';
            const isApproved = b.status === 'approved';
            const dur = durations[b.id] || {
              days: b.duration_days ?? 3,
              hours: b.duration_hours ?? 0,
              minutes: b.duration_minutes ?? 0,
            };

            return (
              <div
                key={b.id}
                className={`bg-neutral-900 border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${
                  isApproved
                    ? 'border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header row: Resource, Borrower Info, Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{b.resource?.name || 'Equipment'}</h3>
                      <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-slate-300">
                        Qty: {b.quantity}
                      </span>
                      {isPending && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting Manual Verification
                        </span>
                      )}
                      {isApproved && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified & QR Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Project Purpose: <span className="text-slate-200 italic">&ldquo;{b.purpose}&rdquo;</span>
                    </p>
                  </div>

                  {/* Borrower Identity Details */}
                  <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800 self-start md:self-center shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-white">{b.borrower?.display_name || 'Borrower'}</div>
                      <div className="text-[11px] text-cyan-300 font-medium">
                        {b.borrower?.post || 'Student'} • ID: {b.borrower?.id_number || 'STU-NIT-819'}
                      </div>
                      <div className="text-[10px] text-slate-400">{b.borrower?.institute_name}</div>
                    </div>
                  </div>
                </div>

                {/* Main Body: ID Picture Inspection & Days/Hours/Minutes Approval */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Student/Teacher ID Photo Preview */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" /> Submitted Photo ID Card
                      </span>
                      {b.id_card_verified ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Manually Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                          Inspect Carefully
                        </span>
                      )}
                    </div>

                    {b.id_card_image_url ? (
                      <div className="relative group overflow-hidden rounded-lg border border-neutral-700 bg-black">
                        <img
                          src={b.id_card_image_url}
                          alt="Student or Teacher ID Card"
                          className="w-full h-44 object-cover object-center group-hover:opacity-90 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomPhotoUrl(b.id_card_image_url!)}
                          className="absolute inset-0 m-auto w-fit h-fit px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold border border-neutral-600 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Enlarge ID Photo
                        </button>
                      </div>
                    ) : (
                      <div className="h-44 flex items-center justify-center rounded-lg border border-dashed border-neutral-800 text-slate-500 text-xs">
                        No ID photo submitted
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 leading-tight">
                      Verify that the student or teacher face photo and name match the borrowing applicant before approving handover.
                    </div>
                  </div>

                  {/* Right: Duration Setting (Days, Hours, Minutes) & Handover Action */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-cyan-400" /> Approved Borrowing Duration
                        </label>
                        <span className="text-[11px] text-slate-400">Days, Hours, Minutes</span>
                      </div>

                      {/* Days, Hours, Minutes Inputs */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Days</label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            disabled={!isPending}
                            value={dur.days}
                            onChange={(e) => handleDurationChange(b.id, 'days', parseInt(e.target.value) || 0)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-70"
                          />
                        </div>

                        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Hours</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            disabled={!isPending}
                            value={dur.hours}
                            onChange={(e) => handleDurationChange(b.id, 'hours', parseInt(e.target.value) || 0)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-sm text-cyan-400 focus:outline-none focus:border-amber-500 disabled:opacity-70"
                          />
                        </div>

                        <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Minutes</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            disabled={!isPending}
                            value={dur.minutes}
                            onChange={(e) => handleDurationChange(b.id, 'minutes', parseInt(e.target.value) || 0)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-sm text-amber-400 focus:outline-none focus:border-amber-500 disabled:opacity-70"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-slate-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Approved Period:</span>
                          <span className="font-mono font-bold text-white">
                            {dur.days}d {dur.hours}h {dur.minutes}m
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Timer will begin counting down immediately when receiver scans your Handover QR.
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Manual Verified or Show QR */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={processingId === b.id}
                            onClick={() => handleManualVerified(b)}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                          >
                            {processingId === b.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                            Manual Verified & Generate QR
                          </button>

                          <button
                            type="button"
                            disabled={processingId === b.id}
                            onClick={() => handleReject(b.id)}
                            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold text-xs transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <div className="w-full space-y-2">
                          <button
                            type="button"
                            onClick={() => setActiveQrModalBooking(b)}
                            className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 transition flex items-center justify-center gap-2 animate-pulse"
                          >
                            <QrCode className="w-4 h-4" /> Display Handover QR Code for Receiver
                          </button>
                          <p className="text-[10px] text-center text-slate-400">
                            Receiver scans this QR at your desk to complete checkout and activate the countdown timer.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Handover QR Modal for Lab Head Screen */}
      {activeQrModalBooking && activeQrModalBooking.handover_qr_code && (
        <SenderHandoverQrModal
          bookingId={activeQrModalBooking.id}
          qrToken={activeQrModalBooking.handover_qr_code}
          resourceName={activeQrModalBooking.resource?.name || 'Equipment'}
          borrowerName={activeQrModalBooking.borrower?.display_name || 'Borrower'}
          borrowerPost={activeQrModalBooking.borrower?.post}
          borrowerInstitute={activeQrModalBooking.borrower?.institute_name}
          durationText={`${activeQrModalBooking.duration_days ?? 3} Days, ${activeQrModalBooking.duration_hours ?? 0} Hours, ${activeQrModalBooking.duration_minutes ?? 0} Mins`}
          onClose={() => setActiveQrModalBooking(null)}
        />
      )}

      {/* Enlarged ID Photo Preview Modal */}
      {zoomPhotoUrl && (
        <div
          onClick={() => setZoomPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-2xl p-3">
            <img src={zoomPhotoUrl} alt="Enlarged ID Card" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
            <div className="mt-2 text-center text-xs text-slate-300">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Booking } from '@/types/database';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { ReceiverQrScannerModal } from '@/components/qr/ReceiverQrScannerModal';
import { SeekerReturnQrModal } from '@/components/qr/SeekerReturnQrModal';
import {
  cancelBookingAction,
  claimHandoverWithQrAction,
  generateReturnQrAction,
} from '@/app/actions/booking';
import {
  Layers,
  Clock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Camera,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  Loader2,
  Check,
} from 'lucide-react';

interface ReceiverBookingsClientProps {
  initialBookings: Booking[];
  currentUserId: string;
  autoClaimBookingId?: string;
  autoClaimToken?: string;
}

export function ReceiverBookingsClient({
  initialBookings,
  currentUserId,
  autoClaimBookingId,
  autoClaimToken,
}: ReceiverBookingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'checked_out' | 'completed'>('all');
  const [activeQrModalBooking, setActiveQrModalBooking] = useState<Booking | null>(null);
  const [activeReturnModalBooking, setActiveReturnModalBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [generatingReturnForId, setGeneratingReturnForId] = useState<string | null>(null);

  // Claim banner notification
  const [claimBanner, setClaimBanner] = useState<{
    type: 'success' | 'error' | 'loading';
    title: string;
    message: string;
  } | null>(null);

  const claimedRef = useRef(false);

  // Auto-claim when landing on page via Handover QR Code redirect URL
  useEffect(() => {
    const claimId = autoClaimBookingId || searchParams.get('claim');
    const token = autoClaimToken || searchParams.get('token');

    if (claimId && token && !claimedRef.current) {
      claimedRef.current = true;
      setClaimBanner({
        type: 'loading',
        title: 'Verifying Handover QR Token...',
        message: 'Communicating with consortium ledger and activating live return countdown timer.',
      });

      claimHandoverWithQrAction(claimId, token).then((res) => {
        if (res.success) {
          setClaimBanner({
            type: 'success',
            title: '🎉 Handover QR Verified & Item Checked Out!',
            message:
              'Physical checkout completed successfully. Your live countdown timer has started. When returning, present your Return QR code to the Keeper.',
          });

          setBookings((prev) =>
            prev.map((b) => {
              if (b.id === claimId) {
                return {
                  ...b,
                  status: 'checked_out',
                  timer_activated: true,
                  deadline_at:
                    res.deadlineAt ||
                    new Date(Date.now() + 86400000 * (b.duration_days || 1)).toISOString(),
                };
              }
              return b;
            })
          );

          // Focus on active loans tab
          setFilter('checked_out');
          router.refresh();

          // Clean URL without page reload
          if (typeof window !== 'undefined' && window.history.replaceState) {
            window.history.replaceState({}, '', '/receiver/bookings');
          }
        } else {
          setClaimBanner({
            type: 'error',
            title: 'Handover Verification Issue',
            message: res.error || 'Failed to verify handover QR code token. Please try again.',
          });
        }
      });
    }
  }, [autoClaimBookingId, autoClaimToken, searchParams, router]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const handleClaimSuccess = (bookingId: string, deadlineAt?: string) => {
    setActiveQrModalBooking(null);
    setClaimBanner({
      type: 'success',
      title: '🎉 Handover QR Code Scanned Successfully!',
      message: 'Item has been marked checked out. Your live return deadline countdown timer is now running.',
    });
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'checked_out',
            timer_activated: true,
            deadline_at: deadlineAt || new Date(Date.now() + 86400000 * (b.duration_days || 1)).toISOString(),
          };
        }
        return b;
      })
    );
    setFilter('checked_out');
    router.refresh();
  };

  const handleOpenReturnModal = async (booking: Booking) => {
    if (booking.return_qr_code) {
      setActiveReturnModalBooking(booking);
      return;
    }

    setGeneratingReturnForId(booking.id);
    try {
      const res = await generateReturnQrAction(booking.id);
      if (res.success && res.qrToken) {
        const updated = { ...booking, return_qr_code: res.qrToken };
        setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
        setActiveReturnModalBooking(updated);
      } else {
        alert(res.error || 'Could not generate return QR token.');
      }
    } finally {
      setGeneratingReturnForId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    setCancellingId(bookingId);
    try {
      const res = await cancelBookingAction(bookingId, 'Cancelled by borrower');
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live QR Claim Result Banner */}
      {claimBanner && (
        <div
          className={`p-4 rounded-2xl border transition-all animate-in fade-in flex items-start justify-between gap-4 shadow-lg ${
            claimBanner.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-emerald-950/40'
              : claimBanner.type === 'loading'
              ? 'bg-cyan-950/70 border-cyan-500 text-cyan-100 shadow-cyan-950/40'
              : 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-rose-950/40'
          }`}
        >
          <div className="flex items-start gap-3">
            {claimBanner.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {claimBanner.type === 'loading' && (
              <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-spin" />
            )}
            {claimBanner.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-white tracking-tight">{claimBanner.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed">{claimBanner.message}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setClaimBanner(null)}
            className="text-xs font-semibold px-2 py-1 rounded bg-black/30 hover:bg-black/50 text-white transition shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
        {(['all', 'pending', 'approved', 'checked_out', 'completed'] as const).map((tab) => {
          const count = tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length;
          const label =
            tab === 'all'
              ? 'All Bookings'
              : tab === 'pending'
              ? 'Pending ID Verification'
              : tab === 'approved'
              ? 'Approved (Ready for QR Handover)'
              : tab === 'checked_out'
              ? 'Active Loans (Timer Running)'
              : 'Completed & Returned';

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filter === tab
                  ? 'bg-cyan-500 text-navy-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filter === tab
                    ? 'bg-navy-900/30 text-navy-950 font-bold'
                    : 'bg-neutral-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <Layers className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No bookings found in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            Explore equipment or use AI project recipes to start a reservation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const hasTimer = b.status === 'checked_out' && (b.deadline_at || b.due_at);
            const isApprovedReady = b.status === 'approved';
            const isCheckedOut = b.status === 'checked_out';

            return (
              <div
                key={b.id}
                className={`bg-neutral-900 border rounded-2xl p-5 shadow-lg space-y-4 transition-all ${
                  hasTimer
                    ? 'border-cyan-500/50 shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                    : isApprovedReady
                    ? 'border-teal-500/60 shadow-teal-950/40 ring-1 ring-teal-500/30'
                    : 'border-neutral-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Resource & Status Info */}
                  <div className="flex items-start gap-4">
                    {b.resource?.image_url && (
                      <img
                        src={b.resource.image_url}
                        alt={b.resource.name}
                        className="w-16 h-16 object-cover rounded-xl border border-neutral-800 shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">
                          {b.resource?.name || 'Electronics Resource'}
                        </h3>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider bg-neutral-800 text-slate-300">
                          Qty: {b.quantity}
                        </span>

                        {/* Status Badge */}
                        {b.status === 'pending' && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Lab Head Verification
                          </span>
                        )}
                        {b.status === 'approved' && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1 animate-pulse">
                            <ShieldCheck className="w-3 h-3" /> ID Verified — Ready for QR Scan Pickup
                          </span>
                        )}
                        {b.status === 'checked_out' && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Handed Over &amp; Live Timer Active
                          </span>
                        )}
                        {b.status === 'completed' && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-neutral-800 text-slate-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" /> Completed &amp; Return Verified
                          </span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-950/60 text-rose-400 border border-rose-800">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                        <span>
                          Institution:{' '}
                          <strong className="text-slate-200">{b.resource?.institution?.name}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Requested Duration:{' '}
                          <strong className="text-cyan-400 font-mono">
                            {b.duration_days ?? 0}d {b.duration_hours ?? 0}h {b.duration_minutes ?? 0}m
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: QR Claim, Return QR, or Cancel */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    {/* If Approved: Seeker can open webcam scanner modal to scan Keeper's screen */}
                    {isApprovedReady && (
                      <button
                        type="button"
                        onClick={() => setActiveQrModalBooking(b)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-1.5 transition animate-bounce"
                      >
                        <Camera className="w-4 h-4" /> Scan Lab Head Handover QR
                      </button>
                    )}

                    {/* If Checked Out: Seeker must present Return QR to Keeper */}
                    {isCheckedOut && (
                      <button
                        type="button"
                        disabled={generatingReturnForId === b.id}
                        onClick={() => handleOpenReturnModal(b)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition"
                      >
                        {generatingReturnForId === b.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <QrCode className="w-4 h-4" />
                        )}
                        <span>📲 Show Return QR Code to Keeper</span>
                      </button>
                    )}

                    {b.status === 'pending' && (
                      <button
                        type="button"
                        disabled={cancellingId === b.id}
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 text-xs font-semibold transition"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>

                {/* Return Requirement Notification for active loans */}
                {isCheckedOut && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 space-y-0.5">
                      <p className="font-semibold text-emerald-200">Return &amp; Completion Policy</p>
                      <p className="text-[11px] text-slate-300">
                        The booking will only be marked completed when this equipment gets scanned again with the{' '}
                        <strong className="text-emerald-300">Return QR code</strong> and manually verified by the
                        Keeper at the return bench.
                      </p>
                    </div>
                  </div>
                )}

                {/* Verification & Pickup Rule Notification Banner */}
                {b.status === 'pending' && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 space-y-0.5">
                      <p className="font-semibold text-white">Lab Head Inspection in Progress</p>
                      <p className="text-[11px] text-slate-400">
                        When approved,{' '}
                        <span className="text-cyan-300 font-medium">
                          equipment will ONLY be handed over to the student or teacher whose verified ID card
                          matches at pickup
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                )}

                {/* ID Card Picture Submitted & Verification Badge */}
                {b.id_card_image_url && (
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.id_card_image_url}
                        alt="Submitted Student/Teacher ID"
                        className="w-12 h-10 object-cover rounded-lg border border-neutral-700"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          Submitted Photo ID Card
                          {b.id_card_verified ? (
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Manually Verified by Lab Head
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.2 rounded border border-amber-800 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending Verification
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {b.id_card_verified
                            ? 'Approved by resource manager. Present this ID upon physical handover.'
                            : 'Submitted for Lab Head inspection.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Countdown Timer (Active after QR Scan Handover) */}
                {hasTimer && (
                  <div className="mt-2 pt-2">
                    <CountdownTimer
                      targetDate={b.deadline_at || b.due_at}
                      label="Live Loan Deadline Countdown"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Receiver QR Scanner Modal (For scanning Handover QR from Keeper screen) */}
      {activeQrModalBooking && (
        <ReceiverQrScannerModal
          bookingId={activeQrModalBooking.id}
          resourceName={activeQrModalBooking.resource?.name || 'Equipment'}
          expectedTokenHint={activeQrModalBooking.handover_qr_code}
          onSuccess={(deadlineAt) => handleClaimSuccess(activeQrModalBooking.id, deadlineAt)}
          onClose={() => setActiveQrModalBooking(null)}
        />
      )}

      {/* Seeker Return QR Modal (For presenting to Keeper at return bench) */}
      {activeReturnModalBooking && (
        <SeekerReturnQrModal
          bookingId={activeReturnModalBooking.id}
          returnToken={activeReturnModalBooking.return_qr_code || `IOT-RETURN:${activeReturnModalBooking.id}`}
          resourceName={activeReturnModalBooking.resource?.name || 'Equipment'}
          borrowerName={activeReturnModalBooking.borrower?.display_name || 'Borrower'}
          onClose={() => setActiveReturnModalBooking(null)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types/database';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { KeeperReturnScanModal } from '@/components/qr/KeeperReturnScanModal';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Package,
  Camera,
  Check,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface SenderLoansClientProps {
  initialLoans: Booking[];
  managerId: string;
  initialReturnBookingId?: string;
  initialReturnToken?: string;
}

export function SenderLoansClient({
  initialLoans,
  managerId,
  initialReturnBookingId,
  initialReturnToken,
}: SenderLoansClientProps) {
  const router = useRouter();
  const [loans, setLoans] = useState<Booking[]>(initialLoans);
  const [activeReturnModalBooking, setActiveReturnModalBooking] = useState<Booking | null>(null);
  const [prefilledReturnToken, setPrefilledReturnToken] = useState<string | undefined>(initialReturnToken);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // If page was loaded with a returnBookingId param, open modal immediately
  useEffect(() => {
    if (initialReturnBookingId) {
      const target = loans.find((l) => l.id === initialReturnBookingId);
      if (target) {
        setActiveReturnModalBooking(target);
        setPrefilledReturnToken(initialReturnToken || target.return_qr_code);
      }
    }
  }, [initialReturnBookingId, initialReturnToken, loans]);

  const handleReturnSuccess = (bookingId: string) => {
    setActiveReturnModalBooking(null);
    setLoans((prev) => prev.filter((l) => l.id !== bookingId));
    setSuccessBanner(
      '✅ Return QR Scanned & Manually Verified! The booking has been completed, timer stopped, and equipment safely returned to lab inventory.'
    );
    router.refresh();

    // Clean URL
    if (typeof window !== 'undefined' && window.history.replaceState) {
      window.history.replaceState({}, '', '/sender/loans');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-100 shadow-xl flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Equipment Return Finalized</h4>
              <p className="text-xs text-emerald-200 mt-0.5">{successBanner}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-xs font-semibold px-2 py-1 rounded bg-black/30 hover:bg-black/50 text-white transition shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {loans.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <Clock className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No active loans right now</h3>
          <p className="text-xs text-slate-500 mt-1">
            All verified equipment has either been safely returned or is awaiting handover scan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.map((b) => (
            <div
              key={b.id}
              className="bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4 hover:border-cyan-500/70 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {b.resource?.image_url && (
                    <img
                      src={b.resource.image_url}
                      alt={b.resource.name}
                      className="w-14 h-14 object-cover rounded-xl border border-neutral-700 shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base">{b.resource?.name}</h3>
                    <p className="text-xs text-slate-400">
                      Qty: {b.quantity} • Checked out {new Date(b.issued_at || b.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  QR Verified
                </span>
              </div>

              {/* Borrower Info & ID Badge */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-white">{b.borrower?.display_name}</span>
                    <span className="text-[11px] text-cyan-300 block">
                      {b.borrower?.post || 'Student'} ({b.borrower?.id_number || 'Verified'})
                    </span>
                  </div>
                </div>

                {b.id_card_image_url && (
                  <img
                    src={b.id_card_image_url}
                    alt="ID"
                    className="w-10 h-8 object-cover rounded border border-neutral-700"
                    title="Verified Photo ID Card"
                  />
                )}
              </div>

              {/* Live Countdown Timer */}
              <CountdownTimer
                targetDate={b.deadline_at || b.due_at}
                label="Borrower Return Countdown"
              />

              {/* Return Verification Requirement Notice */}
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Requires dual verification:{' '}
                  <strong className="text-slate-200">Return QR scan + bench manual inspection</strong>
                </span>
              </div>

              {/* Actions: Scan Return QR & Manual Verify */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Duration: {b.duration_days ?? 0}d {b.duration_hours ?? 0}h {b.duration_minutes ?? 0}m
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveReturnModalBooking(b);
                    setPrefilledReturnToken(b.return_qr_code);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Return QR &amp; Manual Verify</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Keeper Return Scan & Manual Verification Modal */}
      {activeReturnModalBooking && (
        <KeeperReturnScanModal
          bookingId={activeReturnModalBooking.id}
          resourceName={activeReturnModalBooking.resource?.name || 'Equipment'}
          borrowerName={activeReturnModalBooking.borrower?.display_name || 'Borrower'}
          expectedReturnToken={prefilledReturnToken || activeReturnModalBooking.return_qr_code}
          onSuccess={() => handleReturnSuccess(activeReturnModalBooking.id)}
          onClose={() => setActiveReturnModalBooking(null)}
        />
      )}
    </div>
  );
}

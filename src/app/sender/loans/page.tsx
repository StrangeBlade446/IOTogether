import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Package,
} from 'lucide-react';

export const revalidate = 0;

export default async function SenderLoansPage() {
  const session = await getSession();
  if (session.user.platform_role === 'student' && !session.isPlatformAdmin) {
    redirect('/receiver');
  }

  const isPlatformAdmin = session.isPlatformAdmin;
  const managedInstIds = session.managedInstitutions;

  const allBookings = db.getBookings();
  const activeLoans = allBookings.filter((b) => {
    if (b.status !== 'checked_out') return false;
    if (isPlatformAdmin) return true;
    return b.resource && managedInstIds.includes(b.resource.institution_id);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Keeper Active Loans
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-100 flex items-center gap-2">
            <Clock className="w-7 h-7 text-cyan-400" /> Live Loan Deadline Countdown Timers
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Monitor real-time return deadlines for all equipment checked out via QR code scan. Both you and the receiver share synchronized live timers.
          </p>
        </div>

        <Link
          href="/manage/returns"
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-semibold transition shrink-0 self-start md:self-center"
        >
          Process Equipment Returns
        </Link>
      </div>

      {activeLoans.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <Clock className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No active loans right now</h3>
          <p className="text-xs text-slate-500 mt-1">All verified equipment has either been safely returned or is awaiting handover scan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeLoans.map((b) => (
            <div
              key={b.id}
              className="bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-4"
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
                    <span className="text-[11px] text-cyan-300 block">{b.borrower?.post || 'Student'} ({b.borrower?.id_number || 'Verified'})</span>
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

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Duration: {b.duration_days ?? 0}d {b.duration_hours ?? 0}h {b.duration_minutes ?? 0}m
                </span>
                <Link
                  href="/manage/returns"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Record Return Inspection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

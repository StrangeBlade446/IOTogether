import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { SenderLoansClient } from './SenderLoansClient';
import { PortalProfileSwitcher } from '@/components/navigation/PortalProfileSwitcher';
import { Clock, RotateCcw } from 'lucide-react';

export const revalidate = 0;

interface SenderLoansPageProps {
  searchParams?: {
    returnBookingId?: string;
    returnToken?: string;
  };
}

export default async function SenderLoansPage({ searchParams }: SenderLoansPageProps) {
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
            Monitor real-time return deadlines for all equipment checked out via QR code scan. Both you and the receiver share synchronized live timers. Equipment must be scanned with the Return QR code and manually verified by you to complete the booking.
          </p>
        </div>

        <Link
          href="/manage/returns"
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-semibold transition shrink-0 self-start md:self-center flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Detailed Bench Returns</span>
        </Link>
      </div>

      <PortalProfileSwitcher portal="keeper" currentUserId={session.user.id} variant="pills" />

      <SenderLoansClient
        initialLoans={activeLoans}
        managerId={session.user.id}
        initialReturnBookingId={searchParams?.returnBookingId}
        initialReturnToken={searchParams?.returnToken}
      />
    </div>
  );
}

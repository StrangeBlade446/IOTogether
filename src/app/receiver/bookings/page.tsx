import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { ReceiverBookingsClient } from './ReceiverBookingsClient';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function ReceiverBookingsPage() {
  const session = await getSession();
  if (session.user.platform_role === 'staff' && !session.isPlatformAdmin) {
    redirect('/sender');
  }

  const bookings = db.getBookings({ borrowerId: session.user.id });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Seeker Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-100 flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" /> My Electronics Bookings & QR Handover
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl">
            Track your equipment booking requests. Once the Lab Head manually verifies your Student or Teacher ID picture, scan the QR code displayed on their screen to receive the gear and start your countdown timer.
          </p>
        </div>

        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-slate-300 max-w-sm">
          <div className="font-semibold text-cyan-400 flex items-center gap-1 mb-1">
            <ShieldCheck className="w-4 h-4" /> Identification Policy
          </div>
          <p className="text-[11px] text-slate-400">
            Only the student or teacher whose verified ID card matches will be issued the equipment at the laboratory pickup desk.
          </p>
        </div>
      </div>

      <ReceiverBookingsClient initialBookings={bookings} currentUserId={session.user.id} />
    </div>
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { SenderRequestsClient } from './SenderRequestsClient';
import { PortalProfileSwitcher } from '@/components/navigation/PortalProfileSwitcher';
import { ShieldCheck, QrCode, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function SenderRequestsPage() {
  const session = await getSession();
  if (session.user.platform_role === 'student' && !session.isPlatformAdmin) {
    redirect('/receiver');
  }

  const isPlatformAdmin = session.isPlatformAdmin;
  const managedInstIds = session.managedInstitutions;

  const allBookings = db.getBookings();
  const myBookings = isPlatformAdmin
    ? allBookings
    : allBookings.filter((b) => b.resource && managedInstIds.includes(b.resource.institution_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Keeper Verification Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100 flex items-center gap-2">
            <QrCode className="w-7 h-7 text-amber-400" /> ID Verification & Handover QR Generator
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Inspect the submitted Student or Teacher ID card photo, verify their identity, set/approve the loan duration (Days, Hours, Minutes), and click <strong>Manual Verified</strong>.
            A Handover QR code will appear on your screen for the receiver to scan upon physical collection.
          </p>
        </div>

        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-slate-300 max-w-sm">
          <div className="font-semibold text-amber-400 mb-1">
            Matching Policy Alert
          </div>
          <p className="text-[11px] text-slate-400">
            The receiver was notified that equipment will <strong>ONLY</strong> be handed over if their verified ID card matches physically at pickup.
          </p>
        </div>
      </div>

      <PortalProfileSwitcher portal="keeper" currentUserId={session.user.id} variant="pills" />

      <SenderRequestsClient initialBookings={myBookings} currentUserId={session.user.id} />
    </div>
  );
}

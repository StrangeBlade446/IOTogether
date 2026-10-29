import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { ReturnsClient } from './ReturnsClient';
import { ArrowLeft, RotateCcw, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function ManageReturnsPage() {
  const session = await getSession();

  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;
  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Manager Access Required</h2>
        <p className="text-sm text-slate-400 mt-2">Switch to a manager persona to inspect returns.</p>
      </div>
    );
  }

  const managedInstIds = session.isPlatformAdmin
    ? db.getInstitutions().map((i) => i.id)
    : session.managedInstitutions;

  const bookings = db.getBookings().filter((b) => b.resource && managedInstIds.includes(b.resource.institution_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/manage"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Management Overview
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <RotateCcw className="w-8 h-8 text-cyan-600" />
          Equipment Returns & Final Inspection
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Inspect returned hardware, record final condition grading, confirm undamaged return or escalate damage/loss incidents to resolution.
        </p>
      </div>

      <ReturnsClient bookings={bookings} managerId={session.user.id} />
    </div>
  );
}

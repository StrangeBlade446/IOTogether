import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { NewResourceForm } from './NewResourceForm';
import { ArrowLeft, PlusCircle, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function NewInventoryPage() {
  const session = await getSession();

  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;
  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">Manager Access Required</h1>
        <p className="text-sm text-slate-400 mt-2">Switch to a manager persona to create inventory.</p>
      </div>
    );
  }

  const institutions = db.getInstitutions().filter((i) =>
    session.isPlatformAdmin ? true : session.managedInstitutions.includes(i.id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/manage/inventory"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-cyan-600" />
          List New Equipment in Catalog
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Make underused development boards, sensors, and laboratory test instruments available for cross-institutional borrowing.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-sm">
        <NewResourceForm institutions={institutions} />
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { RegisterInstitutionForm } from './RegisterInstitutionForm';
import { ArrowLeft, Building2, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default function RegisterInstitutionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/institutions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Institutions Directory
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-cyan-600" />
          Register an Institution or Makerspace
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Apply to connect your school, university department, or community makerspace. Upon administrator verification, you can list equipment and accept student bookings.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-sm">
        <RegisterInstitutionForm />
      </div>
    </div>
  );
}

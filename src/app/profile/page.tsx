import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { User, Building, ShieldCheck, Award, ArrowRight, Layers } from 'lucide-react';

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await getSession();
  const memberships = db.getMemberships(session.user.id);
  const eligibility = db
    .getInstitutions()
    .flatMap((inst) => [db.getEligibility(session.user.id, inst.id)])
    .filter(Boolean);

  const bookings = db.getBookings({ borrowerId: session.user.id });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <User className="w-8 h-8 text-cyan-400" />
          User Profile & Institutional Memberships
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Identity credentials, laboratory safety certifications, and institution access policies for{' '}
          <strong className="text-white">{session.user.display_name}</strong>.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-bold text-xl">
              {session.user.display_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{session.user.display_name}</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {session.user.verification_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{session.user.email}</p>
              <span className="text-xs text-cyan-400 font-medium capitalize mt-1 block">
                Platform Role: {session.user.platform_role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 w-full sm:w-auto">
            <span>Total Bookings: <strong className="text-white">{bookings.length}</strong></span>
          </div>
        </div>

        {/* Institution Memberships */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Verified Institutional Memberships ({memberships.length})
            </h3>
            <Link href="/institutions" className="text-xs text-cyan-400 font-semibold hover:underline">
              Request New Membership
            </Link>
          </div>

          <div className="space-y-3">
            {memberships.map((m) => {
              const status = getStatusBadge(m.status);
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-navy-850 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white">{m.institution?.name}</h4>
                    <p className="text-slate-400 mt-0.5">
                      Role: <strong className="text-slate-300 capitalize">{m.role.replace('_', ' ')}</strong> • Joined: {formatDate(m.created_at)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Certifications */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-teal-400" />
            Verified Tool & Safety Certifications
          </h3>

          <div className="space-y-3">
            {eligibility.length === 0 ? (
              <p className="text-xs text-slate-400">No special certifications on file.</p>
            ) : (
              eligibility.map((e, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-850 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white capitalize">{e?.requirement_type.replace(/_/g, ' ')}</h4>
                    <p className="text-slate-400 mt-0.5">Valid until: {formatDate(e?.expires_at || '')}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    APPROVED & ACTIVE
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

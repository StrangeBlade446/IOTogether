'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Membership } from '@/types/database';
import { verifyMembershipAction } from '@/app/actions/inventory';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { CheckCircle2, XCircle, User, Building, ShieldCheck } from 'lucide-react';

interface MembersClientProps {
  memberships: Membership[];
  managerId: string;
}

export function MembersClient({ memberships, managerId }: MembersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleVerify = (id: string, status: 'verified' | 'rejected') => {
    startTransition(async () => {
      const res = await verifyMembershipAction(id, status);
      if (!res.success) {
        alert(res.error || 'Failed to update membership');
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {memberships.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No membership records found for this institution.
        </div>
      ) : (
        memberships.map((m) => {
          const status = getStatusBadge(m.status);

          return (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">Role: {m.role.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {m.institution?.name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  {m.user?.display_name} ({m.user?.email})
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Enrolled / Requested: {formatDate(m.created_at)}
                  {m.verified_at && ` • Verified on ${formatDate(m.verified_at)}`}
                </p>
              </div>

              {m.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(m.id, 'verified')}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify
                  </button>
                  <button
                    onClick={() => handleVerify(m.id, 'rejected')}
                    disabled={isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

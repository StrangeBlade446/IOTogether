'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Institution } from '@/types/database';
import { verifyInstitutionAction } from '@/app/actions/inventory';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { Building2, CheckCircle2, ShieldAlert, MapPin, ShieldCheck } from 'lucide-react';

interface AdminInstitutionsClientProps {
  institutions: Institution[];
  adminId: string;
}

export function AdminInstitutionsClient({ institutions, adminId }: AdminInstitutionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (instId: string, status: 'verified' | 'suspended') => {
    startTransition(async () => {
      const res = await verifyInstitutionAction(instId, status);
      if (!res.success) {
        alert(res.error || 'Failed to update institution');
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {institutions.map((i) => {
        const status = getStatusBadge(i.verification_status);
        const isVerified = i.verification_status === 'verified';

        return (
          <div
            key={i.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                  {status.label}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                  {i.institution_type}
                </span>
                <span className="text-xs text-slate-400">Policy: {i.sharing_policy.replace(/_/g, ' ')}</span>
              </div>

              <h3 className="text-lg font-bold text-white mt-1.5">{i.name}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{i.description}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {i.city} • {i.address}
                </span>
                {i.verified_at && <span>Verified on {formatDate(i.verified_at)}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
              {!isVerified ? (
                <button
                  onClick={() => handleUpdate(i.id, 'verified')}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify Institution
                </button>
              ) : (
                <button
                  onClick={() => handleUpdate(i.id, 'suspended')}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-xs font-semibold text-slate-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Suspend Access
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

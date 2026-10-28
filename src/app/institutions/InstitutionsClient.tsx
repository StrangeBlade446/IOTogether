'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Institution, Membership, Resource } from '@/types/database';
import { requestMembershipAction } from '@/app/actions/inventory';
import { getStatusBadge } from '@/lib/utils';
import {
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface InstitutionsClientProps {
  institutions: Institution[];
  memberships: Membership[];
  resources: Resource[];
  currentUserId: string;
}

export function InstitutionsClient({
  institutions,
  memberships,
  resources,
  currentUserId,
}: InstitutionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRequestMembership = (institutionId: string) => {
    startTransition(async () => {
      const res = await requestMembershipAction(institutionId, 'student');
      if (!res.success) {
        alert(res.error || 'Failed to request membership');
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {institutions.map((inst) => {
        const instResources = resources.filter((r) => r.institution_id === inst.id);
        const userMembership = memberships.find((m) => m.institution_id === inst.id);
        const status = getStatusBadge(inst.verification_status);

        return (
          <div
            key={inst.id}
            className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all p-6 shadow-sm justify-between gap-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                  {status.label}
                </span>
                <span className="text-[11px] font-semibold text-cyan-400 capitalize">
                  {inst.institution_type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{inst.name}</h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{inst.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{inst.city} • {inst.address}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Sharing Policy: <strong className="text-slate-200 capitalize">{inst.sharing_policy.replace(/_/g, ' ')}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Listed Hardware: <strong className="text-white">{instResources.length} items</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Membership Status */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              {userMembership ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-navy-850 border border-slate-800 text-xs">
                  <span className="text-slate-400">Your Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      userMembership.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {userMembership.status === 'verified' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {userMembership.status === 'verified' ? 'Verified Member' : 'Pending Verification'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleRequestMembership(inst.id)}
                  disabled={isPending}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Request Student Membership
                </button>
              )}

              <Link
                href={`/explore?institution=${inst.id}`}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                Browse Institution Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

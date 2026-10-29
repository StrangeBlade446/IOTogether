import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { formatCurrency, getStatusBadge } from '@/lib/utils';
import { ArrowLeft, PlusCircle, Building, ShieldAlert, Cpu } from 'lucide-react';

export const revalidate = 0;

export default async function ManageInventoryPage() {
  const session = await getSession();

  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;
  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">Manager Access Required</h1>
        <p className="text-sm text-slate-400 mt-2">Switch to a manager persona to edit inventory.</p>
      </div>
    );
  }

  const managedInstIds = session.isPlatformAdmin
    ? db.getInstitutions().map((i) => i.id)
    : session.managedInstitutions;

  const resources = db.getResources().filter((r) => managedInstIds.includes(r.institution_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        href="/manage"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Management Overview
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-600" />
            Laboratory Equipment Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            List and configure active boards, components, test equipment, and borrowing rules for your laboratory.
          </p>
        </div>

        <Link
          href="/manage/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Equipment
        </Link>
      </div>

      <div className="space-y-4">
        {resources.map((r) => {
          const status = getStatusBadge(r.condition);
          const isFree = r.daily_rate_paise === 0;

          return (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=200'}
                  alt={r.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {r.institution?.name}
                    </span>
                    {r.training_required && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        TRAINING CERTIFIED ONLY
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">{r.name}</h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{r.description}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>
                      Stock: <strong className="text-white">{r.total_quantity} total</strong> (
                      <span className="text-emerald-400 font-semibold">{r.available_quantity} available</span>)
                    </span>
                    <span>
                      Rate: <strong className="text-white">{formatCurrency(r.daily_rate_paise)}</strong> {isFree ? '' : '/ day'}
                    </span>
                    <span>
                      Deposit: <strong className="text-slate-300">{r.deposit_paise > 0 ? formatCurrency(r.deposit_paise, false) : 'None'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/resources/${r.id}`}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold transition-colors shrink-0"
              >
                View Public Listing
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

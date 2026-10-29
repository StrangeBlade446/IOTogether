import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import {
  Package,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function SenderInventoryPage() {
  const session = await getSession();
  if (session.user.platform_role === 'student' && !session.isPlatformAdmin) {
    redirect('/receiver');
  }

  const isPlatformAdmin = session.isPlatformAdmin;
  const managedInstIds = session.managedInstitutions;

  const allResources = db.getResources();
  const myResources = isPlatformAdmin
    ? allResources
    : allResources.filter((r) => managedInstIds.includes(r.institution_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 border border-amber-500/30 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
            <Package className="w-3.5 h-3.5 text-amber-400" /> Keeper Inventory Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100">Listed Products with Photos</h1>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl">
            List and maintain electronics equipment available for borrowing. High-resolution photos, condition, specifications, and loan duration policies.
          </p>
        </div>

        <Link
          href="/sender/inventory/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" /> Add Product with Photos
        </Link>
      </div>

      {/* Grid of Equipment with Photos */}
      {myResources.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800 space-y-3">
          <Package className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No products cataloged yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Get started by adding your first laboratory microcontroller, sensor kit, or test equipment with photos.
          </p>
          <Link
            href="/sender/inventory/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs"
          >
            <PlusCircle className="w-4 h-4" /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myResources.map((res) => (
            <div
              key={res.id}
              className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Photo */}
                <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                  {res.image_url ? (
                    <img
                      src={res.image_url}
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {res.category}
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    {res.available_quantity} / {res.total_quantity} Available
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {res.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-neutral-800">
                    <div className="bg-neutral-950 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[10px] uppercase">Daily Rate</span>
                      <span className="font-bold text-white">
                        {res.daily_rate_paise > 0 ? formatCurrency(res.daily_rate_paise, false) : 'Free (₹0)'}
                      </span>
                    </div>
                    <div className="bg-neutral-950 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[10px] uppercase">Deposit</span>
                      <span className="font-bold text-amber-300">
                        {res.deposit_paise > 0 ? formatCurrency(res.deposit_paise, false) : 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Loan Duration Limits:</span>
                    <span className="text-slate-200 font-mono font-medium">
                      {res.min_loan_duration} - {res.max_loan_duration} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-mono">
                  {res.institution?.name}
                </span>
                <Link
                  href={`/resources/${res.id}`}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  View Public Page <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

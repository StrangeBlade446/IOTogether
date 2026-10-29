import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import { getSession } from '@/lib/auth/session';
import { formatCurrency, getStatusBadge } from '@/lib/utils';
import { BookingForm } from './BookingForm';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Cpu,
  Info,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const resource = db.getResource(params.id);
  if (!resource) {
    notFound();
  }

  const session = await getSession();
  const serializedUnits = db.getResourceUnits(resource.id);
  const eligibility = db.getEligibility(session.user.id, resource.institution_id);
  const memberships = db.getMemberships(session.user.id, resource.institution_id);
  const isMember = memberships.some((m) => m.status === 'verified');

  const cond = getStatusBadge(resource.condition);
  const isFree = resource.daily_rate_paise === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back Link */}
      <Link
        href={session.user.platform_role === 'staff' ? '/sender/inventory' : '/receiver/explore'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equipment Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image, Specs, Institution Info */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
            <div className="relative h-72 sm:h-96 w-full bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resource.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800'}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-md border ${cond.bg} ${cond.text} ${cond.border}`}>
                  {cond.label}
                </span>
                {resource.training_required && (
                  <span className="text-xs font-bold px-3 py-1 rounded-md border bg-amber-950 text-amber-400 border-amber-800">
                    TRAINING REQUIRED
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                {resource.category.replace('_', ' ')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-100 mt-1">{resource.name}</h1>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">{resource.description}</p>

              {/* Hardware Specifications */}
              {resource.specifications && Object.keys(resource.specifications).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(resource.specifications).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded bg-navy-850 border border-slate-800">
                        <span className="text-slate-400 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-semibold text-slate-200">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Serialized Units Overview (if any) */}
              {serializedUnits.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Tracked Laboratory Units ({serializedUnits.length})
                  </h3>
                  <div className="space-y-2">
                    {serializedUnits.map((u) => {
                      const uStatus = getStatusBadge(u.unit_status);
                      return (
                        <div key={u.id} className="flex items-center justify-between p-2.5 rounded-lg bg-navy-850 border border-slate-800 text-xs">
                          <div>
                            <span className="font-bold text-white font-mono">{u.asset_tag}</span>
                            {u.serial_number && <span className="text-slate-400 ml-2">SN: {u.serial_number}</span>}
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${uStatus.bg} ${uStatus.text} ${uStatus.border}`}>
                            {uStatus.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Owning Institution & Collection Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Owning Institution & Collection Location
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{resource.institution?.name}</p>
                  <p className="text-slate-400 mt-0.5">{resource.institution?.address}</p>
                  <p className="text-cyan-400 mt-0.5 font-medium">Pickup Spot: {resource.location_description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Sharing & Access Policy</p>
                  <p className="text-slate-400 mt-0.5 capitalize">
                    {resource.institution?.sharing_policy.replace(/_/g, ' ')} • {resource.eligibility_policy.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Interactive Booking Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 flex flex-col gap-6">
            {/* Pricing Snapshot Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-navy-850 border border-slate-800 p-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Pricing Terms</span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {formatCurrency(resource.daily_rate_paise)}
                    {!isFree && <span className="text-sm font-normal text-slate-400"> / day</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Refundable Deposit</span>
                  <div className="text-lg font-bold text-slate-200 mt-0.5">
                    {resource.deposit_paise > 0 ? formatCurrency(resource.deposit_paise, false) : '₹0'}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Available Units:</span>
                  <span className="font-bold text-emerald-400">
                    {resource.available_quantity} / {resource.total_quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Permitted Duration:</span>
                  <span className="font-medium text-slate-200">
                    {resource.min_loan_duration} to {resource.max_loan_duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Owner Approval:</span>
                  <span className="font-medium text-slate-200">
                    {resource.approval_required ? 'Required by Lab Lead' : 'Instant Reservation'}
                  </span>
                </div>
              </div>

              {/* Training / Eligibility Status Banner */}
              {resource.training_required && (
                <div className="mt-5 p-3 rounded-xl bg-amber-950/50 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Prerequisite Certification Required</span>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">
                      {eligibility
                        ? 'Your prerequisite training has been verified for this institution.'
                        : 'You need lab safety or oscilloscope training approval before borrowing.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Booking Form */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md">
              <h3 className="text-base font-bold text-white mb-4">Request This Equipment</h3>

              <BookingForm
                resource={resource}
                currentUserId={session.user.id}
                currentUserName={session.user.display_name}
                hasTrainingCertificate={Boolean(eligibility) || !resource.training_required}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Booking, ResourceUnit, ConditionReport } from '@/types/database';
import { checkoutEquipmentAction } from '@/app/actions/booking';
import { formatCurrency, formatDate, getStatusBadge } from '@/lib/utils';
import {
  CheckCircle2,
  Calendar,
  Building,
  User,
  Camera,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface LoansClientProps {
  bookings: Booking[];
  units: ResourceUnit[];
  managerId: string;
}

export function LoansClient({ bookings, units, managerId }: LoansClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'approved' | 'checked_out'>('approved');
  const [checkoutBooking, setCheckoutBooking] = useState<Booking | null>(null);

  // Modal Form State
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [condition, setCondition] = useState<ConditionReport['condition']>('excellent');
  const [notes, setNotes] = useState('Tested all ports and pins. Clean physical condition. Original accessories provided.');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isPending, startTransition] = useTransition();

  const approvedBookings = bookings.filter((b) => b.status === 'approved');
  const checkedOutBookings = bookings.filter((b) => b.status === 'checked_out');

  const openCheckoutModal = (b: Booking) => {
    setCheckoutBooking(b);
    const availableUnitsForResource = units.filter(
      (u) => u.resource_id === b.resource_id && u.unit_status === 'available'
    );
    setSelectedUnitId(availableUnitsForResource[0]?.id || '');
    setCondition((b.resource?.condition as any) || 'excellent');
    setEvidenceUrl(b.resource?.image_url || '');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutBooking) return;

    startTransition(async () => {
      const res = await checkoutEquipmentAction({
        bookingId: checkoutBooking.id,
        unitId: selectedUnitId || undefined,
        condition,
        notes,
        evidencePaths: evidenceUrl ? [evidenceUrl] : [],
      });

      if (!res.success) {
        alert(res.error || 'Failed to complete checkout');
      } else {
        setCheckoutBooking(null);
        router.refresh();
      }
    });
  };

  const currentList = activeTab === 'approved' ? approvedBookings : checkedOutBookings;

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'approved' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Ready to Check Out ({approvedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('checked_out')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'checked_out' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Currently Issued ({checkedOutBookings.length})
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No bookings found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((b) => {
            const status = getStatusBadge(b.status);
            const resourceUnits = units.filter((u) => u.resource_id === b.resource_id);

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.resource?.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=200'}
                    alt={b.resource?.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Borrower: {b.borrower?.display_name}
                      </span>
                      {b.unit && (
                        <span className="text-[10px] bg-navy-850 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-800">
                          TAG: {b.unit.asset_tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {b.quantity}x {b.resource?.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        Due: {formatDate(b.due_at)}
                      </span>
                      <span>
                        Snapshot: <strong className="text-white">{formatCurrency(b.estimated_total_paise)}</strong>
                      </span>
                      <span>
                        Payment: <strong className="text-slate-300 capitalize">{b.payment_status}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {b.status === 'approved' && (
                  <button
                    onClick={() => openCheckoutModal(b)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Complete Check-Out
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Check-Out Inspection Modal */}
      {checkoutBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              Initial Condition & Check-Out Handover
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Issuing <strong>{checkoutBooking.quantity}x {checkoutBooking.resource?.name}</strong> to{' '}
              <strong className="text-cyan-400">{checkoutBooking.borrower?.display_name}</strong>.
            </p>

            <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4">
              {/* If serialized units exist */}
              {units.filter((u) => u.resource_id === checkoutBooking.resource_id).length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Laboratory Asset Tag</label>
                  <select
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">No specific unit tag (batch inventory)</option>
                    {units
                      .filter((u) => u.resource_id === checkoutBooking.resource_id && u.unit_status === 'available')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.asset_tag} {u.serial_number ? `(SN: ${u.serial_number})` : ''} — {u.condition}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Condition Grade */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Verified Initial Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="brand_new">Brand New (Unopened/Pristine)</option>
                  <option value="excellent">Excellent (Fully functional, no cosmetic wear)</option>
                  <option value="good">Good (Normal minor lab wear, tested)</option>
                  <option value="fair">Fair (Cosmetic wear, fully operational)</option>
                </select>
              </div>

              {/* Inspection Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Condition Inspection Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  rows={3}
                  required
                />
              </div>

              {/* Photo Evidence URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  Initial Condition Photo Reference
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... or storage photo reference"
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCheckoutBooking(null)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  {isPending ? 'Signing Handover...' : 'Confirm Handover & Issue Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

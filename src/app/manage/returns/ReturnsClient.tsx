'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Booking, ConditionReport, Incident } from '@/types/database';
import { returnEquipmentAction } from '@/app/actions/booking';
import { formatCurrency, formatDate, getStatusBadge } from '@/lib/utils';
import { KeeperReturnScanModal } from '@/components/qr/KeeperReturnScanModal';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Building,
  User,
  AlertTriangle,
  Camera,
  FileCheck2,
} from 'lucide-react';

interface ReturnsClientProps {
  bookings: Booking[];
  managerId: string;
}

export function ReturnsClient({ bookings, managerId }: ReturnsClientProps) {
  const router = useRouter();
  const [returnBooking, setReturnBooking] = useState<Booking | null>(null);
  const [qrReturnBooking, setQrReturnBooking] = useState<Booking | null>(null);

  // Return Form State
  const [condition, setCondition] = useState<ConditionReport['condition']>('good');
  const [notes, setNotes] = useState('Hardware inspected at bench. Tested functional, pins intact, returned with all original accessories.');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isIncident, setIsIncident] = useState(false);
  const [incidentType, setIncidentType] = useState<Incident['incident_type']>('damage');
  const [incidentDescription, setIncidentDescription] = useState('Component returned with visible physical damage.');
  const [isPending, startTransition] = useTransition();

  const checkedOutBookings = bookings.filter((b) => b.status === 'checked_out');
  const completedReturns = bookings.filter((b) => ['completed', 'incident_review'].includes(b.status));

  const openReturnModal = (b: Booking) => {
    setReturnBooking(b);
    setCondition('good');
    setIsIncident(false);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBooking) return;

    startTransition(async () => {
      const res = await returnEquipmentAction({
        bookingId: returnBooking.id,
        condition,
        notes,
        evidencePaths: evidenceUrl ? [evidenceUrl] : [],
        isIncident,
        incidentType: isIncident ? incidentType : undefined,
        incidentDescription: isIncident ? incidentDescription : undefined,
      });

      if (!res.success) {
        alert(res.error || 'Failed to process return');
      } else {
        setReturnBooking(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Checked Out Ready for Return */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-cyan-400" />
          Awaiting Return & Bench Inspection ({checkedOutBookings.length})
        </h2>

        {checkedOutBookings.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            No equipment currently on loan needing return inspection.
          </div>
        ) : (
          <div className="space-y-4">
            {checkedOutBookings.map((b) => {
              const status = getStatusBadge(b.status);
              const isOverdue = new Date(b.due_at) < new Date();

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
                        {isOverdue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            OVERDUE
                          </span>
                        )}
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
                          Deposit: <strong className="text-slate-200">{b.deposit_snapshot_paise > 0 ? formatCurrency(b.deposit_snapshot_paise, false) : 'None'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setQrReturnBooking(b)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                      Scan Return QR &amp; Verify
                    </button>

                    <button
                      onClick={() => openReturnModal(b)}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <FileCheck2 className="w-4 h-4 text-cyan-400" />
                      Bench Manual Form
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed / Historical Returns */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <h2 className="text-base font-bold text-white mb-4">Completed / Under Review History ({completedReturns.length})</h2>
        <div className="space-y-3">
          {completedReturns.map((b) => {
            const status = getStatusBadge(b.status);
            return (
              <div key={b.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mr-2 ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                  </span>
                  <span className="font-bold text-white">{b.quantity}x {b.resource?.name}</span>
                  <span className="text-slate-400 ml-2">by {b.borrower?.display_name}</span>
                </div>
                <span className="text-slate-400">Returned: {formatDate(b.returned_at || b.updated_at)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Return Inspection Modal */}
      {returnBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-cyan-400" />
              Final Condition & Return Sign-off
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Processing return of <strong>{returnBooking.quantity}x {returnBooking.resource?.name}</strong> from{' '}
              <strong className="text-cyan-400">{returnBooking.borrower?.display_name}</strong>.
            </p>

            <form onSubmit={handleReturnSubmit} className="mt-4 space-y-4">
              {/* Condition Grade */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Inspected Return Condition</label>
                <select
                  value={condition}
                  onChange={(e) => {
                    const c = e.target.value as any;
                    setCondition(c);
                    if (['damaged', 'parts_missing'].includes(c)) {
                      setIsIncident(true);
                    }
                  }}
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="brand_new">Brand New (Unopened/Pristine)</option>
                  <option value="excellent">Excellent (No defects, fully operational)</option>
                  <option value="good">Good (Normal minor wear, tested operational)</option>
                  <option value="fair">Fair (Noticeable cosmetic wear, functional)</option>
                  <option value="damaged">Damaged (Requires maintenance or parts replacement)</option>
                  <option value="parts_missing">Parts Missing (Accessories or components absent)</option>
                </select>
              </div>

              {/* Inspection Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Return Inspection Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  rows={2}
                  required
                />
              </div>

              {/* Optional Photo Reference */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  Return Photo Evidence Reference
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://... photo URL"
                  className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Incident Escalation Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="incidentToggle"
                    checked={isIncident}
                    onChange={(e) => setIsIncident(e.target.checked)}
                    className="rounded border-slate-700 bg-navy-850 text-rose-500"
                  />
                  <label htmlFor="incidentToggle" className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Open an Incident Investigation (Damage / Delay / Disputed Condition)
                  </label>
                </div>

                {isIncident && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-rose-300 mb-1">Incident Type</label>
                      <select
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value as any)}
                        className="w-full bg-navy-850 border border-rose-800/80 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="damage">Physical Hardware Damage</option>
                        <option value="missing">Missing Cables / Accessories / Sensors</option>
                        <option value="late">Severe Unnotified Late Return</option>
                        <option value="misuse">Improper Voltage / Short Circuit Misuse</option>
                        <option value="dispute">Condition State Dispute</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-rose-300 mb-1">Investigation Notes & Estimated Repair/Deposit Review</label>
                      <textarea
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}
                        className="w-full bg-navy-850 border border-rose-800/80 rounded-lg p-2 text-xs text-white focus:outline-none"
                        rows={2}
                        required={isIncident}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReturnBooking(null)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  {isPending ? 'Saving Report...' : isIncident ? 'Record Return & Open Incident' : 'Complete Return Sign-off'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrReturnBooking && (
        <KeeperReturnScanModal
          bookingId={qrReturnBooking.id}
          resourceName={qrReturnBooking.resource?.name || 'Equipment'}
          borrowerName={qrReturnBooking.borrower?.display_name || 'Borrower'}
          expectedReturnToken={qrReturnBooking.return_qr_code}
          onSuccess={() => {
            setQrReturnBooking(null);
            router.refresh();
          }}
          onClose={() => setQrReturnBooking(null)}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Incident } from '@/types/database';
import { resolveIncidentAction } from '@/app/actions/booking';
import { formatDate, formatDateTime, getStatusBadge } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';

interface IncidentsClientProps {
  incidents: Incident[];
  managerId: string;
}

export function IncidentsClient({ incidents, managerId }: IncidentsClientProps) {
  const router = useRouter();
  const [resolveIncidentId, setResolveIncidentId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Laboratory review complete. Issue addressed and hardware maintenance logged.');
  const [isPending, startTransition] = useTransition();

  const handleResolve = () => {
    if (!resolveIncidentId) return;

    startTransition(async () => {
      const res = await resolveIncidentAction(resolveIncidentId, resolutionNotes);
      if (!res.success) {
        alert(res.error || 'Failed to resolve incident');
      } else {
        setResolveIncidentId(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {incidents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No hardware incidents or disputes logged.
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => {
            const isResolved = inc.status === 'resolved';

            return (
              <div
                key={inc.id}
                className={`p-6 rounded-2xl border transition-all shadow-sm ${
                  isResolved
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-rose-950/20 border-rose-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase tracking-wide">
                      {inc.incident_type} Incident
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isResolved
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {inc.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">Reported: {formatDateTime(inc.created_at)}</span>
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => setResolveIncidentId(inc.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve & Close Investigation
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-200 mt-2 font-medium">{inc.description}</p>

                {inc.evidence_paths.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {inc.evidence_paths.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={url}
                        alt="Incident Evidence"
                        className="w-20 h-20 rounded-lg object-cover border border-slate-700 bg-slate-950"
                      />
                    ))}
                  </div>
                )}

                {inc.resolution_notes && (
                  <div className="mt-4 p-3 rounded-xl bg-navy-850 border border-slate-800 text-xs">
                    <span className="font-bold text-emerald-400 block mb-1">Investigation Outcome & Resolution:</span>
                    <p className="text-slate-300">{inc.resolution_notes}</p>
                    {inc.resolved_at && (
                      <span className="text-[10px] text-slate-400 mt-1 block">Resolved on {formatDateTime(inc.resolved_at)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolution Modal */}
      {resolveIncidentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Document Incident Resolution
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Record the agreed findings, repair deductions, or component replacements. This resolution will be committed to the append-only audit trail and will mark the transaction completed.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">Resolution Findings</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                rows={4}
                required
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setResolveIncidentId(null)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolve}
                disabled={isPending || !resolutionNotes.trim()}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-colors"
              >
                {isPending ? 'Committing...' : 'Commit Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

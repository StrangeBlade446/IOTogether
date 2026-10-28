'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types/database';
import { approveBookingAction, rejectBookingAction } from '@/app/actions/booking';
import { formatCurrency, formatDate, getStatusBadge } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building,
  User,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface RequestsClientProps {
  bookings: Booking[];
  managerId: string;
}

export function RequestsClient({ bookings, managerId }: RequestsClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Laboratory scheduled maintenance during requested period.');
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const handleApprove = (bookingId: string, borrowerId: string) => {
    if (borrowerId === managerId) {
      alert('Security Policy: Self-approval is strictly forbidden. Another authorized staff member must review your request.');
      return;
    }

    startTransition(async () => {
      const res = await approveBookingAction(bookingId);
      if (!res.success) {
        alert(res.error || 'Failed to approve booking');
      } else {
        router.refresh();
      }
    });
  };

  const handleReject = () => {
    if (!rejectBookingId) return;
    startTransition(async () => {
      const res = await rejectBookingAction(rejectBookingId, rejectReason);
      if (!res.success) {
        alert(res.error || 'Failed to reject booking');
      } else {
        setRejectBookingId(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'pending' ? 'bg-amber-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending Review ({bookings.filter((b) => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'approved' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Approved ({bookings.filter((b) => b.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'rejected' ? 'bg-rose-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Rejected ({bookings.filter((b) => b.status === 'rejected').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Requests ({bookings.length})
        </button>
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No booking requests found in this filter state.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const status = getStatusBadge(b.status);
            const isSelf = b.borrower_id === managerId;

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
                        {b.borrower?.display_name} ({b.borrower?.email})
                      </span>
                      {isSelf && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                          Your Request (Self-approval blocked)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {b.quantity}x {b.resource?.name}
                    </h3>

                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      <strong>Purpose:</strong> {b.purpose}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDate(b.start_at)} — {formatDate(b.due_at)}
                      </span>
                      <span>
                        Estimated Total: <strong className="text-white">{formatCurrency(b.estimated_total_paise)}</strong>
                      </span>
                    </div>

                    {b.rejection_reason && (
                      <p className="mt-2 text-xs text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/60">
                        <strong>Reason declined:</strong> {b.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons if status === 'pending' */}
                {b.status === 'pending' && (
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <button
                      onClick={() => handleApprove(b.id, b.borrower_id)}
                      disabled={isPending || isSelf}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </button>

                    <button
                      onClick={() => setRejectBookingId(b.id)}
                      disabled={isPending}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Decline Booking Request
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Record the reason for declining this request. This will be stored in the permanent audit trail and communicated to the student.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                rows={3}
                required
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectBookingId(null)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isPending || !rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors"
              >
                {isPending ? 'Recording...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking, WaitlistEntry } from '@/types/database';
import { cancelBookingAction } from '@/app/actions/booking';
import { formatCurrency, formatDate, getStatusBadge } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  QrCode,
  FileText,
  Sparkles,
} from 'lucide-react';

interface MyBookingsClientProps {
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  currentUserId: string;
}

export function MyBookingsClient({ bookings, waitlist, currentUserId }: MyBookingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'completed' | 'waitlist'>('all');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of project timeline');
  const [isPending, startTransition] = useTransition();

  const activeCount = bookings.filter((b) => b.status === 'checked_out').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'approved').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['approved', 'checked_out'].includes(b.status);
    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'completed') return ['completed', 'cancelled', 'rejected', 'incident_review'].includes(b.status);
    return false;
  });

  const handleCancel = () => {
    if (!cancelModalBooking) return;
    startTransition(async () => {
      await cancelBookingAction(cancelModalBooking.id, cancelReason);
      setCancelModalBooking(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Active Loans</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">{activeCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Currently in possession</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Ready for Pickup</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Approved by Lab Lead</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Pending Review</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Awaiting manager approval</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Waitlist Queue</span>
          <p className="text-2xl font-black text-teal-400 mt-1">{waitlist.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">High demand equipment</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'active' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Active & Pickups ({activeCount + approvedCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'pending' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'completed' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          History & Returns ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab('waitlist')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'waitlist' ? 'bg-cyan-500 text-navy-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Waitlist Entries ({waitlist.length})
        </button>
      </div>

      {/* Waitlist View */}
      {activeTab === 'waitlist' ? (
        <div className="space-y-4">
          {waitlist.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
              You do not have any active waitlist requests.
            </div>
          ) : (
            waitlist.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      QUEUE POSITION #{w.queue_position}
                    </span>
                    <span className="text-xs text-slate-400">Requested: {formatDate(w.created_at)}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{w.resource?.name || 'Equipment'}</h3>
                  <p className="text-xs text-slate-400 mt-1">Priority Context: {w.priority_reason || 'Academic Mini-project'}</p>
                </div>
                <Link
                  href={`/resources/${w.resource_id}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  View Listing
                </Link>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-sm text-slate-400">No bookings found in this category.</p>
              <Link
                href="/explore"
                className="mt-4 inline-block px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-lg transition-colors"
              >
                Discover Resources to Borrow
              </Link>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const status = getStatusBadge(b.status);
              const canCancel = ['pending', 'approved'].includes(b.status);

              return (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
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
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          {b.resource?.institution?.name}
                        </span>
                        {b.unit && (
                          <span className="text-[10px] bg-navy-850 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-900">
                            TAG: {b.unit.asset_tag}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">
                        {b.quantity}x {b.resource?.name}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">Purpose: {b.purpose}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {formatDate(b.start_at)} — {formatDate(b.due_at)}
                        </span>
                        <span>
                          Locked Price: <strong className="text-white">{formatCurrency(b.estimated_total_paise)}</strong>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Payment: <span className="capitalize text-slate-300 font-medium">{b.payment_status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                    <Link
                      href={`/my-bookings/${b.id}`}
                      className="px-3.5 py-2 rounded-lg bg-navy-850 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Timeline
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Cancel Booking Request
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to cancel your request for{' '}
              <strong className="text-white">{cancelModalBooking.resource?.name}</strong>? Stock will be immediately released
              to other eligible students or waitlisted peers.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">Reason for cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                rows={2}
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors"
              >
                {isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

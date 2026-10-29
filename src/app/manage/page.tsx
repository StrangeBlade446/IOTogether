import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { formatCurrency, formatDate, getStatusBadge } from '@/lib/utils';
import {
  Settings,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  Users,
  ShieldAlert,
  Building,
} from 'lucide-react';

export const revalidate = 0;

export default async function ManagePortalPage() {
  const session = await getSession();

  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;

  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Institution Manager Privileges Required</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          You are currently viewing as <strong className="text-white">{session.user.display_name}</strong> (Student).
          To access the Lab Management Portal, use the <strong>Role Switcher</strong> at the top right to switch to{' '}
          <strong>Prof. Ananya Roy (NIT Manager)</strong> or <strong>Marcus Chen (GEC Manager)</strong>.
        </p>
      </div>
    );
  }

  // Get resources and bookings for institutions this user manages
  const managedInstIds = session.isPlatformAdmin
    ? db.getInstitutions().map((i) => i.id)
    : session.managedInstitutions;

  const allResources = db.getResources().filter((r) => managedInstIds.includes(r.institution_id));
  const allBookings = db.getBookings().filter((b) => b.resource && managedInstIds.includes(b.resource.institution_id));
  const allIncidents = db.getIncidents().filter((inc) => {
    const booking = db.getBooking(inc.booking_id);
    return booking?.resource && managedInstIds.includes(booking.resource.institution_id);
  });

  const pendingRequests = allBookings.filter((b) => b.status === 'pending');
  const activeLoans = allBookings.filter((b) => b.status === 'checked_out');
  const approvedReady = allBookings.filter((b) => b.status === 'approved');
  const openIncidents = allIncidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 text-xs font-semibold mb-2 border border-amber-800/60">
            <Settings className="w-3.5 h-3.5" />
            Institution Equipment Manager
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Laboratory Management Portal</h1>
          <p className="text-xs text-slate-600 mt-1">
            Logged in as <strong className="text-slate-900">{session.user.display_name}</strong>. Managing equipment approvals, checkout inspections, and inventory records.
          </p>
        </div>

        <Link
          href="/manage/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Inventory
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/manage/requests"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-2">{pendingRequests.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting review</span>
        </Link>

        <Link
          href="/manage/loans"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Ready for Issue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">{approvedReady.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Checkout handover needed</span>
        </Link>

        <Link
          href="/manage/returns"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Currently on Loan</span>
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-cyan-400 mt-2">{activeLoans.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Due for return</span>
        </Link>

        <Link
          href="/manage/incidents"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-2">{openIncidents.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Damage / disputes</span>
        </Link>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link
          href="/manage/requests"
          className="p-3 rounded-xl bg-navy-850 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
        >
          <span>1. Booking Requests</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/manage/loans"
          className="p-3 rounded-xl bg-navy-850 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
        >
          <span>2. Issue & Check Out</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/manage/returns"
          className="p-3 rounded-xl bg-navy-850 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
        >
          <span>3. Inspect & Return</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          href="/manage/inventory"
          className="p-3 rounded-xl bg-navy-850 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors"
        >
          <span>4. Equipment Inventory</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Action Required: Pending Requests Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Requests Needing Review ({pendingRequests.length})
          </h2>
          <Link href="/manage/requests" className="text-xs text-cyan-400 font-semibold hover:underline">
            View All Requests
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No pending requests right now.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-navy-850 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{b.quantity}x {b.resource?.name}</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {b.borrower?.display_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Dates: {formatDate(b.start_at)} — {formatDate(b.due_at)} • Purpose: {b.purpose}
                  </p>
                </div>

                <Link
                  href="/manage/requests"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors shrink-0"
                >
                  Review Request
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

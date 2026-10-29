import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldAlert,
  Building2,
  Cpu,
  Layers,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session.isPlatformAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Platform Administrator Access Required</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          You are currently signed in as <strong className="text-white">{session.user.display_name}</strong>.
          To access Platform Administration, use the <strong>Role Switcher</strong> at the top right to switch to{' '}
          <strong>Dr. Vikram Seth (Platform Admin)</strong>.
        </p>
      </div>
    );
  }

  const institutions = db.getInstitutions();
  const resources = db.getResources();
  const bookings = db.getBookings();
  const incidents = db.getIncidents();
  const auditLogs = db.getAuditLogs();

  const verifiedInsts = institutions.filter((i) => i.verification_status === 'verified');
  const pendingInsts = institutions.filter((i) => i.verification_status === 'pending');
  const openIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 text-xs font-semibold mb-2 border border-rose-800/60">
          <ShieldAlert className="w-3.5 h-3.5" />
          Network Platform Administrator
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Platform Administration Console</h1>
        <p className="text-xs text-slate-600 mt-1">
          Logged in as <strong className="text-slate-900">{session.user.display_name}</strong>. Oversight of institutional credentials, disputes, and immutable audit logs.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/admin/institutions"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Verified Institutions</span>
            <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-black text-cyan-400 mt-2">{verifiedInsts.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active university partners</span>
        </Link>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Listed Inventory</span>
            <Cpu className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2">{resources.length}</p>
          <span className="text-[11px] text-teal-400 mt-1 block">Cross-institution items</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Transactions</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2">{bookings.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Bookings processed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Open Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-2">{openIncidents.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Damage or disputes</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/institutions"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-start justify-between group shadow-sm"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              Manage Institution Verifications
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Verify new university, college, and makerspace partner applications. Only verified institutions may publish active listings.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </Link>

        <Link
          href="/admin/audit"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all flex items-start justify-between group shadow-sm"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Append-Only Platform Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Inspect immutable ledger entries across all bookings, approvals, checkouts, returns, and administrative policy changes.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </Link>
      </div>

      {/* Recent Platform Activity */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Platform Operations
          </h2>
          <Link href="/admin/audit" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All ({auditLogs.length})
          </Link>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl bg-navy-850 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white capitalize mr-2">{log.action.replace('_', ' ')}</span>
                <span className="text-cyan-400">{log.entity_type}</span>
                <span className="text-slate-400 ml-2">by {log.actor?.display_name || 'System'}</span>
              </div>
              <span className="text-[11px] text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

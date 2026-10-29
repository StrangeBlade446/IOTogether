import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import { KeeperDesk3D } from '@/components/keeper/KeeperDesk3D';
import {
  ShieldCheck,
  PlusCircle,
  Layers,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
  QrCode,
  Building,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

export default async function SenderPortalPage() {
  const session = await getSession();
  const profile = db.getProfile(session.user.id);
  const managedInstIds = session.managedInstitutions;
  const isPlatformAdmin = session.isPlatformAdmin;

  // Senders inventory & bookings
  const allResources = db.getResources();
  const myResources = isPlatformAdmin
    ? allResources
    : allResources.filter((r) => managedInstIds.includes(r.institution_id));

  const allBookings = db.getBookings();
  const myInstitutionBookings = isPlatformAdmin
    ? allBookings
    : allBookings.filter((b) => b.resource && managedInstIds.includes(b.resource.institution_id));

  const pendingRequests = myInstitutionBookings.filter((b) => b.status === 'pending');
  const activeLoans = myInstitutionBookings.filter((b) => b.status === 'checked_out');
  const readyHandoverQrs = myInstitutionBookings.filter((b) => b.status === 'approved');
  const unreadNotifs = db.getNotifications(session.user.id).filter((n) => !n.read_at).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 3D First-Person Perspective (FPP) Desk View */}
      <section aria-label="3D First-Person Perspective Custodian Desk">
        <KeeperDesk3D
          pendingRequestsCount={pendingRequests.length}
          activeLoansCount={activeLoans.length}
          inventoryCount={myResources.length}
          unreadNotifsCount={unreadNotifs}
          profileName={profile?.display_name || session.user.display_name}
          instituteName={profile?.institute_name || 'Northstar Institute of Technology'}
          roleDesignation={profile?.post || 'Head of Electronics Lab'}
        />
      </section>

      {/* Sender Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-navy-950 border border-amber-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Keeper Platform — Lab Heads &amp; Custodians
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
              Lab Head Portal:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-300">
                {profile?.display_name || session.user.display_name}
              </span>
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Manage your institution&apos;s electronics inventory, inspect student/teacher photo ID cards, click <strong>Manual Verified</strong> to display Handover QR codes, and monitor live loan deadline countdown timers.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Designation: <strong className="text-white">{profile?.post || 'Head of Electronics Lab'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Staff ID: <strong className="text-white">{profile?.id_number || 'FAC-NIT-104'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <Building className="w-4 h-4 text-amber-400" />
                <span>Institute: <strong className="text-white">{profile?.institute_name || 'Northstar Institute of Technology'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sender/inventory/new"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> List Product with Photos
            </Link>
            <Link
              href="/sender/requests"
              className="px-5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-cyan-400" /> Verify Requests & Show QR
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/sender/requests"
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition shadow-lg group flex items-center justify-between"
        >
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400 group-hover:scale-105 transition-transform">
              {pendingRequests.length}
            </div>
            <div className="text-xs font-semibold text-white mt-1">Pending ID Verifications</div>
            <div className="text-[11px] text-slate-400">Student & Teacher ID cards awaiting review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/sender/loans"
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 transition shadow-lg group flex items-center justify-between"
        >
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-400 group-hover:scale-105 transition-transform">
              {activeLoans.length}
            </div>
            <div className="text-xs font-semibold text-white mt-1">Active Outgoing Loans</div>
            <div className="text-[11px] text-slate-400">Live countdown timers currently running</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/sender/inventory"
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 transition shadow-lg group flex items-center justify-between"
        >
          <div>
            <div className="text-2xl font-bold font-mono text-teal-400 group-hover:scale-105 transition-transform">
              {myResources.length}
            </div>
            <div className="text-xs font-semibold text-white mt-1">Listed Products with Photos</div>
            <div className="text-[11px] text-slate-400">Cataloged laboratory resources</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Active Loan Timers Overview for Lab Head */}
      {activeLoans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Active Borrower Loan Timers
            </h2>
            <Link href="/sender/loans" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View all active timers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((b) => (
              <div key={b.id} className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{b.resource?.name}</h3>
                    <p className="text-xs text-slate-400">
                      Borrower: <strong className="text-slate-200">{b.borrower?.display_name}</strong> ({b.borrower?.post || 'Student'})
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Checked Out
                  </span>
                </div>
                <CountdownTimer targetDate={b.deadline_at || b.due_at} label="Return Due Timer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Sender Platform Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Review Requests */}
        <Link
          href="/sender/requests"
          className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 p-6 transition-all hover:shadow-xl hover:shadow-amber-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                ID Verification & Handover QR
              </h3>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-navy-950 animate-pulse">
                  {pendingRequests.length} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Inspect submitted Student and Teacher photo ID cards, approve duration in days/hours/minutes, click &quot;Manual Verified&quot;, and display the Handover QR code on your screen.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform gap-1">
            Review Booking Requests <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 2: List Products with Photos */}
        <Link
          href="/sender/inventory"
          className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 p-6 transition-all hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Manage Inventory & List Products
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Publish new electronic resources with high-res photos, set stock counts, daily rental rates, deposits, and loan duration policies.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform gap-1">
            Manage Catalog ({myResources.length}) <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 3: Active Loans & Countdown */}
        <Link
          href="/sender/loans"
          className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 p-6 transition-all hover:shadow-xl hover:shadow-teal-950/30 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              Live Loan Deadline Timers
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time countdown tracking of all equipment currently in student/teacher hands. Process returns and inspection reports.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform gap-1">
            Track Active Loans <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Sender Auth Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Need to sign in as a different Lab Head or Equipment Assigner?</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sender/login"
            className="px-3 py-1.5 rounded-lg bg-[#263447] hover:bg-[#32455e] text-[#F1E7D0] font-medium transition"
          >
            Keeper Sign In
          </Link>
          <Link
            href="/sender/signup"
            className="px-3 py-1.5 rounded-lg bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-semibold transition"
          >
            Keeper Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

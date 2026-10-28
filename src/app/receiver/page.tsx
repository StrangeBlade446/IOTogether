import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { CountdownTimer } from '@/components/timer/CountdownTimer';
import {
  Compass,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogIn,
  UserCheck,
  BookOpen,
} from 'lucide-react';

export default async function ReceiverPortalPage() {
  const session = await getSession();
  const profile = db.getProfile(session.user.id);
  const myBookings = db.getBookings({ borrowerId: session.user.id });
  const activeLoansWithTimers = myBookings.filter((b) => b.status === 'checked_out' && (b.deadline_at || b.due_at));
  const pendingApprovals = myBookings.filter((b) => b.status === 'pending');
  const readyForPickup = myBookings.filter((b) => b.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Platform Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-navy-950 border border-cyan-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Receiver Platform — Students & Teachers
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">{profile?.display_name || session.user.display_name}</span>
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Discover and borrow microcontrollers, sensors, robotics kits, and test benches from accredited institutions.
              Submit your Student or Teacher ID picture, get verified by the Lab Head, and scan the Handover QR upon physical collection.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Post: <strong className="text-white">{profile?.post || 'Student / Project Lead'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>ID: <strong className="text-white">{profile?.id_number || 'STU-NIT-2024-819'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Institute: <strong className="text-white">{profile?.institute_name || 'Northstar Institute of Technology'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/receiver/explore"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" /> Search Equipment
            </Link>
            <Link
              href="/receiver/project-recipe"
              className="px-5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-teal-500/40 text-teal-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-teal-400" /> AI Project Recipes
            </Link>
          </div>
        </div>
      </div>

      {/* Active Loan Timers Section (if any equipment is checked out) */}
      {activeLoansWithTimers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400 animate-pulse" /> Active Equipment Loan Timers
            </h2>
            <Link href="/receiver/bookings" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoansWithTimers.map((b) => (
              <div key={b.id} className="bg-neutral-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{b.resource?.name || 'Equipment'}</h3>
                    <p className="text-xs text-slate-400">{b.resource?.institution?.name} • Qty: {b.quantity}</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Checked Out & Timer Active
                  </span>
                </div>
                <CountdownTimer targetDate={b.deadline_at || b.due_at} label="Return Due Countdown" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Platform Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Equipment Search */}
        <Link
          href="/receiver/explore"
          className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 p-6 transition-all hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              Search & Filter Equipment
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Browse microcontrollers, development boards, sensors, and scopes across colleges with real-time availability filters.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform gap-1">
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 2: AI Project Recipe */}
        <Link
          href="/receiver/project-recipe"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-teal-950/30 border border-teal-500/30 hover:border-teal-400 p-6 transition-all hover:shadow-xl hover:shadow-teal-950/40 flex flex-col justify-between"
        >
          <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold text-teal-300 bg-teal-900/60 rounded-full border border-teal-700">
            AI Powered
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              AI-Powered Project Recipe
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Describe your project idea and let AI generate the bill-of-materials, verify cross-institution component availability, and reserve in 1 click.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform gap-1">
            Build with AI Recipe <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 3: Bookings & QR Claim */}
        <Link
          href="/receiver/bookings"
          className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 p-6 transition-all hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                My Bookings & QR Scan
              </h3>
              {readyForPickup.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-navy-950 animate-bounce">
                  {readyForPickup.length} Ready
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Track ID verification status, scan the Lab Head&apos;s Handover QR code at physical pickup, and manage active loan deadlines.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform gap-1">
            View Bookings ({myBookings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Receiver Auth Quick Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Need to sign in with a different student or teacher profile?</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/receiver/login"
            className="px-3 py-1.5 rounded-lg bg-[#263447] hover:bg-[#32455e] text-[#F1E7D0] font-medium transition"
          >
            Seeker Sign In
          </Link>
          <Link
            href="/receiver/signup"
            className="px-3 py-1.5 rounded-lg bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-semibold transition"
          >
            Seeker Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

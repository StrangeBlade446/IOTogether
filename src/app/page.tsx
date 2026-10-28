import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { formatCurrency, getStatusBadge } from '@/lib/utils';
import {
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  CalendarCheck,
  FileCheck2,
  Clock,
  Compass,
} from 'lucide-react';

export const revalidate = 0;

export default function HomePage() {
  const institutions = db.getInstitutions();
  const resources = db.getResources();

  const totalInstitutions = institutions.length;
  const totalResources = resources.length;
  const freeResources = resources.filter((r) => r.daily_rate_paise === 0).length;
  const paidResources = resources.filter((r) => r.daily_rate_paise > 0).length;

  const featured = resources.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800 bg-gradient-to-b from-navy-900 via-navy-850 to-navy-900">
        {/* Subtle Circuit Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#164e63_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Institution Electronics Resource-Sharing Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Share Resources.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Build Possibilities.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting schools, colleges, laboratories, and makerspaces with underused electronics equipment to verified student innovators and engineering teams who need affordable, accountable access.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-navy-950" />
              Explore Equipment Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/project-matcher"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              Try Project Matcher
            </Link>

            <Link
              href="/institutions"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-850 hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              View Institutions
            </Link>
          </div>

          {/* Real Database Metrics Summary */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Partner Institutions</span>
              <p className="text-2xl font-bold text-white mt-1">{totalInstitutions}</p>
              <span className="text-[11px] text-cyan-400 mt-0.5 block">Universities & Makerspaces</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Listed Inventory</span>
              <p className="text-2xl font-bold text-white mt-1">{totalResources} Types</p>
              <span className="text-[11px] text-teal-400 mt-0.5 block">Boards, Sensors & Kits</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Free Access Items</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{freeResources}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Zero rental fee</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Specialized Lab Kits</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{paidResources}</p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">With refundable deposit</span>
            </div>
          </div>
        </div>
      </section>

      {/* TWO DEDICATED PLATFORMS SECTION (Sender Portal vs Receiver Portal) */}
      <section className="py-16 md:py-20 border-b border-slate-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Two Dedicated Platforms
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Purpose-Built Portals for Senders and Receivers
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              Whether you are an academic laboratory head sharing equipment or an engineering student building an IoT project, IOTogether provides dedicated workflows, ID verification, QR handovers, and live deadline countdown timers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PLATFORM 1: EQUIPMENT SENDER PORTAL */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-900 border border-amber-500/40 p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Platform 1: Equipment Senders
                  </span>
                  <span className="text-xs text-slate-400">Lab Heads & Assigners</span>
                </div>

                <h3 className="text-2xl font-bold text-white">Lab Head & Inventory Sender Portal</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  List products with high-resolution photos, review borrower Student/Teacher ID cards, approve durations in days, hours, and minutes, click <strong>Manual Verified</strong>, and display the Handover QR code on your screen.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>List Products with Photos:</strong> High-res imagery, technical specs, and stock</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Photo ID Verification:</strong> Inspect Student & Teacher ID cards before approval</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>&quot;Manual Verified&quot; Action:</strong> Triggers pickup notification & generates QR code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Screen Handover QR:</strong> Display on desk for receiver scan & timer start</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Live Deadline Timers:</strong> Synchronized countdown for all equipment out on loan</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/sender"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-navy-950 font-bold text-xs shadow-lg shadow-amber-500/20 text-center transition flex items-center justify-center gap-1.5"
                >
                  Enter Sender Platform <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/sender/login"
                    className="flex-1 sm:flex-none py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 font-semibold text-xs transition text-center"
                  >
                    Sender Sign In
                  </Link>
                  <Link
                    href="/sender/signup"
                    className="flex-1 sm:flex-none py-3 px-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 border border-neutral-700 text-amber-300 font-semibold text-xs transition text-center"
                  >
                    Register Lab
                  </Link>
                </div>
              </div>
            </div>

            {/* PLATFORM 2: RECEIVER PORTAL */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-cyan-950/20 to-neutral-900 border border-cyan-500/40 p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Platform 2: Equipment Receivers
                  </span>
                  <span className="text-xs text-slate-400">Students & Teachers</span>
                </div>

                <h3 className="text-2xl font-bold text-white">Student & Teacher Receiver Portal</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Discover electronics with robust search & filters, utilize the <strong>AI-Powered Project Recipe Option</strong>, upload your photo ID, scan the Lab Head&apos;s Handover QR at collection, and track your active countdown timer.
                </p>

                <ul className="mt-5 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Search & Filter Option:</strong> Multi-category discovery across colleges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>AI-Powered Project Recipe:</strong> Automated Bill of Materials & stock lookup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Student/Teacher ID Upload:</strong> Required photo attachment for verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>QR Scan Handover Claim:</strong> Scan Lab Head screen to activate checkout</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Live Deadline Countdown:</strong> Days, hours, minutes, seconds countdown</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/receiver"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 text-center transition flex items-center justify-center gap-1.5"
                >
                  Enter Receiver Platform <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href="/receiver/login"
                    className="flex-1 sm:flex-none py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 font-semibold text-xs transition text-center"
                  >
                    Receiver Sign In
                  </Link>
                  <Link
                    href="/receiver/signup"
                    className="flex-1 sm:flex-none py-3 px-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 border border-neutral-700 text-cyan-300 font-semibold text-xs transition text-center"
                  >
                    Register ID
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Problem & The IOTogether Model */}
      <section className="py-16 md:py-20 border-b border-slate-800/80 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Institutional Resource Stewardship</h2>
            <p className="text-3xl font-extrabold text-white mt-2">
              Why Underused Lab Hardware Stays Idle — And How We Solve It
            </p>
            <p className="text-slate-400 mt-3 text-base">
              Educational laboratories purchase high-value sensors, oscilloscopes, and microcontrollers that sit in locked cabinets for months, while student project teams face prohibitive costs to purchase single-use components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Verified Institutional Membership</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Borrowers are authenticated students verified by faculty or lab leads. Institutions configure open, verified-only, or internal borrowing policies to protect valuable assets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Atomic Inventory & Conflict Guard</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Two students can never double-book the same component for overlapping dates. Stock demand is evaluated atomically across active intervals with FIFO waitlist queueing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-800/60 text-teal-400 flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Two-Way Condition Accountability</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Every checkout and return records an immutable inspection report with photos, notes, and staff attestation. Fair incident escalation protects both borrower and institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Paid Borrowing Policy */}
      <section className="py-16 border-b border-slate-800/80 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-navy-850 border border-slate-800 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Clear Pricing Model</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  Transparent Borrowing: Free & Paid Policies
                </h3>
                <p className="text-slate-300 mt-3 text-sm leading-relaxed">
                  IOTogether empowers resource owners to define fair access models according to institutional requirements:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">Free Educational Borrowing</p>
                      <p className="text-xs text-slate-400">
                        Common teaching items (Arduino, ESP32, basic sensors) with zero rental fee, fostering barrier-free student innovation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">Paid Specialized Kits & Refundable Deposits</p>
                      <p className="text-xs text-slate-400">
                        High-tier equipment (Oscilloscopes, single-board computers, robotics kits) with modest daily maintenance rates and refundable security deposits.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">Price Snapshots at Booking</p>
                      <p className="text-xs text-slate-400">
                        All rates are calculated in integer paise and locked into a immutable booking snapshot. Subsequent price revisions never alter existing approved bookings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-6 border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Sample Equipment Rates</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div>
                      <p className="text-sm font-semibold text-white">Arduino Uno Rev3</p>
                      <p className="text-xs text-slate-400">Northstar Institute of Tech</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Free (₹0)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div>
                      <p className="text-sm font-semibold text-white">Raspberry Pi 4 (4GB)</p>
                      <p className="text-xs text-slate-400">Northstar Institute of Tech</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">₹50.00 / day</p>
                      <p className="text-[10px] text-slate-400">₹2,000 refundable deposit</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div>
                      <p className="text-sm font-semibold text-white">Rigol 4-Ch Oscilloscope</p>
                      <p className="text-xs text-slate-400">Training certification required</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">₹100.00 / day</p>
                      <p className="text-[10px] text-slate-400">₹5,000 refundable deposit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment Catalog */}
      <section className="py-16 md:py-20 border-b border-slate-800 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Active Inventory</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Available for Booking</h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Browse all {totalResources} items
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => {
              const status = getStatusBadge(item.condition);
              const isFree = item.daily_rate_paise === 0;

              return (
                <Link
                  key={item.id}
                  href={`/resources/${item.id}`}
                  className="group flex flex-col rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all overflow-hidden shadow-sm hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                        {status.label}
                      </span>
                      {item.training_required && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-950 text-amber-400 border-amber-800">
                          TRAINING REQ.
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded shadow ${isFree ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-cyan-300 border border-cyan-800'}`}>
                        {formatCurrency(item.daily_rate_paise)} {isFree ? '' : '/ day'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{item.category.replace('_', ' ')}</span>
                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 flex-1">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px] text-cyan-400/80 font-medium">{item.institution?.name}</span>
                      <span className="font-semibold text-slate-300">
                        {item.available_quantity} / {item.total_quantity} left
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Callout */}
      <section className="py-16 bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready to test the Hackathon workflow?</h2>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            Use the Persona Switcher at the top right to switch between Student (Aarav), Lab Manager (Prof. Ananya), and Admin (Dr. Vikram) to test the end-to-end request, approval, checkout, and return lifecycle.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
            >
              Start Resource Discovery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

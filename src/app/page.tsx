import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { formatCurrency } from '@/lib/utils';
import {
  Compass,
  Shield,
  ShieldCheck,
  Scroll,
  Wrench,
  Hammer,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  QrCode,
  FileCheck2,
  Lock,
  Zap,
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
    <div className="flex flex-col w-full bg-[#141821] text-[#F1E7D0] selection:bg-[#C49A55]/30 selection:text-[#F1E7D0]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: GUILD OF KEEPERS & SEEKERS */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-[#263447] blueprint-grid">
        {/* Radial ambient warmth from the forge & blueprint glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#C49A55]/10 via-[#67C7D4]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Guild Seal Emblem */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-mono text-[#C49A55]">
              Consortium of Electronics Keepers &amp; Seekers
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
          </div>

          {/* Grand Serif Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F1E7D0] max-w-5xl mx-auto leading-[1.12]">
            Share Resources.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C49A55] via-[#e5bc7b] to-[#67C7D4]">
              Build Possibilities.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#F1E7D0]/80 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            Connecting schools, colleges, laboratories, and makerspaces that possess underused electronics equipment with verified students, teachers, and project builders who seek affordable, accountable access.
          </p>

          {/* ======================================================================= */}
          {/* THE TWO CORE BUTTONS: JOIN AS A KEEPER & JOIN AS A SEEKER */}
          {/* ======================================================================= */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 max-w-xl mx-auto">
            {/* BUTTON 1: JOIN AS A KEEPER */}
            <Link
              href="/sender"
              className="group relative flex-1 p-5 rounded-2xl bg-gradient-to-b from-[#C49A55] to-[#a87f3b] text-[#141821] font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-forge text-left flex flex-col justify-between border border-[#e5bc7b]/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#141821]/15 flex items-center justify-center text-[#141821]">
                  <Shield className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#141821]/15 text-[#141821]">
                  Those who possess
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold block leading-tight text-[#141821]">
                  Join as a Keeper
                </span>
                <p className="text-xs text-[#141821]/80 mt-1 font-sans font-medium">
                  For Lab Heads, Colleges &amp; Equipment Custodians
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#141821]/15 flex items-center justify-between text-xs font-semibold text-[#141821]">
                <span>Manage &amp; Lend Hardware</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* BUTTON 2: JOIN AS A SEEKER */}
            <Link
              href="/receiver"
              className="group relative flex-1 p-5 rounded-2xl bg-[#263447] text-[#F1E7D0] font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blueprint text-left flex flex-col justify-between border border-[#67C7D4]/40 hover:border-[#67C7D4]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#67C7D4]/15 border border-[#67C7D4]/30 flex items-center justify-center text-[#67C7D4]">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30">
                  Those who seek
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold block leading-tight text-[#F1E7D0]">
                  Join as a Seeker
                </span>
                <p className="text-xs text-[#F1E7D0]/70 mt-1 font-sans font-normal">
                  For Students, Teachers &amp; Project Innovators
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F1E7D0]/10 flex items-center justify-between text-xs font-semibold text-[#67C7D4]">
                <span>Discover &amp; Borrow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Quick Platform Entry Links */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#F1E7D0]/60">
            <span>Already registered?</span>
            <Link href="/sender/login" className="hover:text-[#C49A55] transition-colors underline underline-offset-4">
              Keeper Sign In
            </Link>
            <span className="text-[#263447]">•</span>
            <Link href="/receiver/login" className="hover:text-[#67C7D4] transition-colors underline underline-offset-4">
              Seeker Sign In
            </Link>
          </div>

          {/* Real Live Guild Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-[#263447]/70 engraved-card text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E7D0]/60 font-mono">Keepers Guild</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#F1E7D0] mt-1">{totalInstitutions}</p>
              <span className="text-[11px] text-[#C49A55] mt-0.5 block font-medium">Accredited Member Labs</span>
            </div>

            <div className="p-4 rounded-xl bg-[#263447]/70 engraved-card text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E7D0]/60 font-mono">Cataloged Electronics</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#F1E7D0] mt-1">{totalResources} Types</p>
              <span className="text-[11px] text-[#67C7D4] mt-0.5 block font-medium">Boards, Sensors &amp; Test Benches</span>
            </div>

            <div className="p-4 rounded-xl bg-[#263447]/70 engraved-card text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E7D0]/60 font-mono">Open Access Resources</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#67C7D4] mt-1">{freeResources}</p>
              <span className="text-[11px] text-[#F1E7D0]/70 mt-0.5 block">Zero rental fee for students</span>
            </div>

            <div className="p-4 rounded-xl bg-[#263447]/70 engraved-card text-left">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E7D0]/60 font-mono">Specialized Instruments</span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#C49A55] mt-1">{paidResources}</p>
              <span className="text-[11px] text-[#F1E7D0]/70 mt-0.5 block">With refundable deposit protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE TWO ROLES: DETAILED BLUEPRINT WALKTHROUGH */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#263447] bg-[#141821]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#263447] text-[#C49A55] border border-[#C49A55]/30 mb-3">
              <Hammer className="w-3.5 h-3.5" /> Guild Architectures
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F1E7D0] tracking-tight">
              Two Paths in Harmony
            </h2>
            <p className="text-sm sm:text-base text-[#F1E7D0]/70 mt-3 font-sans leading-relaxed">
              Resource owners retain sovereign control over their property, while students receive fair, transparent, and accountable access to hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* COLUMN 1: THE KEEPER'S DOMAIN */}
            <div className="p-8 rounded-3xl bg-[#263447]/60 engraved-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#C49A55]/15 border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
                      <Shield className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-mono tracking-wider text-[#C49A55] font-bold">
                        The Keepers
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                        Custodians of Equipment
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#F1E7D0]/50">For Institutions &amp; Labs</span>
                </div>

                <p className="text-xs sm:text-sm text-[#F1E7D0]/80 mt-4 leading-relaxed font-sans">
                  Schools, colleges, laboratories, and makerspaces with underused electronics boards, precision sensors, motors, and oscilloscopes.
                </p>

                {/* Keeper Workflow Steps */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#C49A55]/20 text-[#C49A55] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">List Equipment with Photos</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Publish microcontrollers, sensors, and scopes with photos, specifications, and availability rules.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#C49A55]/20 text-[#C49A55] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">Inspect Student &amp; Teacher ID Pictures</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Carefully review the submitted institutional photo ID and approve borrowing duration in days, hours, and minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#C49A55]/20 text-[#C49A55] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#C49A55]">Click &quot;Manual Verified&quot; &amp; Display QR</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Confirmation generates a unique Handover QR code on the Lab Head&apos;s screen. The borrower is notified of physical ID pickup rules.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#C49A55]/20 text-[#C49A55] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">Live Return Deadline Countdown</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        When the receiver scans the QR, synchronized return timers run on both screens until safe inspection check-in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1E7D0]/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sender/signup"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-bold text-xs text-center transition shadow-md shadow-[#C49A55]/20 flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Register as a Keeper
                </Link>
                <Link
                  href="/sender/login"
                  className="py-3 px-4 rounded-xl bg-[#141821] hover:bg-[#1e2533] border border-[#C49A55]/40 text-[#C49A55] font-semibold text-xs text-center transition"
                >
                  Keeper Portal
                </Link>
              </div>
            </div>

            {/* COLUMN 2: THE SEEKER'S DOMAIN */}
            <div className="p-8 rounded-3xl bg-[#263447]/60 engraved-card-accent flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#67C7D4]/15 border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-mono tracking-wider text-[#67C7D4] font-bold">
                        The Seekers
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                        Builders of Possibilities
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#F1E7D0]/50">For Students &amp; Faculty</span>
                </div>

                <p className="text-xs sm:text-sm text-[#F1E7D0]/80 mt-4 leading-relaxed font-sans">
                  Verified students, project teams, and faculty mentors who need temporary access to electronics for capstones, prototypes, and laboratory coursework.
                </p>

                {/* Seeker Workflow Steps */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#67C7D4]/20 text-[#67C7D4] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">Search &amp; AI-Powered Project Recipes</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Search multi-institutional inventory or prompt the AI Recipe assistant to compile Bill of Materials and verify live stock.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#67C7D4]/20 text-[#67C7D4] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">Submit Photo ID Card &amp; Custom Duration</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Attach your Student or Teacher ID photo and specify the exact loan period in Days, Hours, and Minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#67C7D4]/20 text-[#67C7D4] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#67C7D4]">Scan Keeper Screen QR at Physical Pickup</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Arrive at the lab, present your matching ID card, and scan the Lab Head&apos;s Handover QR code to claim the equipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141821]/70 border border-[#263447]">
                    <div className="w-7 h-7 rounded-lg bg-[#67C7D4]/20 text-[#67C7D4] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F1E7D0]">Live Countdown &amp; Safe Inspection Return</h4>
                      <p className="text-[11px] text-[#F1E7D0]/60 mt-0.5">
                        Watch your live countdown timer on your mobile or laptop, experiment safely, and return components before deadline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1E7D0]/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/receiver/signup"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-xs text-center transition shadow-md shadow-[#67C7D4]/20 flex items-center justify-center gap-2"
                >
                  <Scroll className="w-4 h-4" /> Register as a Seeker
                </Link>
                <Link
                  href="/receiver/explore"
                  className="py-3 px-4 rounded-xl bg-[#141821] hover:bg-[#1e2533] border border-[#67C7D4]/40 text-[#67C7D4] font-semibold text-xs text-center transition"
                >
                  Seeker Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CURATED EQUIPMENT BLUEPRINT SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#263447] bg-[#141821]/95 blueprint-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#263447] text-[#C49A55] border border-[#C49A55]/30 mb-2">
                <Cpu className="w-3.5 h-3.5" /> Hardware In Stock
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F1E7D0]">
                Curated Electronics &amp; Test Benches
              </h2>
              <p className="text-xs sm:text-sm text-[#F1E7D0]/70 mt-1 max-w-xl">
                Ready for reservation across participating institutions with real-time atomic inventory checks.
              </p>
            </div>

            <Link
              href="/receiver/explore"
              className="text-xs font-bold text-[#67C7D4] hover:underline flex items-center gap-1.5 shrink-0"
            >
              Explore all {totalResources} items <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#263447] border border-[#C49A55]/25 hover:border-[#C49A55]/60 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-44 w-full bg-[#141821] overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F1E7D0]/30">
                        <Cpu className="w-12 h-12" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-[#141821]/80 backdrop-blur-md text-[#C49A55] border border-[#C49A55]/30">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#141821]/80 backdrop-blur-md text-[#67C7D4] border border-[#67C7D4]/30">
                      {item.available_quantity} Avail
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-sm text-[#F1E7D0] line-clamp-1 group-hover:text-[#C49A55] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#F1E7D0]/60 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-[#F1E7D0]/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F1E7D0]">
                        {item.daily_rate_paise > 0 ? formatCurrency(item.daily_rate_paise, false) : 'Free (₹0)'}
                        <span className="text-[10px] font-normal text-[#F1E7D0]/50"> /day</span>
                      </span>
                      <span className="text-[10px] text-[#C49A55] font-mono">
                        {item.deposit_paise > 0 ? `₹${item.deposit_paise / 100} dep` : 'No dep'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#141821]/50 border-t border-[#F1E7D0]/10 flex items-center justify-between text-[11px]">
                  <span className="text-[#F1E7D0]/50 truncate max-w-[130px] font-sans">
                    {item.institution?.name}
                  </span>
                  <Link
                    href={`/resources/${item.id}`}
                    className="font-bold text-[#67C7D4] hover:text-[#88dce7] flex items-center gap-1"
                  >
                    Request <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AI PROJECT RECIPE FEATURE HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#263447] bg-[#141821]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#263447] via-[#1a2330] to-[#141821] border border-[#67C7D4]/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#67C7D4]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30">
                  <Sparkles className="w-3.5 h-3.5" /> Seeker&apos;s AI Atelier
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F1E7D0] leading-tight">
                  Don&apos;t Know Exactly What Components You Need?
                </h3>
                <p className="text-sm text-[#F1E7D0]/80 leading-relaxed font-sans font-light">
                  Simply describe what you want to construct—whether an automated greenhouse, a drone telemetry relay, or an ECG biometric monitor.
                  Our AI Recipe Engine maps your concept to verified hardware across partner institutions, generates wiring diagrams, and reserves everything in one click.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/receiver/project-recipe"
                    className="px-6 py-3 rounded-xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-xs shadow-md shadow-[#67C7D4]/20 transition flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4" /> Try AI Project Recipes
                  </Link>
                  <Link
                    href="/receiver/explore"
                    className="px-6 py-3 rounded-xl bg-[#141821] hover:bg-[#263447] border border-[#C49A55]/40 text-[#C49A55] font-semibold text-xs transition"
                  >
                    Browse Full Catalog
                  </Link>
                </div>
              </div>

              {/* Blueprint Schematic Snippet Preview */}
              <div className="p-5 rounded-2xl bg-[#141821] border border-[#67C7D4]/30 blueprint-grid-fine space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#263447]">
                  <span className="text-[#67C7D4] font-bold text-[11px] flex items-center gap-1.5">
                    <Scroll className="w-3.5 h-3.5" /> AI RECIPE: SMART AGRICULTURE NODE
                  </span>
                  <span className="text-[10px] text-[#C49A55]">STATUS: 4/4 IN STOCK</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                    <span className="text-[#F1E7D0]">1x ESP32 NodeMCU Wi-Fi/BLE</span>
                    <span className="text-[#67C7D4]">GPIO 4, 34, 26</span>
                  </div>
                  <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                    <span className="text-[#F1E7D0]">1x DHT11 Humidity Sensor</span>
                    <span className="text-[#C49A55]">10k Pullup @ 3.3V</span>
                  </div>
                  <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                    <span className="text-[#F1E7D0]">1x Soil Moisture Probe (A0)</span>
                    <span className="text-[#67C7D4]">ADC1 Channel 6</span>
                  </div>
                  <div className="p-2 rounded bg-[#263447]/60 border border-[#263447] flex items-center justify-between">
                    <span className="text-[#F1E7D0]">1x 5V Relay Switch Module</span>
                    <span className="text-[#C49A55]">Opto-Isolated Drive</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[#F1E7D0]/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#67C7D4]" /> Available for booking with Student/Teacher ID photo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE THREE PILLARS OF GUILD INTEGRITY */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#263447] bg-[#141821]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C49A55]">
              Accountability by Design
            </h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#F1E7D0] mt-2">
              The Three Pillars of Guild Integrity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#263447]/60 engraved-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C49A55]/15 border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
                1. Photo ID Handover Matching
              </h3>
              <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
                Equipment is strictly released ONLY to the student or teacher whose verified photo ID card matches upon physical collection. No unauthorized proxy handovers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#263447]/60 engraved-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#67C7D4]/15 border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
                2. Screen QR &amp; Live Timer Sync
              </h3>
              <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
                The Lab Head generates a Handover QR on their screen. Scanning it activates an active deadline countdown timer for both Keeper and Seeker until safe return.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#263447]/60 engraved-card space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C49A55]/15 border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F1E7D0]">
                3. Immutable Inspection Audit
              </h3>
              <p className="text-xs text-[#F1E7D0]/70 leading-relaxed font-sans">
                Every component checkout and return requires condition logging with notes and attestation. Fair escalation protects both borrower and institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. GRAND CLOSING CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#141821] via-[#1a2330] to-[#141821] blueprint-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F1E7D0]">
            Ready to Enter the Electronics Network?
          </h2>
          <p className="text-sm sm:text-base text-[#F1E7D0]/70 max-w-2xl mx-auto font-sans leading-relaxed">
            Choose your role in the guild. Whether cataloging laboratory assets or prototyping next-generation robotics, IOTogether connects the dots.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sender"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-bold text-sm shadow-lg shadow-[#C49A55]/25 transition flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 fill-current" /> Join as a Keeper
            </Link>

            <Link
              href="/receiver"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#263447] hover:bg-[#32455e] border border-[#67C7D4] text-[#F1E7D0] font-bold text-sm shadow-lg shadow-[#67C7D4]/20 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#67C7D4]" /> Join as a Seeker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

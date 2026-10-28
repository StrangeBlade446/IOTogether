'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { switchDemoUser } from '@/app/actions/auth';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import {
  Shield,
  Compass,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Lock,
} from 'lucide-react';

export function MinimalistLanding() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  const handleQuickLogin = async (userId: string, targetPath: string) => {
    setLoadingId(userId);
    try {
      await switchDemoUser(userId, targetPath);
    } catch {
      router.push(targetPath);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Top Guild Seal */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
        <span className="tracking-wider uppercase text-[11px] font-mono text-[#C49A55]">
          Multi-Institution Electronics Guild
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
      </div>

      {/* Main Title & Tagline */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F1E7D0] leading-tight">
          Share Resources.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C49A55] via-[#e5bc7b] to-[#67C7D4]">
            Build Possibilities.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-[#F1E7D0]/80 font-sans font-light max-w-2xl mx-auto leading-relaxed">
          Connecting schools and colleges that possess underused electronics with verified students and teachers who seek hardware for innovation.
        </p>
      </div>

      {/* The Two Portals: Keeper & Seeker */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl">
        {/* =================================================================== */}
        {/* 1. KEEPER PORTAL (Those who possess equipment) */}
        {/* =================================================================== */}
        <div className="rounded-3xl bg-[#263447] border border-[#C49A55]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#C49A55] transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C49A55]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#141821] border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center shadow-inner">
                  <Shield className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-[#C49A55] font-bold">
                    Those who possess
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                    Keeper Portal
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-1 rounded-full text-[#C49A55] border border-[#C49A55]/30">
                Labs &amp; Faculty
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F1E7D0]/70 font-sans leading-relaxed">
              For laboratory heads and equipment custodians. List hardware with photos, inspect borrower photo IDs, and display Handover QR codes with active countdown timers.
            </p>

            {/* Primary Entry Button */}
            <div className="space-y-2">
              <Link
                href="/sender/login"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-forge"
              >
                <Shield className="w-4 h-4 fill-current" />
                <span>Join / Sign In as Keeper</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="text-center">
                <Link
                  href="/sender/signup"
                  className="text-[11px] text-[#F1E7D0]/60 hover:text-[#C49A55] underline underline-offset-4 transition"
                >
                  Register a New Institutional Lab &rarr;
                </Link>
              </div>
            </div>

            {/* One-Click Demo Selection */}
            <div className="pt-4 border-t border-[#F1E7D0]/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#C49A55] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Instant Demo Login (Keepers)
                </span>
                <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
              </div>

              <div className="space-y-2">
                {keepers.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.id, '/sender')}
                    disabled={loadingId !== null}
                    className="w-full text-left p-3 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-[#263447] hover:border-[#C49A55]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-[#F1E7D0] group-hover/item:text-[#C49A55] flex items-center gap-1.5">
                        <span className="truncate">{u.name}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#C49A55]/15 text-[#C49A55] border border-[#C49A55]/30 shrink-0">
                          {idx === 2 ? 'School' : 'College'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#F1E7D0]/70 truncate mt-0.5 font-sans">
                        {u.instituteName}
                      </div>
                      <div className="text-[10px] text-[#F1E7D0]/40 truncate font-mono">
                        {u.post}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F1E7D0]/40 group-hover/item:text-[#C49A55] group-hover/item:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. SEEKER PORTAL (Those who seek and borrow equipment) */}
        {/* =================================================================== */}
        <div className="rounded-3xl bg-[#263447] border border-[#67C7D4]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#67C7D4] transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#67C7D4]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1E7D0]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#141821] border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center shadow-inner">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-[#67C7D4] font-bold">
                    Those who seek
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F1E7D0]">
                    Seeker Portal
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-1 rounded-full text-[#67C7D4] border border-[#67C7D4]/30">
                Students &amp; Innovators
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F1E7D0]/70 font-sans leading-relaxed">
              For students, teachers, and project builders. Search cataloged electronics, assemble AI project recipes, upload photo ID, and scan Handover QR codes at physical pickup.
            </p>

            {/* Primary Entry Button */}
            <div className="space-y-2">
              <Link
                href="/receiver/login"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2 group-hover:shadow-blueprint"
              >
                <Compass className="w-4 h-4" />
                <span>Join / Sign In as Seeker</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="text-center">
                <Link
                  href="/receiver/signup"
                  className="text-[11px] text-[#F1E7D0]/60 hover:text-[#67C7D4] underline underline-offset-4 transition"
                >
                  Register as a New Borrower &rarr;
                </Link>
              </div>
            </div>

            {/* One-Click Demo Selection */}
            <div className="pt-4 border-t border-[#F1E7D0]/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#67C7D4] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Instant Demo Login (Seekers)
                </span>
                <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
              </div>

              <div className="space-y-2">
                {seekers.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.id, '/receiver')}
                    disabled={loadingId !== null}
                    className="w-full text-left p-3 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-[#263447] hover:border-[#67C7D4]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-[#F1E7D0] group-hover/item:text-[#67C7D4] flex items-center gap-1.5">
                        <span className="truncate">{u.name}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30 shrink-0">
                          {idx === 2 ? 'School' : 'College'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#F1E7D0]/70 truncate mt-0.5 font-sans">
                        {u.instituteName}
                      </div>
                      <div className="text-[10px] text-[#F1E7D0]/40 truncate font-mono">
                        {u.post}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F1E7D0]/40 group-hover/item:text-[#67C7D4] group-hover/item:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Institutions Ledger */}
      <div className="mt-12 text-center text-xs text-[#F1E7D0]/50 font-mono flex flex-wrap items-center justify-center gap-4 border-t border-[#263447] pt-6 w-full max-w-3xl">
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Apex Institute of Technology (College)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Vanguard Engineering College (College)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#67C7D4]">
          <GraduationCap className="w-3.5 h-3.5" /> Horizon STEM Academy (School)
        </span>
      </div>
    </div>
  );
}

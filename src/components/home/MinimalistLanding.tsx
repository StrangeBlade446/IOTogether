'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { switchDemoUser } from '@/app/actions/auth';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { TextRoll } from '@/components/core/text-roll';
import {
  Shield,
  Compass,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap,
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      {/* Top Guild Seal */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
        <span className="tracking-wider uppercase text-[11px] font-mono text-[#C49A55]">
          Multi-Institution Electronics Guild
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
      </div>

      {/* Main Title & Tagline with TextRoll */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif text-4xl sm:text-6xl font-bold tracking-tight">
          <TextRoll className="text-[#F1E7D0]">
            Share Resources.
          </TextRoll>
          <TextRoll className="text-[#C49A55]">
            Build Possibilities.
          </TextRoll>
        </div>
        <p className="text-sm sm:text-base text-[#F1E7D0]/80 font-sans font-light max-w-xl mx-auto leading-relaxed pt-1">
          Connecting schools and colleges that possess electronics equipment with verified students and teachers seeking hardware for innovation.
        </p>
      </div>

      {/* ===================================================================== */}
      {/* THE TWO LOGIN OPTIONS (AND NOTHING ELSE) */}
      {/* ===================================================================== */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-4xl">
        {/* =================================================================== */}
        {/* OPTION 1: KEEPER LOGIN */}
        {/* =================================================================== */}
        <div className="rounded-3xl bg-[#263447]/90 backdrop-blur-xl border-2 border-[#C49A55]/40 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#C49A55] transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C49A55]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1E7D0]/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#141821] border border-[#C49A55]/40 text-[#C49A55] flex items-center justify-center shadow-inner">
                  <Shield className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#C49A55] font-bold">
                    Those who possess
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F1E7D0]">
                    Keeper Login
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-0.5 rounded-full text-[#C49A55] border border-[#C49A55]/30">
                Labs &amp; Custodians
              </span>
            </div>

            <p className="text-xs text-[#F1E7D0]/70 font-sans leading-relaxed">
              For laboratory heads and equipment custodians. List hardware, review borrower photo IDs, click Manual Verified, and present Handover QR codes.
            </p>

            {/* Primary Entry Button */}
            <div className="space-y-2">
              <Link
                href="/sender/login"
                className="w-full py-3 px-4 rounded-2xl bg-[#C49A55] hover:bg-[#d4aa65] text-[#141821] font-bold text-xs sm:text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 fill-current" />
                <span>Sign In as Keeper</span>
                <ArrowRight className="w-4 h-4 ml-1" />
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

            {/* Instant Demo Login for Keepers */}
            <div className="pt-3 border-t border-[#F1E7D0]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#C49A55] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Instant Keeper Demo Login
                </span>
                <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
              </div>

              <div className="space-y-1.5">
                {keepers.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.id, '/sender')}
                    disabled={loadingId !== null}
                    className="w-full text-left p-2.5 rounded-xl bg-[#141821]/90 hover:bg-[#1a202c] border border-[#263447] hover:border-[#C49A55]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
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
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover/item:text-[#C49A55] transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* OPTION 2: SEEKER LOGIN */}
        {/* =================================================================== */}
        <div className="rounded-3xl bg-[#263447]/90 backdrop-blur-xl border-2 border-[#67C7D4]/40 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#67C7D4] transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#67C7D4]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1E7D0]/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#141821] border border-[#67C7D4]/40 text-[#67C7D4] flex items-center justify-center shadow-inner">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#67C7D4] font-bold">
                    Those who seek
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F1E7D0]">
                    Seeker Login
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-[#141821] px-2.5 py-0.5 rounded-full text-[#67C7D4] border border-[#67C7D4]/30">
                Students &amp; Faculty
              </span>
            </div>

            <p className="text-xs text-[#F1E7D0]/70 font-sans leading-relaxed">
              For students, teachers, and project builders. Search cataloged electronics, assemble AI project recipes, upload photo ID, and scan Handover QR codes.
            </p>

            {/* Primary Entry Button */}
            <div className="space-y-2">
              <Link
                href="/receiver/login"
                className="w-full py-3 px-4 rounded-2xl bg-[#67C7D4] hover:bg-[#7ed2dd] text-[#141821] font-bold text-xs sm:text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Sign In as Seeker</span>
                <ArrowRight className="w-4 h-4 ml-1" />
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

            {/* Instant Demo Login for Seekers */}
            <div className="pt-3 border-t border-[#F1E7D0]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#67C7D4] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Instant Seeker Demo Login
                </span>
                <span className="text-[10px] text-[#F1E7D0]/50 font-mono">2 Colleges • 1 School</span>
              </div>

              <div className="space-y-1.5">
                {seekers.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.id, '/receiver')}
                    disabled={loadingId !== null}
                    className="w-full text-left p-2.5 rounded-xl bg-[#141821]/90 hover:bg-[#1a202c] border border-[#263447] hover:border-[#67C7D4]/60 transition-all flex items-center justify-between group/item disabled:opacity-50"
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
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover/item:text-[#67C7D4] transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fictional Institutions Ledger */}
      <div className="mt-10 text-center text-xs text-[#F1E7D0]/50 font-mono flex flex-wrap items-center justify-center gap-4 border-t border-[#263447]/80 pt-6 w-full max-w-2xl">
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Apex Institute of Technology (College 1)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#C49A55]">
          <Building2 className="w-3.5 h-3.5" /> Vanguard Engineering College (College 2)
        </span>
        <span className="text-[#263447]">•</span>
        <span className="flex items-center gap-1.5 text-[#67C7D4]">
          <GraduationCap className="w-3.5 h-3.5" /> Horizon STEM Academy (School 1)
        </span>
      </div>
    </div>
  );
}

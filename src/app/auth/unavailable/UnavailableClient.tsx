'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { switchDemoUser } from '@/app/actions/auth';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Compass,
  Briefcase,
  ShieldCheck,
  Building2,
  GraduationCap,
  School,
  Home,
  CheckCircle2,
} from 'lucide-react';

export function UnavailableClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeUserId, setActiveUserId] = React.useState<string | null>(null);

  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');
  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const admins = DEMO_USERS.filter((u) => u.platformType === 'admin');

  const handleSelectDemo = (userId: string, targetPath: string) => {
    setActiveUserId(userId);
    startTransition(async () => {
      try {
        await switchDemoUser(userId, targetPath);
      } catch {
        router.push(targetPath);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C49A55]/20">
      <div className="max-w-4xl mx-auto">
        {/* Error Callout Banner */}
        <div className="mb-8 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 p-6 sm:p-8 shadow-lg shadow-amber-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 text-amber-800 border border-amber-500/30">
                Notice: Demonstration Mode
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                This feature is unavailable right now. Please proceed with a demo account.
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                Direct external login and new unverified self-registration are currently restricted for academic consortium
                custody compliance. To inspect all features as an evaluator or judge, please proceed using one of the pre-configured
                verified institution demo accounts below.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Account Selectors */}
        <div className="space-y-8">
          {/* Seeker Profiles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#67C7D4]/15 text-[#0891B2] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Seeker Demo Accounts (Borrowers)</h2>
                  <p className="text-xs text-slate-500">Students and mentors borrowing microcontrollers, sensors & equipment</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 font-medium">
                2 Colleges • 1 School
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seekers.map((u, idx) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemo(u.id, '/receiver')}
                  disabled={isPending}
                  className="p-4 rounded-xl text-left border border-slate-200 hover:border-[#67C7D4] hover:bg-cyan-50/40 transition-all group relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-[#67C7D4]/20 group-hover:text-cyan-900 group-hover:border-[#67C7D4]/40 transition-colors">
                        {idx === 2 ? 'School' : 'College'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0891B2] group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-[#0891B2] transition-colors">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{u.instituteName}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">{u.post}</div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Proceed as Seeker</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Keeper Profiles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C49A55]/15 text-[#92400E] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Keeper Demo Accounts (Lenders / Lab Heads)</h2>
                  <p className="text-xs text-slate-500">Lab custodians verifying ID photos, approving requests & generating handover QR codes</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                2 Colleges • 1 School
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {keepers.map((u, idx) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemo(u.id, '/sender')}
                  disabled={isPending}
                  className="p-4 rounded-xl text-left border border-slate-200 hover:border-[#C49A55] hover:bg-amber-50/40 transition-all group relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-[#C49A55]/20 group-hover:text-amber-900 group-hover:border-[#C49A55]/40 transition-colors">
                        {idx === 2 ? 'School' : 'College'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#92400E] group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-[#92400E] transition-colors">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{u.instituteName}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">{u.post}</div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Proceed as Keeper</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Administrator */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Consortium Admin
                </span>
                <span className="text-xs text-slate-400">Ledger & Multi-Institution Auditor</span>
              </div>
              <h2 className="text-base font-bold text-white">Dr. Vikram Seth</h2>
              <p className="text-xs text-slate-400">National Electronics Academic Consortium • Platform Administrator</p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectDemo(admins[0].id, '/admin')}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition flex items-center gap-2 shrink-0 group"
            >
              <span>Inspect Admin Ledger</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>
          </div>
        </div>

        {/* Quick Recovery Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-slate-900 font-semibold transition">
            <Home className="w-4 h-4" /> Return to Cable Chamber Landing
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/receiver/login" className="hover:text-[#0891B2] font-semibold transition">
              Seeker Login
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/sender/login" className="hover:text-[#92400E] font-semibold transition">
              Keeper Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

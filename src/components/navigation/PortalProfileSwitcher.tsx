'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEMO_USERS, DemoUser } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import {
  Compass,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  School,
  UserCheck,
} from 'lucide-react';

interface PortalProfileSwitcherProps {
  portal: 'seeker' | 'keeper';
  currentUserId: string;
  variant?: 'banner' | 'compact' | 'pills';
  className?: string;
}

export function PortalProfileSwitcher({
  portal,
  currentUserId,
  variant = 'banner',
  className = '',
}: PortalProfileSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [switchingToId, setSwitchingToId] = React.useState<string | null>(null);

  const demoUsers = DEMO_USERS.filter((u) =>
    portal === 'seeker' ? u.platformType === 'receiver' : u.platformType === 'sender'
  );

  const handleSwitch = (userId: string) => {
    if (userId === currentUserId || isPending) return;
    setSwitchingToId(userId);
    startTransition(async () => {
      try {
        await switchDemoUser(userId, pathname);
      } catch {
        router.refresh();
      } finally {
        setSwitchingToId(null);
      }
    });
  };

  const isSeeker = portal === 'seeker';
  const accentColor = isSeeker ? '#0891B2' : '#C49A55';
  const themeBg = isSeeker ? 'from-cyan-950/40 via-slate-900 to-navy-950/60' : 'from-amber-950/40 via-slate-900 to-navy-950/60';
  const themeBorder = isSeeker ? 'border-cyan-500/30' : 'border-amber-500/30';
  const activeBorder = isSeeker ? 'border-cyan-400 bg-cyan-950/60' : 'border-amber-400 bg-amber-950/60';
  const activeBadgeColor = isSeeker ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-amber-500/20 text-amber-300 border-amber-400/40';

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          {isSeeker ? <Compass className="w-3.5 h-3.5 text-cyan-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
          <span>Change {isSeeker ? 'Seeker' : 'Keeper'} Profile:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {demoUsers.map((u, idx) => {
            const isActive = u.id === currentUserId;
            const isTarget = switchingToId === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSwitch(u.id)}
                disabled={isPending}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? `${activeBadgeColor} font-bold shadow-sm`
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
                title={`Switch to ${u.name} (${u.instituteName})`}
              >
                <span>{u.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({idx === 2 ? 'School' : 'College'})
                </span>
                {isActive && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />}
                {isTarget && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r ${themeBg} border ${themeBorder} p-5 shadow-xl ${className}`}
      aria-label={`Change profile between ${portal} demo accounts`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              isSeeker
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isSeeker ? <Compass className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Change Profile between {isSeeker ? 'Seeker' : 'Keeper'} Demo Accounts</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                1-Click Switch
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              {isSeeker
                ? 'Select a student or teacher borrower identity across the 3 consortium member institutions.'
                : 'Select an institutional lab custodian persona to inspect requests and manage custody.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">2 Colleges</span>
          <span>•</span>
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">1 School</span>
        </div>
      </div>

      {/* 3 Institution Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {demoUsers.map((u, idx) => {
          const isActive = u.id === currentUserId;
          const isTarget = switchingToId === u.id;
          const institutionType = idx === 2 ? 'School' : 'College';

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSwitch(u.id)}
              disabled={isPending || isActive}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between group relative ${
                isActive
                  ? `${activeBorder} ring-1 ${isSeeker ? 'ring-cyan-400/40' : 'ring-amber-400/40'}`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      institutionType === 'School'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                        : isSeeker
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                    }`}
                  >
                    {institutionType} {idx + 1}
                  </span>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Profile
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-white flex items-center gap-0.5 transition-colors">
                      Switch <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                  {u.name}
                </div>
                <div className="text-xs text-slate-300 mt-0.5 truncate">{u.instituteName}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">{u.post}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {u.idNumber}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {idx === 0 && 'Apex Tech Lab bench'}
                  {idx === 1 && 'Vanguard Makerspace'}
                  {idx === 2 && 'Horizon STEM kit room'}
                </span>
                {isActive ? (
                  <span className="text-[10px] font-semibold text-emerald-400">Currently Loaded</span>
                ) : (
                  <span className={`text-[10px] font-semibold ${isSeeker ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {isTarget ? 'Switching...' : 'Click to Load'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import { UserCheck, ChevronDown, Shield, GraduationCap, Building2, Sparkles } from 'lucide-react';

interface DemoRoleSwitcherProps {
  currentUserId: string;
}

export function DemoRoleSwitcher({ currentUserId }: DemoRoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentUser = DEMO_USERS.find((u) => u.id === currentUserId) || DEMO_USERS[0];

  const handleSelect = (userId: string) => {
    setIsOpen(false);
    startTransition(async () => {
      await switchDemoUser(userId);
      router.refresh();
    });
  };

  const getRoleIcon = (cat: string) => {
    switch (cat) {
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      case 'manager':
        return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'student':
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-850 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-medium text-slate-200 transition-all shadow-sm"
        title="Switch between Hackathon Demo Profiles (Student, Lab Manager, Admin)"
      >
        <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400 hidden sm:inline">Role:</span>
        <span className="font-semibold text-white truncate max-w-[140px]">{currentUser.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Hackathon Demo Persona
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                Live Switcher
              </span>
            </div>

            <div className="space-y-1">
              {DEMO_USERS.map((user) => {
                const isSelected = user.id === currentUserId;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/70 border border-cyan-700/60 text-white'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-slate-800 border border-slate-700">
                      {getRoleIcon(user.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] font-medium text-cyan-400/90 truncate">{user.roleLabel}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{user.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 px-2 py-1 text-[11px] text-slate-400 text-center">
              Switching instantly switches cookies and permissions on all server actions.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

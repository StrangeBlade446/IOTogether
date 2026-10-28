'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  // Remove the demo dropdown menu on the landing page as explicitly requested
  if (pathname === '/') {
    return null;
  }

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
        return <Building2 className="w-3.5 h-3.5 text-[#C49A55]" />;
      case 'student':
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-[#67C7D4]" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0891B2]/50 text-xs font-medium text-slate-800 transition-all shadow-sm"
        title="Switch between Demo Profiles (Keeper, Seeker, Auditor)"
      >
        <span className="flex items-center justify-center w-2 h-2 rounded-full bg-[#0891B2] animate-pulse" />
        <span className="text-slate-500 hidden sm:inline">Role:</span>
        <span className="font-semibold text-slate-900 truncate max-w-[140px]">{currentUser.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A55]" />
                Institutional Personas
              </span>
              <span className="text-[10px] bg-cyan-50 text-[#0891B2] border border-cyan-200 px-1.5 py-0.5 rounded font-mono font-medium">
                2 Colleges • 1 School
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
                        ? 'bg-amber-50/80 border border-amber-300 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                      {getRoleIcon(user.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-[#0891B2] shrink-0" />}
                      </div>
                      <p className="text-[11px] font-medium text-[#A17A38] truncate">{user.roleLabel}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{user.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-2 py-1 text-[11px] text-slate-500 text-center font-mono">
              Switching instantly updates session and permissions.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

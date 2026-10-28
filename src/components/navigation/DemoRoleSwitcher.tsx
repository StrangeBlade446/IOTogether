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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#263447] border border-[#263447] hover:border-[#67C7D4]/50 text-xs font-medium text-[#F1E7D0] transition-all shadow-sm"
        title="Switch between Demo Profiles (Keeper, Seeker, Auditor)"
      >
        <span className="flex items-center justify-center w-2 h-2 rounded-full bg-[#67C7D4] animate-pulse" />
        <span className="text-[#F1E7D0]/60 hidden sm:inline">Role:</span>
        <span className="font-semibold text-[#F1E7D0] truncate max-w-[140px]">{currentUser.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#F1E7D0]/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#141821] border border-[#263447] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-[#263447] mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F1E7D0]/80 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A55]" />
                Institutional Personas
              </span>
              <span className="text-[10px] bg-[#263447] text-[#67C7D4] border border-[#67C7D4]/40 px-1.5 py-0.5 rounded font-mono">
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
                        ? 'bg-[#263447] border border-[#67C7D4]/60 text-[#F1E7D0]'
                        : 'hover:bg-[#263447]/60 text-[#F1E7D0]/80'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-[#141821] border border-[#263447]">
                      {getRoleIcon(user.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#F1E7D0] truncate">{user.name}</p>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-[#67C7D4] shrink-0" />}
                      </div>
                      <p className="text-[11px] font-medium text-[#C49A55] truncate">{user.roleLabel}</p>
                      <p className="text-[10px] text-[#F1E7D0]/60 line-clamp-2 mt-0.5">{user.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-[#263447] px-2 py-1 text-[11px] text-[#F1E7D0]/60 text-center">
              Switching instantly updates session and permissions.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

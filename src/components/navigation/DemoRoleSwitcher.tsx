'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEMO_USERS, DemoUser } from '@/lib/auth/demo-users';
import { switchDemoUser } from '@/app/actions/auth';
import {
  UserCheck,
  ChevronDown,
  Shield,
  GraduationCap,
  Building2,
  Sparkles,
  Compass,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

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

  const isSeekerPortal = pathname.startsWith('/receiver');
  const isKeeperPortal = pathname.startsWith('/sender');

  const [activeTab, setActiveTab] = useState<'seeker' | 'keeper' | 'all'>(
    isSeekerPortal ? 'seeker' : isKeeperPortal ? 'keeper' : 'all'
  );

  const currentUser = DEMO_USERS.find((u) => u.id === currentUserId) || DEMO_USERS[0];

  const handleSelect = (userId: string, targetPath?: string) => {
    setIsOpen(false);
    startTransition(async () => {
      // If currently on receiver and picking a seeker, stay on current path.
      // If picking a keeper from receiver, redirect to /sender to maintain portal integrity.
      const pickedUser = DEMO_USERS.find((u) => u.id === userId);
      let returnPath = pathname;
      if (pickedUser?.platformType === 'receiver' && !pathname.startsWith('/receiver')) {
        returnPath = '/receiver';
      } else if (pickedUser?.platformType === 'sender' && !pathname.startsWith('/sender')) {
        returnPath = '/sender';
      } else if (pickedUser?.platformType === 'admin') {
        returnPath = '/admin';
      }

      await switchDemoUser(userId, returnPath);
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

  const seekerUsers = DEMO_USERS.filter((u) => u.platformType === 'receiver');
  const keeperUsers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const adminUsers = DEMO_USERS.filter((u) => u.platformType === 'admin');

  const displayedUsers =
    activeTab === 'seeker'
      ? seekerUsers
      : activeTab === 'keeper'
      ? keeperUsers
      : DEMO_USERS;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${
          isSeekerPortal
            ? 'bg-slate-900 border-cyan-500/40 text-cyan-200 hover:border-cyan-400'
            : isKeeperPortal
            ? 'bg-slate-900 border-amber-500/40 text-amber-200 hover:border-amber-400'
            : 'bg-white border-slate-200 hover:border-[#0891B2]/50 text-slate-800'
        }`}
        title={`Change Demo Profile (${isSeekerPortal ? 'Seeker Personas' : isKeeperPortal ? 'Keeper Personas' : 'All Demo Personas'})`}
      >
        <span
          className={`flex items-center justify-center w-2 h-2 rounded-full animate-pulse ${
            isSeekerPortal ? 'bg-[#0891B2]' : isKeeperPortal ? 'bg-[#C49A55]' : 'bg-[#0891B2]'
          }`}
        />
        <span className="opacity-75 hidden sm:inline">
          {isSeekerPortal ? 'Seeker:' : isKeeperPortal ? 'Keeper:' : 'Role:'}
        </span>
        <span className="font-semibold truncate max-w-[130px]">{currentUser.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-75 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white">
            {/* Header with Title & Badge */}
            <div className="px-2 py-1.5 border-b border-slate-800 mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A55]" />
                Change Demo Profile
              </span>
              <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                2 Colleges • 1 School
              </span>
            </div>

            {/* Portal Tab Switcher (Seeker vs Keeper) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl mb-3 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('seeker')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'seeker'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Seeker Profiles ({seekerUsers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('keeper')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'keeper'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Keeper Profiles ({keeperUsers.length})</span>
              </button>
            </div>

            {/* List of Profiles in Active Tab */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {displayedUsers.map((user, idx) => {
                const isSelected = user.id === currentUserId;
                const isUserSeeker = user.platformType === 'receiver';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 border ${
                      isSelected
                        ? isUserSeeker
                          ? 'bg-cyan-950/60 border-cyan-500/50 text-white shadow-sm'
                          : 'bg-amber-950/60 border-amber-500/50 text-white shadow-sm'
                        : 'bg-slate-950/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-1.5 rounded-lg border shrink-0 ${
                        isUserSeeker
                          ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800'
                      }`}
                    >
                      {getRoleIcon(user.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        {isSelected ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700">
                            {idx === 2 ? 'School' : 'College'}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 font-sans ${
                          isUserSeeker ? 'text-cyan-300/90' : 'text-amber-300/90'
                        }`}
                      >
                        {user.instituteName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.post}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Platform Admin Footer Option */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => handleSelect(adminUsers[0].id, '/admin')}
                className="text-[11px] font-mono text-slate-400 hover:text-rose-300 transition flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3 text-rose-400" />
                <span>Auditor Persona (Dr. Vikram Seth)</span>
              </button>
              <span className="text-[10px] text-slate-500 font-mono">1-click switch</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

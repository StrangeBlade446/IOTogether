'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  LogIn,
  UserPlus,
} from 'lucide-react';

export function MinimalistLanding() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<'keeper' | 'seeker' | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const keepers = DEMO_USERS.filter((u) => u.platformType === 'sender');
  const seekers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleQuickLogin = async (userId: string, targetPath: string) => {
    setLoadingId(userId);
    try {
      await switchDemoUser(userId, targetPath);
    } catch {
      router.push(targetPath);
    }
  };

  const toggleMenu = (menu: 'keeper' | 'seeker') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]"
    >
      {/* Top Guild Seal */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#263447]/90 border border-[#C49A55]/40 text-[#F1E7D0] text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
        <span className="tracking-wider uppercase text-[11px] font-mono text-[#C49A55]">
          Multi-Institution Electronics Guild
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
      </div>

      {/* Grand Title: IOTogether with TextRoll effect */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="flex items-center justify-center font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
          <TextRoll className="text-[#C49A55]">IO</TextRoll>
          <TextRoll className="text-[#F1E7D0]">Together</TextRoll>
        </div>

        <p className="font-serif text-lg sm:text-xl text-[#F1E7D0]/90 font-medium">
          Share Resources. Build Possibilities.
        </p>
        <p className="text-xs sm:text-sm text-[#F1E7D0]/70 font-sans font-light max-w-lg mx-auto leading-relaxed">
          Connecting schools and colleges that possess electronics equipment with verified students and teachers seeking hardware for innovation.
        </p>
      </div>

      {/* ===================================================================== */}
      {/* THE TWO BUTTONS WITH INTERACTIVE DROPDOWN MENUS */}
      {/* ===================================================================== */}
      <div className="relative w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 z-30">
        {/* =================================================================== */}
        {/* BUTTON 1: LOGIN AS A KEEPER */}
        {/* =================================================================== */}
        <div className="relative w-full sm:w-1/2">
          <button
            type="button"
            onClick={() => toggleMenu('keeper')}
            className={`w-full py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-between shadow-xl border-2 ${
              activeMenu === 'keeper'
                ? 'bg-[#C49A55] text-[#141821] border-[#e5bc7b] shadow-[0_0_25px_rgba(196,154,85,0.45)]'
                : 'bg-[#263447]/95 hover:bg-[#263447] text-[#F1E7D0] border-[#C49A55]/50 hover:border-[#C49A55] shadow-lg backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  activeMenu === 'keeper' ? 'bg-[#141821]/20 text-[#141821]' : 'bg-[#141821] text-[#C49A55]'
                }`}
              >
                <Shield className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <span className="block leading-tight font-serif text-base">Login as Keeper</span>
                <span
                  className={`text-[10px] block font-sans font-normal ${
                    activeMenu === 'keeper' ? 'text-[#141821]/80' : 'text-[#F1E7D0]/60'
                  }`}
                >
                  Those who possess
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                activeMenu === 'keeper' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Keeper Dropdown Menu */}
          <AnimatePresence>
            {activeMenu === 'keeper' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-80 mt-2 p-3 rounded-2xl bg-[#141821]/95 border-2 border-[#C49A55]/60 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 space-y-3"
              >
                {/* Header */}
                <div className="px-2 pt-1 pb-2 border-b border-[#263447] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#C49A55] font-bold">
                      Keeper Portal
                    </span>
                    <h3 className="text-xs font-bold text-[#F1E7D0]">Lab Heads &amp; Custodians</h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#C49A55]/15 text-[#C49A55] border border-[#C49A55]/30">
                    Lenders
                  </span>
                </div>

                {/* Standard Login & Signup Links */}
                <div className="space-y-1.5">
                  <Link
                    href="/sender/login"
                    className="w-full p-2.5 rounded-xl bg-[#263447] hover:bg-[#32455e] border border-[#263447] hover:border-[#C49A55]/50 text-xs font-bold text-[#F1E7D0] flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="w-3.5 h-3.5 text-[#C49A55]" />
                      Sign In with Email
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover:text-[#C49A55] group-hover:translate-x-0.5 transition" />
                  </Link>

                  <Link
                    href="/sender/signup"
                    className="w-full p-2.5 rounded-xl bg-[#141821] hover:bg-[#263447]/60 border border-[#263447] text-xs font-semibold text-[#F1E7D0]/80 hover:text-[#F1E7D0] flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-[#C49A55]" />
                      Register New Lab
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40" />
                  </Link>
                </div>

                {/* Demo Options Section */}
                <div className="pt-2 border-t border-[#263447] space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-bold text-[#C49A55] uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> One-Click Demo Profiles
                    </span>
                    <span className="text-[9px] text-[#F1E7D0]/50 font-mono">3 Accounts</span>
                  </div>

                  <div className="space-y-1">
                    {keepers.map((u, idx) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u.id, '/sender')}
                        disabled={loadingId !== null}
                        className="w-full text-left p-2 rounded-xl bg-[#263447]/60 hover:bg-[#263447] border border-[#263447] hover:border-[#C49A55]/60 transition flex items-center justify-between group/demo disabled:opacity-50"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-bold text-[#F1E7D0] group-hover/demo:text-[#C49A55] flex items-center gap-1.5">
                            <span className="truncate">{u.name}</span>
                            <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-[#C49A55]/15 text-[#C49A55] border border-[#C49A55]/30 shrink-0">
                              {idx === 2 ? 'School' : 'College'}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#F1E7D0]/70 truncate mt-0.5">
                            {u.instituteName}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover/demo:text-[#C49A55] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =================================================================== */}
        {/* BUTTON 2: LOGIN AS A SEEKER */}
        {/* =================================================================== */}
        <div className="relative w-full sm:w-1/2">
          <button
            type="button"
            onClick={() => toggleMenu('seeker')}
            className={`w-full py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-between shadow-xl border-2 ${
              activeMenu === 'seeker'
                ? 'bg-[#67C7D4] text-[#141821] border-[#8fe0ea] shadow-[0_0_25px_rgba(103,199,212,0.45)]'
                : 'bg-[#263447]/95 hover:bg-[#263447] text-[#F1E7D0] border-[#67C7D4]/50 hover:border-[#67C7D4] shadow-lg backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  activeMenu === 'seeker' ? 'bg-[#141821]/20 text-[#141821]' : 'bg-[#141821] text-[#67C7D4]'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight font-serif text-base">Login as Seeker</span>
                <span
                  className={`text-[10px] block font-sans font-normal ${
                    activeMenu === 'seeker' ? 'text-[#141821]/80' : 'text-[#F1E7D0]/60'
                  }`}
                >
                  Those who seek
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                activeMenu === 'seeker' ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Seeker Dropdown Menu */}
          <AnimatePresence>
            {activeMenu === 'seeker' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-80 mt-2 p-3 rounded-2xl bg-[#141821]/95 border-2 border-[#67C7D4]/60 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 space-y-3"
              >
                {/* Header */}
                <div className="px-2 pt-1 pb-2 border-b border-[#263447] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#67C7D4] font-bold">
                      Seeker Portal
                    </span>
                    <h3 className="text-xs font-bold text-[#F1E7D0]">Students &amp; Teachers</h3>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30">
                    Borrowers
                  </span>
                </div>

                {/* Standard Login & Signup Links */}
                <div className="space-y-1.5">
                  <Link
                    href="/receiver/login"
                    className="w-full p-2.5 rounded-xl bg-[#263447] hover:bg-[#32455e] border border-[#263447] hover:border-[#67C7D4]/50 text-xs font-bold text-[#F1E7D0] flex items-center justify-between transition group"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="w-3.5 h-3.5 text-[#67C7D4]" />
                      Sign In with Email
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover:text-[#67C7D4] group-hover:translate-x-0.5 transition" />
                  </Link>

                  <Link
                    href="/receiver/signup"
                    className="w-full p-2.5 rounded-xl bg-[#141821] hover:bg-[#263447]/60 border border-[#263447] text-xs font-semibold text-[#F1E7D0]/80 hover:text-[#F1E7D0] flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-[#67C7D4]" />
                      Register as Borrower
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40" />
                  </Link>
                </div>

                {/* Demo Options Section */}
                <div className="pt-2 border-t border-[#263447] space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-bold text-[#67C7D4] uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> One-Click Demo Profiles
                    </span>
                    <span className="text-[9px] text-[#F1E7D0]/50 font-mono">3 Accounts</span>
                  </div>

                  <div className="space-y-1">
                    {seekers.map((u, idx) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u.id, '/receiver')}
                        disabled={loadingId !== null}
                        className="w-full text-left p-2 rounded-xl bg-[#263447]/60 hover:bg-[#263447] border border-[#263447] hover:border-[#67C7D4]/60 transition flex items-center justify-between group/demo disabled:opacity-50"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-bold text-[#F1E7D0] group-hover/demo:text-[#67C7D4] flex items-center gap-1.5">
                            <span className="truncate">{u.name}</span>
                            <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-[#67C7D4]/15 text-[#67C7D4] border border-[#67C7D4]/30 shrink-0">
                              {idx === 2 ? 'School' : 'College'}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#F1E7D0]/70 truncate mt-0.5">
                            {u.instituteName}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F1E7D0]/40 group-hover/demo:text-[#67C7D4] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fictional Institutions Ledger */}
      <div className="mt-14 text-center text-xs text-[#F1E7D0]/50 font-mono flex flex-wrap items-center justify-center gap-4 border-t border-[#263447]/80 pt-6 w-full max-w-2xl">
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

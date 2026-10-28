import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { DemoRoleSwitcher } from '@/components/navigation/DemoRoleSwitcher';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import {
  Compass,
  Cpu,
  Layers,
  Building,
  Bell,
  Settings,
  ShieldAlert,
  User,
} from 'lucide-react';

export async function Navbar() {
  const session = await getSession();
  const unreadNotifs = db.getNotifications(session.user.id).filter((n) => !n.read_at).length;

  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;
  const isAdmin = session.isPlatformAdmin;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-navy-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" showTagline />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              Explore Equipment
            </Link>

            <Link
              href="/project-matcher"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Cpu className="w-4 h-4 text-teal-400" />
              Project Matcher
            </Link>

            <Link
              href="/my-bookings"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              My Bookings
            </Link>

            <Link
              href="/institutions"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Building className="w-4 h-4 text-slate-400" />
              Institutions
            </Link>

            {isStaff && (
              <Link
                href="/manage"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-800/40 transition-colors ml-1"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                Manage Portal
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-800/40 transition-colors ml-1"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Notifications & Persona Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-cyan-500 rounded-full border-2 border-navy-900 animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors hidden sm:flex border border-transparent hover:border-slate-700"
            title="User Profile & Memberships"
          >
            <User className="w-5 h-5 text-slate-400" />
          </Link>

          {/* Quick Demo Persona Switcher */}
          <DemoRoleSwitcher currentUserId={session.user.id} />
        </div>
      </div>
    </header>
  );
}

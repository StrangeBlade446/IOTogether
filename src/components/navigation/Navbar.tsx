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
    <header className="sticky top-0 z-40 w-full border-b border-[#263447] bg-[#141821]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" showTagline />

          {/* Keeper / Seeker Platform Switcher Pills */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-[#141821] border border-[#263447] rounded-xl ml-2">
            <Link
              href="/sender"
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C49A55] hover:bg-[#C49A55]/15 transition flex items-center gap-1.5 border border-[#C49A55]/30"
              title="Equipment Keepers (Lab Heads & Assigners)"
            >
              <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
              Keeper Portal
            </Link>

            <Link
              href="/receiver"
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#67C7D4] hover:bg-[#67C7D4]/15 transition flex items-center gap-1.5 border border-[#67C7D4]/30"
              title="Equipment Seekers (Students & Teachers)"
            >
              <span className="w-2 h-2 rounded-full bg-[#67C7D4] animate-pulse" />
              Seeker Portal
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/receiver/explore"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:bg-[#263447]/60 transition-colors"
            >
              <Compass className="w-4 h-4 text-[#67C7D4]" />
              Explore Equipment
            </Link>

            <Link
              href="/receiver/project-recipe"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:bg-[#263447]/60 transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#67C7D4]" />
              AI Project Recipe
            </Link>

            <Link
              href="/receiver/bookings"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:bg-[#263447]/60 transition-colors"
            >
              <Layers className="w-4 h-4 text-[#C49A55]" />
              My Bookings
            </Link>

            {isStaff && (
              <Link
                href="/sender/requests"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-[#C49A55] hover:text-[#F1E7D0] hover:bg-[#C49A55]/15 border border-[#C49A55]/30 transition-colors ml-1"
              >
                <Settings className="w-4 h-4 text-[#C49A55]" />
                Lab Head Portal
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
            className="relative p-2 rounded-lg text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:bg-[#263447] transition-colors border border-transparent hover:border-[#263447]"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#C49A55]" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-[#141821] bg-[#C49A55] rounded-full border-2 border-[#141821] animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className="p-2 rounded-lg text-[#F1E7D0]/80 hover:text-[#F1E7D0] hover:bg-[#263447] transition-colors hidden sm:flex border border-transparent hover:border-[#263447]"
            title="User Profile & Memberships"
          >
            <User className="w-5 h-5 text-[#67C7D4]" />
          </Link>

          {/* Quick Demo Persona Switcher */}
          <DemoRoleSwitcher currentUserId={session.user.id} />
        </div>
      </div>
    </header>
  );
}

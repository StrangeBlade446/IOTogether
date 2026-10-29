'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  Search,
  Cpu,
  Layers,
  Shield,
  ClipboardList,
  ScrollText,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideDockProps {
  unreadNotifs?: number;
}

export function SideDock({ unreadNotifs = 0 }: SideDockProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Keep landing page minimal with only the 3D cable interaction; display dock after login / inner pages
  if (pathname === '/') {
    return null;
  }

  const navItems = [
    {
      title: 'Guild Home',
      label: 'Home',
      category: 'General',
      icon: Home,
      href: '/',
      active: pathname === '/',
      color: '#C49A55',
    },
    {
      title: 'Seeker 3D Lab',
      label: 'Seeker Lab',
      category: 'Seeker',
      icon: Compass,
      href: '/receiver',
      active: pathname === '/receiver',
      color: '#0891B2',
    },
    {
      title: 'Seeker Equipment Catalog',
      label: 'Seeker Catalog',
      category: 'Seeker',
      icon: Search,
      href: '/receiver/explore',
      active: pathname.startsWith('/receiver/explore') || pathname === '/explore',
      color: '#0891B2',
    },
    {
      title: 'AI Project Recipe Chef',
      label: 'AI Recipe',
      category: 'Seeker',
      icon: Cpu,
      href: '/receiver/project-recipe',
      active: pathname.startsWith('/receiver/project-recipe'),
      color: '#0D9488',
    },
    {
      title: 'Seeker Bookings & QR Claim',
      label: 'My Bookings',
      category: 'Seeker',
      icon: Layers,
      href: '/receiver/bookings',
      active: pathname.startsWith('/receiver/bookings') || pathname === '/my-bookings',
      color: '#0891B2',
    },
    {
      title: 'Keeper 3D Desk',
      label: 'Keeper Desk',
      category: 'Keeper',
      icon: Shield,
      href: '/sender',
      active: pathname === '/sender',
      color: '#C49A55',
    },
    {
      title: 'Keeper Requests & ID Verify',
      label: 'Keeper Requests',
      category: 'Keeper',
      icon: ClipboardList,
      href: '/sender/requests',
      active: pathname.startsWith('/sender/requests') || pathname.startsWith('/manage/requests'),
      color: '#D97706',
    },
    {
      title: 'Immutable Audit Ledger',
      label: 'Audit Ledger',
      category: 'Ledger',
      icon: ScrollText,
      href: '/admin/audit',
      active: pathname.startsWith('/admin/audit'),
      color: '#475569',
    },
    {
      title: 'Notification Center',
      label: 'Notifications',
      category: 'System',
      icon: Bell,
      href: '/notifications',
      active: pathname === '/notifications',
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      color: '#E11D48',
    },
    {
      title: 'Account & Memberships',
      label: 'Profile',
      category: 'System',
      icon: User,
      href: '/profile',
      active: pathname === '/profile',
      color: '#475569',
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP / TABLET LABELED SIDE DOCK (LEFT SIDE) */}
      {/* ========================================================================= */}
      <aside
        aria-label="Side Dock Navigation"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
      >
        <motion.div
          animate={{ width: collapsed ? 68 : 220 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative bg-white/95 backdrop-blur-2xl border-2 border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.12)] p-2.5 rounded-3xl flex flex-col gap-1 overflow-hidden"
        >
          {/* Header & Collapse Toggle */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1">
            <div className={cn('flex items-center gap-1.5 overflow-hidden transition-opacity', collapsed ? 'opacity-0 w-0' : 'opacity-100')}>
              <span className="w-2 h-2 rounded-full bg-[#ba4d2b] animate-pulse shrink-0" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-800 truncate">
                PORTAL DOCK
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand side dock with labels' : 'Collapse side dock'}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shrink-0 ml-auto"
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Items with Persistent Visible Labels */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="outline-none"
                  title={item.title}
                >
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'group relative flex items-center gap-2.5 px-2.5 py-2 rounded-2xl transition-all duration-150',
                      item.active
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )}
                  >
                    {/* Active Accent Pill */}
                    {item.active && (
                      <motion.span
                        layoutId="activeDockPill"
                        className="absolute left-1 top-2 bottom-2 w-1 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'relative flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors',
                        item.active
                          ? 'text-white'
                          : 'bg-slate-50 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-200/70 border border-slate-200/80'
                      )}
                      style={item.active ? { backgroundColor: `${item.color}25`, color: item.color } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-rose-600 rounded-full border border-white animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Visible Label */}
                    <div className={cn('flex flex-col overflow-hidden text-left', collapsed ? 'hidden' : 'block')}>
                      <span
                        className={cn(
                          'text-xs font-bold tracking-tight truncate leading-tight',
                          item.active ? 'text-white' : 'text-slate-800 group-hover:text-slate-950'
                        )}
                      >
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] font-mono tracking-wider uppercase truncate leading-tight',
                          item.active ? 'text-slate-300' : 'text-slate-600'
                        )}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Mini role chip when expanded */}
                    {!collapsed && item.active && (
                      <span
                        className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `${item.color}35`, color: item.color }}
                      >
                        Live
                      </span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE / COMPACT HORIZONTAL BOTTOM DOCK (WITH LABELS) */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Dock"
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 lg:hidden max-w-[96vw] w-full px-2"
      >
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.15)] px-2 py-1.5 rounded-2xl flex items-center justify-around gap-1">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-1.5 rounded-xl transition-all flex-1 text-center',
                  item.active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </div>
                <span className="text-[9px] font-bold truncate max-w-[54px] mt-0.5 leading-tight">
                  {item.label.replace('Seeker ', '').replace('Keeper ', '')}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

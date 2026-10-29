'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Search,
  Cpu,
  Layers,
  Shield,
  ClipboardList,
  Package,
  Clock,
  ScrollText,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideDockProps {
  unreadNotifs?: number;
  userRole?: string; // 'student' | 'staff' | 'platform_admin'
}

export function SideDock({ unreadNotifs = 0, userRole = 'student' }: SideDockProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Minimal landing page: no dock on '/'
  if (pathname === '/') {
    return null;
  }

  const isStaff = userRole === 'staff';
  const isStudent = userRole === 'student';
  const isAdmin = userRole === 'platform_admin';

  // Strict role-based navigation: Seekers never see Keeper links; Keepers never see Seeker links
  const allNavItems = [
    {
      title: 'Home',
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/',
      color: '#C49A55',
      audience: 'both',
    },
    // SEEKER SPECIFIC ITEMS
    {
      title: 'Seeker 3D Lab',
      label: 'Seeker Lab',
      icon: Compass,
      href: '/receiver',
      active: pathname === '/receiver',
      color: '#0891B2',
      audience: 'seeker',
    },
    {
      title: 'Seeker Equipment Catalog',
      label: 'Catalog',
      icon: Search,
      href: '/receiver/explore',
      active: pathname.startsWith('/receiver/explore') || pathname === '/explore',
      color: '#0891B2',
      audience: 'seeker',
    },
    {
      title: 'Scientific Chef Recipes',
      label: 'Chef Recipes',
      icon: Cpu,
      href: '/receiver/project-recipe',
      active: pathname.startsWith('/receiver/project-recipe'),
      color: '#0D9488',
      audience: 'seeker',
    },
    {
      title: 'My Bookings & QR Claim',
      label: 'My Bookings',
      icon: Layers,
      href: '/receiver/bookings',
      active: pathname.startsWith('/receiver/bookings') || pathname === '/my-bookings',
      color: '#0891B2',
      audience: 'seeker',
    },
    // KEEPER SPECIFIC ITEMS
    {
      title: 'Keeper 3D Desk',
      label: 'Keeper Desk',
      icon: Shield,
      href: '/sender',
      active: pathname === '/sender',
      color: '#C49A55',
      audience: 'keeper',
    },
    {
      title: 'ID Verification & Handover QR',
      label: 'ID Requests',
      icon: ClipboardList,
      href: '/sender/requests',
      active: pathname.startsWith('/sender/requests') || pathname.startsWith('/manage/requests'),
      color: '#D97706',
      audience: 'keeper',
    },
    {
      title: 'Laboratory Inventory',
      label: 'Inventory',
      icon: Package,
      href: '/sender/inventory',
      active: pathname.startsWith('/sender/inventory'),
      color: '#D97706',
      audience: 'keeper',
    },
    {
      title: 'Active Loans & Timers',
      label: 'Active Loans',
      icon: Clock,
      href: '/sender/loans',
      active: pathname.startsWith('/sender/loans'),
      color: '#16A34A',
      audience: 'keeper',
    },
    {
      title: 'Immutable Audit Ledger',
      label: 'Audit Ledger',
      icon: ScrollText,
      href: '/admin/audit',
      active: pathname.startsWith('/admin/audit'),
      color: '#475569',
      audience: 'keeper',
    },
    // COMMON ITEMS
    {
      title: 'Notification Center',
      label: 'Notifications',
      icon: Bell,
      href: '/notifications',
      active: pathname === '/notifications',
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      color: '#E11D48',
      audience: 'both',
    },
    {
      title: 'Account Profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      active: pathname === '/profile',
      color: '#475569',
      audience: 'both',
    },
  ];

  const navItems = allNavItems.filter((item) => {
    if (isAdmin) return true;
    if (isStudent) return item.audience === 'seeker' || item.audience === 'both';
    if (isStaff) return item.audience === 'keeper' || item.audience === 'both';
    return item.audience === 'both';
  });

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
          animate={{ width: collapsed ? 64 : 180 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-2 rounded-2xl flex flex-col gap-1 overflow-hidden"
        >
          {/* Header & Collapse Toggle */}
          <div className="flex items-center justify-between px-1.5 py-1 mb-1 border-b border-slate-100">
            <span
              className={cn(
                'text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 truncate transition-opacity',
                collapsed ? 'hidden' : 'block'
              )}
            >
              {isStaff ? 'KEEPER PORTAL' : 'SEEKER PORTAL'}
            </span>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand side dock' : 'Collapse side dock'}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition shrink-0 ml-auto"
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Items with Clean, Minimalist Visible Labels */}
          <nav className="flex flex-col gap-0.5">
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
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'group relative flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-150',
                      item.active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    )}
                  >
                    {/* Active Indicator Bar */}
                    {item.active && (
                      <span
                        className="absolute left-0.5 top-2 bottom-2 w-1 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'relative flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors',
                        item.active
                          ? 'text-white'
                          : 'text-slate-500 group-hover:text-slate-900'
                      )}
                      style={item.active ? { backgroundColor: `${item.color}25`, color: item.color } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-bold text-white bg-rose-600 rounded-full border border-white">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Visible Label (Category Subtitle Hidden as Requested) */}
                    <div className={cn('flex flex-col overflow-hidden text-left', collapsed ? 'hidden' : 'block')}>
                      <span
                        className={cn(
                          'text-xs font-semibold tracking-tight truncate leading-tight',
                          item.active ? 'text-white' : 'text-slate-800 group-hover:text-slate-950'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE / COMPACT HORIZONTAL BOTTOM DOCK */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Dock"
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 lg:hidden max-w-[96vw] w-full px-2"
      >
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.12)] px-2 py-1.5 rounded-2xl flex items-center justify-around gap-1">
          {navItems.slice(0, 5).map((item) => {
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
                <span className="text-[9px] font-medium truncate max-w-[54px] mt-0.5 leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

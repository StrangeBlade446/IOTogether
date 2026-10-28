'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Cpu,
  Layers,
  Shield,
  ScrollText,
  Bell,
  User,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { cn } from '@/lib/utils';

interface SideDockProps {
  unreadNotifs?: number;
}

export function SideDock({ unreadNotifs = 0 }: SideDockProps) {
  const pathname = usePathname();

  // Keep landing page minimal with only the 2 login options; display dock after login / inner pages
  if (pathname === '/') {
    return null;
  }

  const navItems = [
    {
      title: 'Guild Home',
      icon: Home,
      href: '/',
      active: pathname === '/',
      color: '#C49A55',
    },
    {
      title: 'Interactive Search',
      icon: Search,
      href: '/receiver/explore',
      active: pathname.startsWith('/receiver/explore') || pathname === '/explore',
      color: '#67C7D4',
    },
    {
      title: 'AI Project Recipe',
      icon: Cpu,
      href: '/receiver/project-recipe',
      active: pathname.startsWith('/receiver/project-recipe'),
      color: '#67C7D4',
    },
    {
      title: 'My Bookings & Timers',
      icon: Layers,
      href: '/receiver/bookings',
      active: pathname.startsWith('/receiver/bookings') || pathname === '/my-bookings',
      color: '#C49A55',
    },
    {
      title: 'Keeper Lab Head Portal',
      icon: Shield,
      href: '/sender',
      active: pathname.startsWith('/sender'),
      color: '#C49A55',
    },
    {
      title: 'Audit Ledger & Log',
      icon: ScrollText,
      href: '/admin/audit',
      active: pathname.startsWith('/admin/audit'),
      color: '#67C7D4',
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/notifications',
      active: pathname === '/notifications',
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      color: '#C49A55',
    },
    {
      title: 'Profile & Memberships',
      icon: User,
      href: '/profile',
      active: pathname === '/profile',
      color: '#F1E7D0',
    },
  ];

  return (
    <>
      {/* Desktop / Tablet Vertical Side Dock (Left Side) with distinctive interactive enlargement */}
      <aside
        aria-label="Side Dock Navigation"
        className="fixed left-5 top-1/2 -translate-y-1/2 z-50 hidden md:block"
      >
        <Dock
          orientation="vertical"
          magnification={60}
          distance={110}
          className="bg-[#141821]/90 backdrop-blur-2xl border-2 border-[#263447] shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-4 px-2.5 rounded-3xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="outline-none">
                <motion.div
                  whileHover={{
                    scale: 1.3,
                    x: 10,
                    boxShadow: `0 0 24px ${item.color}55, 0 0 48px ${item.color}22`,
                    transition: { type: 'spring', stiffness: 450, damping: 16 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-2xl"
                >
                  <DockItem
                    className={cn(
                      'aspect-square rounded-2xl transition-all duration-200 border-2 relative group overflow-hidden',
                      item.active
                        ? 'bg-[#263447] border-[#C49A55] text-[#C49A55] shadow-lg shadow-[#C49A55]/30'
                        : 'bg-[#141821]/95 border-[#263447] text-[#F1E7D0]/75 hover:text-[#F1E7D0] hover:border-[#67C7D4] hover:bg-[#263447]'
                    )}
                  >
                    {/* Glowing background aura upon hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl blur-md"
                      style={{ backgroundColor: `${item.color}25` }}
                    />

                    <DockLabel className="border border-[#C49A55]/50 bg-[#141821]/95 backdrop-blur-md text-[#F1E7D0] shadow-2xl font-mono text-[11px] px-3 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.title}
                      </span>
                    </DockLabel>

                    <DockIcon>
                      <div className="relative flex items-center justify-center w-full h-full">
                        <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-[#141821] bg-[#C49A55] rounded-full border-2 border-[#141821] animate-pulse">
                            {item.badge}
                          </span>
                        )}
                        {item.active && (
                          <span
                            className="absolute -bottom-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{ backgroundColor: item.color, color: item.color }}
                          />
                        )}
                      </div>
                    </DockIcon>
                  </DockItem>
                </motion.div>
              </Link>
            );
          })}
        </Dock>
      </aside>

      {/* Mobile Horizontal Bottom Dock */}
      <nav
        aria-label="Mobile Bottom Dock"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden max-w-[94vw]"
      >
        <Dock
          orientation="horizontal"
          magnification={52}
          distance={85}
          className="bg-[#141821]/95 backdrop-blur-xl border border-[#263447] shadow-2xl px-2 py-1.5 rounded-2xl"
        >
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="outline-none">
                <motion.div
                  whileHover={{ scale: 1.25, y: -6 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <DockItem
                    className={cn(
                      'aspect-square rounded-xl transition-all border',
                      item.active
                        ? 'bg-[#263447] border-[#C49A55] text-[#C49A55]'
                        : 'bg-[#141821] border-[#263447] text-[#F1E7D0]/70'
                    )}
                  >
                    <DockLabel>{item.title}</DockLabel>
                    <DockIcon>
                      <Icon className="w-4 h-4" />
                    </DockIcon>
                  </DockItem>
                </motion.div>
              </Link>
            );
          })}
        </Dock>
      </nav>
    </>
  );
}

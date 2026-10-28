'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Cpu,
  Layers,
  Shield,
  ScrollText,
  Bell,
  User,
  Sparkles,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { cn } from '@/lib/utils';

interface SideDockProps {
  unreadNotifs?: number;
}

export function SideDock({ unreadNotifs = 0 }: SideDockProps) {
  const pathname = usePathname();

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
      {/* Desktop / Tablet Vertical Side Dock (Left Side) */}
      <aside
        aria-label="Side Dock Navigation"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
      >
        <Dock
          orientation="vertical"
          magnification={52}
          distance={100}
          className="bg-[#141821]/85 backdrop-blur-xl border border-[#263447]/90 shadow-2xl py-3 px-2 rounded-2xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="outline-none">
                <DockItem
                  className={cn(
                    'aspect-square rounded-xl transition-all duration-200 border',
                    item.active
                      ? 'bg-[#263447] border-[#C49A55] text-[#C49A55] shadow-md shadow-[#C49A55]/20'
                      : 'bg-[#141821]/90 border-[#263447] text-[#F1E7D0]/70 hover:text-[#F1E7D0] hover:border-[#67C7D4]/50 hover:bg-[#263447]/80'
                  )}
                >
                  <DockLabel>{item.title}</DockLabel>
                  <DockIcon>
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Icon className="w-5 h-5 transition-transform duration-150" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-[#141821] bg-[#C49A55] rounded-full border border-[#141821]">
                          {item.badge}
                        </span>
                      )}
                      {item.active && (
                        <span
                          className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                    </div>
                  </DockIcon>
                </DockItem>
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
          magnification={48}
          distance={80}
          className="bg-[#141821]/90 backdrop-blur-xl border border-[#263447] shadow-2xl px-2 py-1.5 rounded-2xl"
        >
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="outline-none">
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
              </Link>
            );
          })}
        </Dock>
      </nav>
    </>
  );
}

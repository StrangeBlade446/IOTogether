'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <main
      className={`flex-1 flex flex-col relative ${
        isLanding ? 'px-0 py-0' : 'md:pl-24 pb-24 md:pb-12'
      }`}
    >
      {children}
    </main>
  );
}

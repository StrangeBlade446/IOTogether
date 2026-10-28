'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  // Do not display footer on the minimalist landing page
  if (isLanding) {
    return null;
  }

  return (
    <footer
      className={`w-full border-t border-[#263447] bg-[#141821]/90 backdrop-blur-md py-10 mt-auto relative z-20 ${
        isLanding ? 'px-4' : 'md:pl-24 pb-28 md:pb-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="md" showTagline />
            <p className="mt-3 text-xs sm:text-sm text-[#F1E7D0]/70 max-w-md leading-relaxed font-sans font-light">
              Connecting schools, colleges, laboratories, and makerspaces possessing underused electronics inventory with verified student innovators and engineering teams.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#67C7D4] bg-[#263447]/80 border border-[#67C7D4]/30 rounded-lg px-3 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-[#67C7D4]" />
              <span className="font-mono text-[11px]">Keepers &amp; Seekers Handover Protocol Active</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C49A55] mb-3">Guild Portals</h4>
            <ul className="space-y-2 text-xs text-[#F1E7D0]/80">
              <li>
                <Link href="/sender" className="hover:text-[#C49A55] transition-colors flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55]" />
                  Keepers Portal (Hardware Lenders)
                </Link>
              </li>
              <li>
                <Link href="/receiver" className="hover:text-[#67C7D4] transition-colors flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#67C7D4]" />
                  Seekers Portal (Borrowers &amp; Students)
                </Link>
              </li>
              <li>
                <Link href="/receiver/project-recipe" className="hover:text-[#67C7D4] transition-colors">
                  AI-Powered Project Recipes
                </Link>
              </li>
              <li>
                <Link href="/receiver/explore" className="hover:text-[#67C7D4] transition-colors">
                  Cross-Institutional Catalog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#67C7D4] mb-3">Verification &amp; QR</h4>
            <ul className="space-y-2 text-xs text-[#F1E7D0]/80">
              <li>
                <Link href="/sender/requests" className="hover:text-[#C49A55] transition-colors">
                  ID Inspection &amp; Handover QR
                </Link>
              </li>
              <li>
                <Link href="/receiver/bookings" className="hover:text-[#67C7D4] transition-colors">
                  Scan Screen QR &amp; Timers
                </Link>
              </li>
              <li>
                <Link href="/admin/audit" className="hover:text-[#67C7D4] transition-colors">
                  Append-Only Audit Log
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-[#C49A55] transition-colors">
                  Notification Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#263447] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F1E7D0]/50 gap-4">
          <p>
            © {new Date().getFullYear()} IOTogether. Academic Electronics Resource Sharing Network.
          </p>
          <p className="flex items-center gap-1 text-[#F1E7D0]/50 font-mono text-[11px]">
            Engineered for fair, transparent, and verified electronics resource-sharing.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Heart, Sparkles, Building2 } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  // Do not display footer on the minimalist landing page
  if (isLanding) {
    return null;
  }

  return (
    <footer
      className={`w-full border-t border-slate-200 bg-white/95 backdrop-blur-md py-10 mt-auto relative z-20 ${
        isLanding ? 'px-4' : 'md:pl-24 pb-28 md:pb-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Consortium Statement */}
          <div className="sm:col-span-2 md:col-span-1 space-y-3">
            <Logo size="md" showTagline />
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-sans font-normal">
              Inter-institutional academic consortium connecting schools, universities, and makerspaces to share underutilized microcontrollers, sensors, and lab instruments.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-800 bg-cyan-50/80 border border-cyan-200 rounded-lg px-2.5 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
              <span className="font-mono text-[11px] font-semibold">Verified ID Handover Protocol Active</span>
            </div>
          </div>

          {/* Col 2: Seeker Resources */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-800 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" /> Seeker Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-sans">
              <li>
                <Link href="/receiver" className="hover:text-cyan-700 transition-colors font-medium">
                  Seeker 3D Walkable Lab
                </Link>
              </li>
              <li>
                <Link href="/receiver/explore" className="hover:text-cyan-700 transition-colors font-medium">
                  Equipment Catalog (36 Items)
                </Link>
              </li>
              <li>
                <Link href="/receiver/project-recipe" className="hover:text-cyan-700 transition-colors font-medium">
                  Scientific Chef Project Recipes
                </Link>
              </li>
              <li>
                <Link href="/receiver/bookings" className="hover:text-cyan-700 transition-colors">
                  My Bookings &amp; Active Timers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Keeper Custody */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55]" /> Keeper Desk
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-sans">
              <li>
                <Link href="/sender" className="hover:text-amber-700 transition-colors font-medium">
                  Keeper 3D Command Desk
                </Link>
              </li>
              <li>
                <Link href="/sender/requests" className="hover:text-amber-700 transition-colors">
                  ID Verification &amp; Handover QR
                </Link>
              </li>
              <li>
                <Link href="/sender/inventory" className="hover:text-amber-700 transition-colors">
                  Laboratory Inventory Registry
                </Link>
              </li>
              <li>
                <Link href="/sender/loans" className="hover:text-amber-700 transition-colors">
                  Active Loans &amp; Countdown Timers
                </Link>
              </li>
              <li>
                <Link href="/admin/audit" className="hover:text-amber-700 transition-colors">
                  Tamper-Evident Audit Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Consortium Governance, Legal & Help */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-600" /> Consortium
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-sans">
              <li>
                <Link href="/institutions" className="hover:text-slate-900 transition-colors font-medium">
                  Partner Colleges &amp; Schools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors font-medium">
                  Privacy Policy &amp; Data Rights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition-colors font-medium">
                  Custodian Helpdesk &amp; Inquiries
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Academic Portal Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Partners */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} IOTogether Academic Consortium. Apex &bull; Vanguard &bull; Horizon.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <span>&bull;</span>
            <Link href="/receiver/explore" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-navy-950 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="md" showTagline />
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              Connecting schools, colleges, laboratories, and makerspaces possessing underused electronics inventory with verified student innovators and engineering teams.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400/80 bg-cyan-950/40 border border-cyan-900/60 rounded-md px-2.5 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Full RLS Security & Atomic Concurrency Guard Enabled</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-cyan-400 transition-colors">
                  Explore Equipment
                </Link>
              </li>
              <li>
                <Link href="/project-matcher" className="hover:text-cyan-400 transition-colors">
                  Project Compatibility Matcher
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-cyan-400 transition-colors">
                  Participating Institutions
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-cyan-400 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Hackathon Demo</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/manage" className="hover:text-amber-400 transition-colors">
                  Lab Manager Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  Platform Admin
                </Link>
              </li>
              <li>
                <Link href="/admin/audit" className="hover:text-cyan-400 transition-colors">
                  Append-Only Audit Log
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-cyan-400 transition-colors">
                  Real-Time Notifications
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} IOTogether. Fictional demonstration institutions & equipment for Hackathon evaluation.
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for fair, transparent, and verified electronics resource-sharing.
          </p>
        </div>
      </div>
    </footer>
  );
}

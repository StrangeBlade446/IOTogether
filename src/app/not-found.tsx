import React from 'react';
import Link from 'next/link';
import { Compass, Search, Home, ArrowLeft, Plug } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-6 bg-white/90 border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#ba4d2b] animate-ping" />
          <span>STATUS 404 &bull; ASSET DISCONNECTED</span>
        </div>

        {/* Single H1 per Page (Item 6) */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          Laboratory Asset Not Found
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
          The hardware component, booking record, or chamber terminal you are looking for does not exist or has been relocated to another consortium lab.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ba4d2b] hover:bg-[#9d442b] text-white text-xs font-bold transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to 3D Chamber</span>
          </Link>

          <Link
            href="/receiver/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search Equipment Catalog</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
          <Link href="/receiver/project-recipe" className="hover:text-teal-700 transition">
            Project Recipes
          </Link>
          <span>&bull;</span>
          <Link href="/institutions" className="hover:text-amber-800 transition">
            Partner Labs
          </Link>
          <span>&bull;</span>
          <Link href="/contact" className="hover:text-slate-800 transition">
            Custodian Helpdesk
          </Link>
        </div>
      </div>
    </div>
  );
}

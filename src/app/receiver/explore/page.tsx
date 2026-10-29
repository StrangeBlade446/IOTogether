import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { ExploreClient } from '@/app/explore/ExploreClient';
import Link from 'next/link';
import { Sparkles, Cpu, Clock, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function ReceiverExplorePage() {
  const session = await getSession();
  if (session.user.platform_role === 'staff' && !session.isPlatformAdmin) {
    redirect('/sender');
  }

  const resources = db.getResources();
  const institutions = db.getInstitutions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-cyan-950/40 to-neutral-900 border border-cyan-500/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Seeker Equipment Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-100">Search &amp; Filter Electronics Equipment</h1>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl">
            Select items to book. Submit your Student/Teacher ID photo and desired borrowing duration (Days, Hours, Minutes).
            Once manually verified by the Lab Head, scan their Handover QR to activate your countdown timer.
          </p>
        </div>

        <Link
          href="/receiver/project-recipe"
          className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold transition flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <Cpu className="w-4 h-4 text-teal-400" /> Need Project Ideas? Try AI Recipe
        </Link>
      </div>

      <ExploreClient initialResources={resources} institutions={institutions} />
    </div>
  );
}

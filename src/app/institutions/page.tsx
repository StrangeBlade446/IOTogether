import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { getSession } from '@/lib/auth/session';
import { InstitutionsClient } from './InstitutionsClient';
import { Building2, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function InstitutionsPage() {
  const session = await getSession();
  const institutions = db.getInstitutions();
  const memberships = db.getMemberships(session.user.id);
  const resources = db.getResources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-semibold mb-3 border border-cyan-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          Verified Institutional Network
        </div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-cyan-400" />
          Participating Institutions & Makerspaces
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-2xl">
          Discover certified universities, autonomous engineering colleges, and open fabrication makerspaces sharing electronics hardware on IOTogether.
        </p>
      </div>

      <InstitutionsClient
        institutions={institutions}
        memberships={memberships}
        resources={resources}
        currentUserId={session.user.id}
      />
    </div>
  );
}

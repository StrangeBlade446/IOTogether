import React from 'react';
import { db } from '@/lib/db/store';
import { MatcherClient } from './MatcherClient';
import { Cpu, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function ProjectMatcherPage() {
  const resources = db.getResources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Component Compatibility Checker
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Cpu className="w-8 h-8 text-teal-600" />
          Project-to-Inventory Matcher
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Describe your engineering prototype or select a sample build. Our curated compatibility engine maps your requirements directly to available laboratory stock across institutions.
        </p>
      </div>

      <MatcherClient resources={resources} />
    </div>
  );
}

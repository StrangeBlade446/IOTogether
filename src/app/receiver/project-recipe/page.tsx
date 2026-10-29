import React from 'react';
import { db } from '@/lib/db/store';
import { ProjectRecipeClient } from './ProjectRecipeClient';
import { Sparkles, Cpu } from 'lucide-react';

export const revalidate = 0;

export default function ReceiverProjectRecipePage() {
  const resources = db.getResources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> AI Recipe Assistant
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Cpu className="w-7 h-7 text-teal-600" /> AI-Powered Electronics Project Recipes
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
          Choose a pre-tested academic project recipe or describe your custom concept. The AI automatically compiles your Bill of Materials, verifies stock across partner laboratories, gives you wiring pinouts, and lets you book components directly.
        </p>
      </div>

      <ProjectRecipeClient resources={resources} />
    </div>
  );
}

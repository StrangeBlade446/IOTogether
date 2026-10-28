import React from 'react';
import { db } from '@/lib/db/store';
import { ExploreClient } from './ExploreClient';

export const revalidate = 0;

export default function ExplorePage() {
  const resources = db.getResources();
  const institutions = db.getInstitutions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Cross-Institutional Equipment Catalog</h1>
        <p className="mt-2 text-sm text-slate-400">
          Search and discover verified microcontrollers, single-board computers, sensors, and laboratory test instruments available across participating institutions.
        </p>
      </div>

      <ExploreClient initialResources={resources} institutions={institutions} />
    </div>
  );
}

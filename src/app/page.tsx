import React from 'react';
import { db } from '@/lib/db/store';
import { InteractiveScrollSearch } from '@/components/home/InteractiveScrollSearch';

export const revalidate = 0;

export default function HomePage() {
  const resources = db.getResources();
  const institutions = db.getInstitutions();

  return (
    <div className="flex flex-col flex-1 w-full text-[#F1E7D0] selection:bg-[#C49A55]/30 selection:text-[#F1E7D0]">
      <InteractiveScrollSearch
        initialResources={resources}
        institutions={institutions}
      />
    </div>
  );
}

import React from 'react';
import { Scene3DLanding } from '@/components/three/Scene3DLanding';

export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full text-[#0F172A] selection:bg-[#C49A55]/25 selection:text-[#0F172A] relative z-10 overflow-hidden">
      <Scene3DLanding />
    </div>
  );
}

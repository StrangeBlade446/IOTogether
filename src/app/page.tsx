import React from 'react';
import type { Metadata } from 'next';
import { Scene3DLanding } from '@/components/three/Scene3DLanding';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Make a Connection — Interactive 3D Electronics Sharing Platform',
  description:
    'Connect schools and colleges possessing underused electronics equipment with verified students and makers seeking hardware. Interactive 3D cable chamber.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IOTogether — Share Hardware. Build Possibilities.',
    description:
      'Connecting schools, colleges, laboratories, and makerspaces with verified student innovators.',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full text-[#0F172A] selection:bg-[#C49A55]/25 selection:text-[#0F172A] relative z-10 overflow-hidden">
      <Scene3DLanding />
    </div>
  );
}

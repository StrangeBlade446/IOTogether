import React from 'react';
import { InteractiveCableSockets } from '@/components/home/InteractiveCableSockets';

export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full text-[#F1E7D0] selection:bg-[#C49A55]/30 selection:text-[#F1E7D0] relative z-10">
      <InteractiveCableSockets />
    </div>
  );
}

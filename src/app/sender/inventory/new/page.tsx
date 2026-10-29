import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { NewResourceClient } from './NewResourceClient';

export const revalidate = 0;

export default async function SenderNewProductPage() {
  const session = await getSession();

  // Route protection: Seekers cannot access Keeper inventory creation
  if (session.user.platform_role === 'student' && !session.isPlatformAdmin) {
    redirect('/receiver');
  }

  return <NewResourceClient />;
}

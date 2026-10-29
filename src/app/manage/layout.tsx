import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isStaff = session.managedInstitutions.length > 0 || session.isPlatformAdmin;

  if (!isStaff) {
    redirect('/receiver');
  }

  return <>{children}</>;
}

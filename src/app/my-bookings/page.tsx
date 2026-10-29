import React from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { MyBookingsClient } from './MyBookingsClient';
import { Layers } from 'lucide-react';

export const revalidate = 0;

export default async function MyBookingsPage() {
  const session = await getSession();
  const bookings = db.getBookings({ borrowerId: session.user.id });
  const waitlist = db.getWaitlist().filter((w) => w.user_id === session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Layers className="w-8 h-8 text-cyan-600" />
          My Equipment Bookings & Requests
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tracking all reservations, approved pickups, checked-out devices, and return condition reports for{' '}
          <strong className="text-slate-900">{session.user.display_name}</strong>.
        </p>
      </div>

      <MyBookingsClient bookings={bookings} waitlist={waitlist} currentUserId={session.user.id} />
    </div>
  );
}

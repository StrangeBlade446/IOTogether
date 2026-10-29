import React from 'react';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { NotificationsClient } from './NotificationsClient';
import { Bell } from 'lucide-react';

export const revalidate = 0;

export default async function NotificationsPage() {
  const session = await getSession();
  const notifications = db.getNotifications(session.user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Bell className="w-8 h-8 text-cyan-600" />
          Notifications & Activity Alerts
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          In-app transaction updates, approval notices, handover confirmations, and return reminders for{' '}
          <strong className="text-slate-900">{session.user.display_name}</strong>.
        </p>
      </div>

      <NotificationsClient notifications={notifications} currentUserId={session.user.id} />
    </div>
  );
}

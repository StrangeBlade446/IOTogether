import React from 'react';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { NotificationsClient } from './NotificationsClient';
import { Bell } from 'lucide-react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Consortium Activity Alerts & Notifications',
  description:
    'Real-time notifications, photo ID review updates, QR handover confirmations, and return status alerts.',
  alternates: {
    canonical: '/notifications',
  },
};

export default async function NotificationsPage() {
  const session = await getSession();
  const userNotifications = db.getNotifications(session.user.id);
  const allNotifications = db.getAllNotifications();

  const isSeeker = session.user.platform_role === 'student';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-300">
      <Breadcrumbs
        items={[
          { label: isSeeker ? 'Seeker Portal' : 'Keeper Portal', href: isSeeker ? '/receiver' : '/sender' },
          { label: 'Notifications & Alerts' },
        ]}
      />

      <div className="mt-4 mb-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-900 border border-cyan-200 mb-2 font-mono">
              <Bell className="w-3.5 h-3.5 text-cyan-700" />
              Real-time Academic Alerts
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications & Activity Alerts
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              Transaction updates, photo ID review approvals, QR code handovers, countdown timers, and return confirmations for{' '}
              <strong className="text-slate-950 font-bold">{session.user.display_name}</strong> ({session.user.institute_name || 'Academic Consortium'}).
            </p>
          </div>
        </div>
      </div>

      <NotificationsClient
        initialUserNotifications={userNotifications}
        initialAllNotifications={allNotifications}
        currentUserId={session.user.id}
        currentUserName={session.user.display_name}
      />
    </div>
  );
}

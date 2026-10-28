'use client';

import React from 'react';
import Link from 'next/link';
import { Notification } from '@/types/database';
import { formatDateTime } from '@/lib/utils';
import { Bell, CheckCircle2, Info, AlertTriangle, ArrowRight } from 'lucide-react';

interface NotificationsClientProps {
  notifications: Notification[];
  currentUserId: string;
}

export function NotificationsClient({ notifications, currentUserId }: NotificationsClientProps) {
  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No notifications yet. You will receive real-time alerts when your booking requests are approved or updated.
        </div>
      ) : (
        notifications.map((n) => {
          const isUnread = !n.read_at;

          return (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isUnread
                  ? 'bg-slate-900 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    isUnread ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${isUnread ? 'text-white' : 'text-slate-300'}`}>{n.title}</h3>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">{formatDateTime(n.created_at)}</span>
                </div>
              </div>

              {n.related_booking_id && (
                <Link
                  href={`/my-bookings/${n.related_booking_id}`}
                  className="px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 self-end sm:self-center"
                >
                  View Booking
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

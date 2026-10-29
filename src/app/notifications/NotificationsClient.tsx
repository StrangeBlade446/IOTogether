'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Notification } from '@/types/database';
import { formatDateTime } from '@/lib/utils';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  QrCode,
  Clock,
  Inbox,
  CheckCheck,
  Building2,
  Compass,
} from 'lucide-react';

interface NotificationsClientProps {
  initialUserNotifications: Notification[];
  initialAllNotifications: Notification[];
  currentUserId: string;
  currentUserName: string;
}

export function NotificationsClient({
  initialUserNotifications,
  initialAllNotifications,
  currentUserId,
  currentUserName,
}: NotificationsClientProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [userNotifs, setUserNotifs] = useState<Notification[]>(initialUserNotifications);
  const [allNotifs, setAllNotifs] = useState<Notification[]>(initialAllNotifications);
  const [markedAllRead, setMarkedAllRead] = useState(false);

  const displayedNotifs = activeTab === 'my' ? userNotifs : allNotifs;
  const unreadCount = userNotifs.filter((n) => !n.read_at && !markedAllRead).length;

  const handleMarkAllRead = () => {
    setMarkedAllRead(true);
    setUserNotifs((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    setAllNotifs((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
  };

  const getEventBadge = (eventType?: string, title?: string) => {
    const t = (eventType || title || '').toLowerCase();
    if (t.includes('qr') || t.includes('handover') || t.includes('issued')) {
      return {
        label: 'Handover QR',
        icon: QrCode,
        badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
        iconClass: 'bg-cyan-600 text-white',
      };
    }
    if (t.includes('return') || t.includes('completed')) {
      return {
        label: 'Return Verified',
        icon: CheckCircle2,
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        iconClass: 'bg-emerald-600 text-white',
      };
    }
    if (t.includes('approved') || t.includes('verified') || t.includes('id')) {
      return {
        label: 'ID Verified',
        icon: ShieldCheck,
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        iconClass: 'bg-amber-600 text-white',
      };
    }
    if (t.includes('incident') || t.includes('damaged') || t.includes('rejected')) {
      return {
        label: 'Review Alert',
        icon: AlertTriangle,
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        iconClass: 'bg-rose-600 text-white',
      };
    }
    return {
      label: 'Consortium Update',
      icon: Bell,
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      iconClass: 'bg-indigo-600 text-white',
    };
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Tabs & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Direct Alerts</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                unreadCount > 0 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {userNotifs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Consortium Activity Feed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700">
              {allNotifs.length}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={markedAllRead || unreadCount === 0}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-center"
        >
          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>{markedAllRead ? 'All Read' : 'Mark All as Read'}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayedNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">No Notifications in this View</h3>
              <p className="text-xs text-slate-700 mt-1 max-w-md mx-auto">
                You will receive alerts when your equipment booking requests are reviewed, QR code handovers are verified, or items are returned.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold shadow-sm hover:bg-cyan-700 transition"
            >
              <span>View All Consortium Activity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          displayedNotifs.map((n) => {
            const isUnread = !n.read_at && !markedAllRead;
            const badge = getEventBadge(n.event_type, n.title);
            const IconComponent = badge.icon;

            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                  isUnread
                    ? 'bg-white border-cyan-400 ring-1 ring-cyan-200/50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 shadow-sm ${badge.iconClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-md border ${badge.badgeClass}`}>
                        {badge.label}
                      </span>

                      <h2 className="text-sm font-bold text-slate-950 leading-snug">
                        {n.title}
                      </h2>

                      {isUnread && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed max-w-2xl">
                      {n.message}
                    </p>

                    <span className="text-[11px] text-slate-600 font-mono block pt-0.5">
                      {formatDateTime(n.created_at)}
                    </span>
                  </div>
                </div>

                {n.related_booking_id && (
                  <Link
                    href={`/receiver/bookings`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 shrink-0 self-end sm:self-center group"
                  >
                    <span>View Booking &amp; Timer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

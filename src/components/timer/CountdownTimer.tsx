'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export function CountdownTimer({ targetDate, label = 'Time Remaining to Deadline', size = 'md', compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
    totalSecondsRemaining: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOverdue: false,
    totalSecondsRemaining: 0,
  });

  useEffect(() => {
    function calculate() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOverdue: true,
          totalSecondsRemaining: 0,
        });
        return;
      }

      const totalSecondsRemaining = Math.floor(diff / 1000);
      const days = Math.floor(totalSecondsRemaining / (3600 * 24));
      const hours = Math.floor((totalSecondsRemaining % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
      const seconds = totalSecondsRemaining % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isOverdue: false,
        totalSecondsRemaining,
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    if (timeLeft.isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/60 text-red-400 border border-red-800 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
        </span>
      );
    }
    const isUrgent = timeLeft.totalSecondsRemaining < 3600 * 3; // < 3h
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
          isUrgent
            ? 'bg-amber-950/60 text-amber-300 border-amber-700 animate-pulse'
            : 'bg-cyan-950/50 text-cyan-300 border-cyan-800/80'
        }`}
      >
        <Clock className="w-3.5 h-3.5" />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {pad(timeLeft.hours)}h:{pad(timeLeft.minutes)}m:{pad(timeLeft.seconds)}s
      </span>
    );
  }

  if (timeLeft.isOverdue) {
    return (
      <div className="bg-red-950/40 border-2 border-red-600/70 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-red-400 font-semibold mb-1">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span>LOAN DEADLINE EXPIRED</span>
        </div>
        <p className="text-xs text-red-300/80">
          Equipment was due on {new Date(targetDate).toLocaleString()}. Please coordinate immediate safe return or extension.
        </p>
      </div>
    );
  }

  const isUrgent = timeLeft.totalSecondsRemaining < 3600 * 6; // < 6 hours

  return (
    <div
      className={`rounded-xl border p-4 ${
        isUrgent
          ? 'bg-gradient-to-br from-amber-950/40 via-neutral-900 to-amber-950/20 border-amber-600/60'
          : 'bg-gradient-to-br from-cyan-950/30 via-neutral-900 to-slate-900 border-cyan-700/50 shadow-lg shadow-cyan-950/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">{label}</span>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
            isUrgent ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
          }`}
        >
          {isUrgent ? 'Attention Required' : 'Active Loan'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center py-1">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2">
          <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">{timeLeft.days}</div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Days</div>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2">
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 tracking-tight">{pad(timeLeft.hours)}</div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Hours</div>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2">
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 tracking-tight">{pad(timeLeft.minutes)}</div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Mins</div>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2">
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 tracking-tight">{pad(timeLeft.seconds)}</div>
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Secs</div>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
        Return due strictly before: <span className="text-neutral-200 font-medium">{new Date(targetDate).toLocaleString()}</span>
      </div>
    </div>
  );
}

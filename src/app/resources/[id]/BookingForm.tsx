'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Resource } from '@/types/database';
import { requestBookingAction, joinWaitlistAction } from '@/app/actions/booking';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BookingFormProps {
  resource: Resource;
  currentUserId: string;
  currentUserName: string;
  hasTrainingCertificate: boolean;
}

export function BookingForm({ resource, currentUserId, currentUserName, hasTrainingCertificate }: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tomorrow as default start, +3 days as default due
  const getDefaultDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const due = new Date(start);
    due.setDate(due.getDate() + Math.max(1, resource.min_loan_duration));
    return {
      startStr: start.toISOString().split('T')[0],
      dueStr: due.toISOString().split('T')[0],
    };
  };

  const defaults = getDefaultDates();
  const [startAt, setStartAt] = useState(defaults.startStr);
  const [dueAt, setDueAt] = useState(defaults.dueStr);
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [rulesAcknowledged, setRulesAcknowledged] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictOccurred, setConflictOccurred] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Price & Duration Calculation
  const calculation = useMemo(() => {
    const s = new Date(startAt);
    const d = new Date(dueAt);
    if (isNaN(s.getTime()) || isNaN(d.getTime()) || d <= s) {
      return { days: 0, rentalChargePaise: 0, depositPaise: 0, totalPaise: 0, valid: false };
    }

    const diffMs = d.getTime() - s.getTime();
    const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const rentalChargePaise = resource.daily_rate_paise * quantity * days;
    const depositPaise = resource.deposit_paise * quantity;
    const totalPaise = rentalChargePaise + depositPaise;

    return {
      days,
      rentalChargePaise,
      depositPaise,
      totalPaise,
      valid: days >= resource.min_loan_duration && days <= resource.max_loan_duration,
    };
  }, [startAt, dueAt, quantity, resource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConflictOccurred(false);

    if (!hasTrainingCertificate) {
      setErrorMessage('Prerequisite training certification required for this equipment before submitting a request.');
      return;
    }

    if (!rulesAcknowledged) {
      setErrorMessage('You must acknowledge the usage and return policy rules.');
      return;
    }

    if (!purpose.trim()) {
      setErrorMessage('Please provide a brief project purpose or reason for borrowing.');
      return;
    }

    startTransition(async () => {
      const res = await requestBookingAction({
        resourceId: resource.id,
        quantity,
        startAt: new Date(startAt).toISOString(),
        dueAt: new Date(dueAt).toISOString(),
        purpose,
        rulesAcknowledged,
      });

      if (!res.success) {
        if (res.conflict) {
          setConflictOccurred(true);
        }
        setErrorMessage(res.error || 'Failed to submit booking request');
      } else if (res.booking) {
        setSuccessBookingId(res.booking.id);
      }
    });
  };

  const handleJoinWaitlist = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await joinWaitlistAction({
        resourceId: resource.id,
        quantity,
        priorityReason: purpose || 'Academic project reservation',
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to join waitlist');
      } else {
        setWaitlistSuccess(true);
      }
    });
  };

  if (successBookingId) {
    return (
      <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center animate-in fade-in duration-200">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">Booking Request Submitted!</h4>
        <p className="text-xs text-slate-300 mt-2">
          Your request for {quantity}x {resource.name} has been securely registered.
          The institution manager has been notified to review and approve your reservation.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => router.push(`/my-bookings`)}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            View in My Bookings
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSuccessBookingId(null);
              router.refresh();
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors py-1"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  if (waitlistSuccess) {
    return (
      <div className="p-6 rounded-xl bg-cyan-950/60 border border-cyan-800 text-center animate-in fade-in duration-200">
        <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">Added to Equipment Waitlist!</h4>
        <p className="text-xs text-slate-300 mt-2">
          You are queued in fair FIFO priority order. You will be automatically notified once the currently checked-out unit is returned and inspected.
        </p>
        <button
          onClick={() => router.push('/my-bookings')}
          className="mt-4 w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
        >
          Check My Waitlist Status
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
            {conflictOccurred && (
              <div className="mt-2 pt-2 border-t border-rose-900/60 flex items-center justify-between">
                <span>Want to join the waitlist instead?</span>
                <button
                  type="button"
                  onClick={handleJoinWaitlist}
                  disabled={isPending}
                  className="px-2.5 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Range Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Pickup Date</label>
          <div className="relative">
            <input
              type="date"
              value={startAt}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartAt(e.target.value)}
              required
              className="w-full bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Return Due Date</label>
          <div className="relative">
            <input
              type="date"
              value={dueAt}
              min={startAt}
              onChange={(e) => setDueAt(e.target.value)}
              required
              className="w-full bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-semibold text-slate-300">Requested Quantity</label>
          <span className="text-[11px] text-slate-400">Total in inventory: {resource.total_quantity}</span>
        </div>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          {Array.from({ length: Math.max(1, resource.total_quantity) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'unit' : 'units'}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Project Purpose & Course Context</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., IoT weather telemetry node for Semester 6 Microcontroller Lab project."
          rows={2}
          required
          className="w-full bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Live Estimated Price Breakdown */}
      <div className="p-3 rounded-xl bg-navy-850 border border-slate-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Loan Duration:</span>
          <span className="font-semibold text-white">{calculation.days} days</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Rental Charge:</span>
          <span className="font-semibold text-white">
            {calculation.rentalChargePaise > 0 ? formatCurrency(calculation.rentalChargePaise, false) : 'Free (₹0)'}
          </span>
        </div>
        {calculation.depositPaise > 0 && (
          <div className="flex items-center justify-between text-slate-400">
            <span>Refundable Deposit:</span>
            <span className="font-semibold text-amber-300">
              {formatCurrency(calculation.depositPaise, false)}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold">
          <span className="text-white">Estimated Payable:</span>
          <span className="text-cyan-400 text-sm">
            {calculation.totalPaise > 0 ? formatCurrency(calculation.totalPaise, false) : 'Free'}
          </span>
        </div>
      </div>

      {/* Usage Policy Checkbox */}
      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="rules"
          checked={rulesAcknowledged}
          onChange={(e) => setRulesAcknowledged(e.target.checked)}
          className="mt-0.5 rounded border-slate-700 bg-navy-850 text-cyan-500 focus:ring-0"
        />
        <label htmlFor="rules" className="text-[11px] text-slate-400 leading-tight">
          I agree to inspect equipment upon handover, use it safely within institution guidelines, and return it on or before the due date.
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          type="submit"
          disabled={isPending || !calculation.valid}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          {isPending ? 'Validating Stock & Submitting...' : 'Submit Booking Request'}
        </button>

        <button
          type="button"
          onClick={handleJoinWaitlist}
          disabled={isPending}
          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          Join Waitlist Instead
        </button>
      </div>
    </form>
  );
}

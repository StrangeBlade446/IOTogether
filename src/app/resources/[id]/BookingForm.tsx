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
  const [durationDays, setDurationDays] = useState(3);
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);

  // Student / Teacher ID Card state
  const sampleStudentId = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80';
  const sampleTeacherId = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  const [idCardImageUrl, setIdCardImageUrl] = useState<string>(sampleStudentId);
  const [idCardType, setIdCardType] = useState<'student' | 'teacher' | 'custom'>('student');

  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [rulesAcknowledged, setRulesAcknowledged] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictOccurred, setConflictOccurred] = useState(false);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Auto-calculate Return Due Date whenever startAt or duration (days/hours/minutes) change
  const effectiveDueDate = useMemo(() => {
    const s = new Date(startAt);
    if (isNaN(s.getTime())) return new Date();
    const totalMinutes = (Number(durationDays) || 0) * 1440 + (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
    return new Date(s.getTime() + (totalMinutes > 0 ? totalMinutes : 1440) * 60 * 1000);
  }, [startAt, durationDays, durationHours, durationMinutes]);

  // Price & Duration Calculation
  const calculation = useMemo(() => {
    const s = new Date(startAt);
    const d = effectiveDueDate;
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
  }, [startAt, effectiveDueDate, quantity, resource]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setIdCardImageUrl(reader.result);
          setIdCardType('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConflictOccurred(false);

    if (!idCardImageUrl) {
      setErrorMessage('Please upload or select your Student ID or Teacher ID picture for Lab Head verification.');
      return;
    }

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
        dueAt: effectiveDueDate.toISOString(),
        durationDays: Number(durationDays),
        durationHours: Number(durationHours),
        durationMinutes: Number(durationMinutes),
        idCardImageUrl,
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
          Your request for {quantity}x {resource.name} has been securely submitted with your ID card picture.
        </p>

        {/* User request notice requirement */}
        <div className="mt-4 p-3 bg-neutral-900 border border-cyan-500/50 rounded-xl text-left">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
            <Clock className="w-4 h-4" /> Crucial Pickup Handover Rule
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            When approved, <span className="font-semibold text-white underline">equipment will ONLY be handed over to the student or teacher whose verified ID card matches</span> at pickup.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            At pickup, the Lab Head will present a Handover QR code which you must scan to activate your countdown timer.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => router.push(`/receiver/bookings`)}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            View in Receiver Bookings
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
          onClick={() => router.push('/receiver/bookings')}
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

      {/* Student / Teacher ID Verification Upload */}
      <div className="p-3.5 bg-neutral-900/90 border border-cyan-500/40 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Student or Teacher ID Picture
          </label>
          <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            Required for Lab Head Verification
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Upload your institutional ID card. The Lab Head will inspect this picture before manual verification.
        </p>

        {/* Quick Presets or Custom Upload */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIdCardType('student');
              setIdCardImageUrl(sampleStudentId);
            }}
            className={`p-1.5 text-[11px] font-medium rounded-lg border text-center transition ${
              idCardType === 'student'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                : 'bg-neutral-850 text-slate-400 border-neutral-800 hover:text-white'
            }`}
          >
            Student ID
          </button>
          <button
            type="button"
            onClick={() => {
              setIdCardType('teacher');
              setIdCardImageUrl(sampleTeacherId);
            }}
            className={`p-1.5 text-[11px] font-medium rounded-lg border text-center transition ${
              idCardType === 'teacher'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                : 'bg-neutral-850 text-slate-400 border-neutral-800 hover:text-white'
            }`}
          >
            Teacher ID
          </button>
          <label className="p-1.5 text-[11px] font-medium rounded-lg border text-center transition cursor-pointer bg-neutral-850 text-slate-300 border-neutral-800 hover:border-slate-600 flex items-center justify-center">
            Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* ID Preview */}
        {idCardImageUrl && (
          <div className="flex items-center gap-3 p-2 bg-neutral-950 rounded-lg border border-neutral-800">
            <img
              src={idCardImageUrl}
              alt="ID Card Preview"
              className="w-16 h-12 object-cover rounded border border-slate-700 shrink-0"
            />
            <div className="text-[11px] truncate flex-1">
              <span className="font-semibold text-slate-200">
                {idCardType === 'student' ? 'Student ID Card (Aarav Sharma)' : idCardType === 'teacher' ? 'Faculty / Teacher ID Card' : 'Custom Uploaded ID Photo'}
              </span>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Attached for Lab Head inspection
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pickup Date */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Pickup Start Date</label>
        <input
          type="date"
          value={startAt}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setStartAt(e.target.value)}
          required
          className="w-full bg-navy-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Receiver Settable Duration in Days, Hours, Minutes */}
      <div className="p-3 bg-neutral-900 border border-slate-800 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Desired Borrowing Duration
          </label>
          <span className="text-[10px] text-slate-400">Subject to sender approval</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Days</label>
            <input
              type="number"
              min="0"
              max="60"
              value={durationDays}
              onChange={(e) => setDurationDays(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-navy-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 text-center font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              value={durationHours}
              onChange={(e) => setDurationHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              className="w-full bg-navy-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 text-center font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-0.5">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-full bg-navy-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 text-center font-mono font-bold"
            />
          </div>
        </div>

        <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
          <span>Estimated Return Deadline:</span>
          <span className="font-semibold text-cyan-300 font-mono text-[11px]">
            {effectiveDueDate.toLocaleDateString()} {effectiveDueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
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

      {/* Mandatory Handover Notice Banner */}
      <div className="p-2.5 bg-amber-950/40 border border-amber-700/60 rounded-xl text-[11px] text-amber-200 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Important Verification Requirement:
        </div>
        <p className="text-[10px] text-amber-200/90 leading-relaxed">
          The student or teacher whose ID is verified will <strong>ONLY</strong> be handed over with the equipment at physical pickup.
        </p>
      </div>

      {/* Live Estimated Price Breakdown */}
      <div className="p-3 rounded-xl bg-navy-850 border border-slate-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Loan Duration:</span>
          <span className="font-semibold text-white">
            {durationDays}d {durationHours}h {durationMinutes}m ({calculation.days} billable days)
          </span>
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
          I agree to present my matching verified ID card at pickup, scan the Lab Head&apos;s QR code to start my countdown timer, and return all components before the deadline.
        </label>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          type="submit"
          disabled={isPending || !calculation.valid}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          {isPending ? 'Validating Stock & Submitting...' : 'Submit Booking Request with ID Card'}
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

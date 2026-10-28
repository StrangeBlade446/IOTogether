'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Institution, ResourceCategory, ResourceCondition, EligibilityPolicy } from '@/types/database';
import { createResourceAction } from '@/app/actions/inventory';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface NewResourceFormProps {
  institutions: Institution[];
}

export function NewResourceForm({ institutions }: NewResourceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || '');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('microcontrollers');
  const [description, setDescription] = useState('');
  const [locationDescription, setLocationDescription] = useState('Laboratory Cabinet 3, Shelf B');
  const [imageUrl, setImageUrl] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(5);
  const [dailyRateRupees, setDailyRateRupees] = useState(0);
  const [depositRupees, setDepositRupees] = useState(0);
  const [condition, setCondition] = useState<ResourceCondition>('excellent');
  const [minLoanDuration, setMinLoanDuration] = useState(1);
  const [maxLoanDuration, setMaxLoanDuration] = useState(14);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [trainingRequired, setTrainingRequired] = useState(false);
  const [eligibilityPolicy, setEligibilityPolicy] = useState<EligibilityPolicy>('verified_members_only');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Equipment name is required');
      return;
    }

    startTransition(async () => {
      const res = await createResourceAction({
        institutionId,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description,
        specifications: {
          added_at: new Date().toLocaleDateString(),
          initial_condition: condition,
        },
        imageUrl: imageUrl.trim() || undefined,
        totalQuantity,
        dailyRatePaise: Math.round(dailyRateRupees * 100),
        depositPaise: Math.round(depositRupees * 100),
        condition,
        locationDescription,
        minLoanDuration,
        maxLoanDuration,
        approvalRequired,
        trainingRequired,
        eligibilityPolicy,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to list equipment');
      } else {
        router.push('/manage/inventory');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Institution Selector */}
      <div>
        <label className="block text-slate-300 font-semibold mb-1">Owning Institution</label>
        <select
          value={institutionId}
          onChange={(e) => setInstitutionId(e.target.value)}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        >
          {institutions.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.city})
            </option>
          ))}
        </select>
      </div>

      {/* Name and Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Equipment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. STM32 Nucleo-F401RE Development Board"
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Hardware Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="microcontrollers">Microcontrollers (Arduino, ESP32, etc.)</option>
            <option value="single_board_computers">Single-Board Computers (Raspberry Pi, etc.)</option>
            <option value="sensors">Sensors (Climate, Motion, Gas, Optical)</option>
            <option value="actuators_motors">Actuators & Motors (Servos, Steppers)</option>
            <option value="prototyping">Prototyping (Breadboards, Wiring, Modules)</option>
            <option value="test_equipment">Test & Measurement (Oscilloscopes, DMMs)</option>
            <option value="robotics">Robotics Kits & Chassis</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-slate-300 font-semibold mb-1">Detailed Technical Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Specifications, pinouts, clock speeds, and lab usage recommendations..."
          rows={3}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      {/* Image URL & Collection Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Image URL (Optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Physical Collection Location</label>
          <input
            type="text"
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            placeholder="Room 201, Locker 4B"
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Total Stock Quantity</label>
          <input
            type="number"
            min={1}
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(Number(e.target.value))}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Daily Rental (₹ INR, 0 for Free)</label>
          <input
            type="number"
            min={0}
            step={5}
            value={dailyRateRupees}
            onChange={(e) => setDailyRateRupees(Number(e.target.value))}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Refundable Deposit (₹ INR)</label>
          <input
            type="number"
            min={0}
            step={50}
            value={depositRupees}
            onChange={(e) => setDepositRupees(Number(e.target.value))}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>
      </div>

      {/* Policies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Initial Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as any)}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="brand_new">Brand New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Min Loan (Days)</label>
          <input
            type="number"
            min={1}
            value={minLoanDuration}
            onChange={(e) => setMinLoanDuration(Number(e.target.value))}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Max Loan (Days)</label>
          <input
            type="number"
            min={minLoanDuration}
            value={maxLoanDuration}
            onChange={(e) => setMaxLoanDuration(Number(e.target.value))}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Checkbox Flags */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4 border-t border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={approvalRequired}
            onChange={(e) => setApprovalRequired(e.target.checked)}
            className="rounded border-slate-700 bg-navy-850 text-cyan-500"
          />
          <span className="text-slate-300">Staff Approval Required before Issue</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trainingRequired}
            onChange={(e) => setTrainingRequired(e.target.checked)}
            className="rounded border-slate-700 bg-navy-850 text-amber-500"
          />
          <span className="text-amber-300">Requires Verified Safety / Tool Training Certification</span>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          {isPending ? 'Publishing...' : 'Publish Equipment to Catalog'}
        </button>
      </div>
    </form>
  );
}

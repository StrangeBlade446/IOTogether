'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionType, SharingPolicy } from '@/types/database';
import { registerInstitutionAction } from '@/app/actions/inventory';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function RegisterInstitutionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('college');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [sharingPolicy, setSharingPolicy] = useState<SharingPolicy>('open_to_verified');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await registerInstitutionAction({
        name,
        institutionType,
        city,
        address,
        description,
        sharingPolicy,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to submit application');
      } else {
        setIsSuccess(true);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Application Submitted for Review!</h3>
        <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
          Your institution registration is now in pending review status. A platform administrator will review your application before publishing your public equipment catalog.
        </p>
        <button
          onClick={() => router.push('/institutions')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
        >
          View Institutions Directory
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Institution Legal Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Apex Institute of Embedded Technology"
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Institution Type</label>
          <select
            value={institutionType}
            onChange={(e) => setInstitutionType(e.target.value as any)}
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="university">Research University</option>
            <option value="college">Autonomous Engineering College</option>
            <option value="makerspace">Community Makerspace / FabLab</option>
            <option value="lab">Specialized R&D Testing Laboratory</option>
            <option value="school">Polytechnic / Technical School</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">City / Region</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Chennai"
            className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Campus / Department Collection Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Department of Electronics, Lab Block 3, Tech Road"
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Laboratory Profile & Equipment Scope</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your lab focus, available prototyping resources, and sharing goals..."
          rows={3}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Preferred Resource Sharing Policy</label>
        <select
          value={sharingPolicy}
          onChange={(e) => setSharingPolicy(e.target.value as any)}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="open_to_verified">Open to All Verified Network Students (Recommended)</option>
          <option value="open_to_all">Open to Any Registered Borrower</option>
          <option value="internal_only">Internal Enrolled Students Only</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all mt-4"
      >
        {isPending ? 'Submitting Application...' : 'Submit Institution Application'}
      </button>
    </form>
  );
}

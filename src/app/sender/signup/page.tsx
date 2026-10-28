'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { senderSignupAction } from '@/app/actions/auth';
import { ShieldCheck, UserPlus, AlertCircle, Building } from 'lucide-react';

export default function SenderSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    post: 'Head of Electronics Lab',
    idNumber: '',
    instituteName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await senderSignupAction(formData);
      if (res.success) {
        router.push('/sender');
      } else {
        setError(res.error || 'Failed to complete sender registration');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Sender Platform
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Lab Head & Assigner Registration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Register your academic laboratory to list resources, verify borrower photo IDs, and manage equipment checkouts.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Prof. Ananya Roy"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Post / Institutional Designation</label>
          <select
            value={formData.post}
            onChange={(e) => setFormData({ ...formData, post: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="Head of Electronics Lab">Head of Electronics & Embedded Systems Lab</option>
            <option value="Makerspace Lead & Equipment Assigner">Makerspace Lead & Equipment Assigner</option>
            <option value="Professor & Department Chair">Professor & Department Chair</option>
            <option value="Laboratory Scientific Officer">Laboratory Scientific Officer / Technician</option>
            <option value="Department Inventory Coordinator">Department Inventory Coordinator</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Staff / Employee ID Number</label>
          <input
            type="text"
            required
            value={formData.idNumber}
            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            placeholder="e.g. FAC-NIT-104"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Institution / College Name</label>
          <input
            type="text"
            required
            value={formData.instituteName}
            onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
            placeholder="e.g. Northstar Institute of Technology"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Official Institutional Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ananya.roy@nit.edu"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
          <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            As Lab Head, you will review student and teacher ID card photos, approve loan durations, click Manual Verified, and present Handover QR codes for physical checkout.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> {loading ? 'Registering Lab...' : 'Register as Lab Head'}
        </button>

        <div className="text-center pt-2 border-t border-neutral-800 text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/sender/login" className="text-amber-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}

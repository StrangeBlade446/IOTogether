'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { receiverSignupAction } from '@/app/actions/auth';
import { Sparkles, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ReceiverSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    post: 'Student',
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
      const res = await receiverSignupAction(formData);
      if (res.success) {
        router.push('/receiver');
      } else {
        setError(res.error || 'Failed to complete registration');
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Receiver Portal
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Student / Teacher Registration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Join the academic electronics sharing network to borrow verified laboratory resources.
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
            placeholder="e.g. Aarav Sharma"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Post / Academic Role</label>
          <select
            value={formData.post}
            onChange={(e) => setFormData({ ...formData, post: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Student">Student (Undergraduate / Diploma)</option>
            <option value="Postgraduate Scholar">Postgraduate Scholar / M.Tech</option>
            <option value="Teacher / Faculty Guide">Teacher / Faculty Guide</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Research Scholar">Research Scholar</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Student ID / Teacher ID Number</label>
          <input
            type="text"
            required
            value={formData.idNumber}
            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            placeholder="e.g. STU-NIT-2024-819"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[10px] text-slate-400 mt-0.5">
            Must match the institutional photo ID card you submit during bookings.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Institute / College Name</label>
          <input
            type="text"
            required
            value={formData.instituteName}
            onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
            placeholder="e.g. Northstar Institute of Technology"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@college.edu"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Equipment can only be physically collected by the verified ID holder after the Lab Head confirms your booking with a Handover QR code.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> {loading ? 'Registering...' : 'Register as Receiver'}
        </button>

        <div className="text-center pt-2 border-t border-neutral-800 text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/receiver/login" className="text-cyan-400 hover:underline font-semibold">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { receiverSignupAction } from '@/app/actions/auth';
import { Compass, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

export default function SeekerSignupPage() {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#263447] text-[#67C7D4] border border-[#67C7D4]/30 mb-2">
          <Compass className="w-3.5 h-3.5" /> Seeker Platform
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#F1E7D0] tracking-tight">Register as a Seeker</h1>
        <p className="text-xs text-[#F1E7D0]/70 mt-1 font-sans">
          Join the electronics sharing network to borrow verified laboratory equipment, sensors, and microcontrollers.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#263447] border border-[#263447] rounded-2xl p-6 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ada Lovelace"
            required
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] placeholder-[#F1E7D0]/40 focus:outline-none focus:border-[#67C7D4]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Role / Post</label>
          <select
            value={formData.post}
            onChange={(e) => setFormData({ ...formData, post: e.target.value })}
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] focus:outline-none focus:border-[#67C7D4]"
          >
            <option value="Student">Student (Undergraduate / Postgraduate)</option>
            <option value="School Student">School / STEM Student</option>
            <option value="Teacher / Faculty Mentor">Teacher / Faculty Mentor</option>
            <option value="Project Team Lead">Project Team Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Student / Teacher ID Number</label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            placeholder="e.g. STU-2024-901"
            required
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] placeholder-[#F1E7D0]/40 focus:outline-none focus:border-[#67C7D4]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Institution Name</label>
          <input
            type="text"
            value={formData.instituteName}
            onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
            placeholder="e.g. Vanguard Engineering College"
            required
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] placeholder-[#F1E7D0]/40 focus:outline-none focus:border-[#67C7D4]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Institutional Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. student@institution.edu"
            required
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] placeholder-[#F1E7D0]/40 focus:outline-none focus:border-[#67C7D4]"
          />
        </div>

        <div className="p-3 bg-[#141821] border border-[#263447] rounded-xl text-[11px] text-[#F1E7D0]/70 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#67C7D4] shrink-0 mt-0.5" />
          <span>
            Equipment can only be physically collected by the verified ID holder after the Lab Head confirms your booking and you scan their Handover QR code.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#67C7D4] hover:bg-[#7ed2dd] disabled:opacity-50 text-[#141821] font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> {loading ? 'Registering...' : 'Register as Seeker'}
        </button>

        <div className="text-center pt-2 border-t border-[#141821] text-xs text-[#F1E7D0]/60">
          Already registered?{' '}
          <Link href="/receiver/login" className="text-[#67C7D4] hover:underline font-semibold">
            Seeker Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

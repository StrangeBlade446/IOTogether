'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';
import { AlertCircle } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/auth/unavailable');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Verma"
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Academic / Institutional Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. rahul@university.edu"
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Borrower Category</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-navy-850 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="student">Undergraduate / Postgraduate Student</option>
          <option value="staff">Lab Researcher / Project Assistant</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all mt-2"
      >
        {isPending ? 'Creating Account...' : 'Complete Registration'}
      </button>
    </form>
  );
}

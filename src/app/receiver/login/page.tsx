'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, switchDemoUser } from '@/app/actions/auth';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { Sparkles, LogIn, ArrowRight, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ReceiverLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const receiverDemoUsers = DEMO_USERS.filter((u) => u.platformType === 'receiver');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(email);
      if (res.success) {
        router.push('/receiver');
      } else {
        setError(res.error || 'Failed to sign in');
      }
    } catch (err: any) {
      setError(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (userId: string) => {
    setLoading(true);
    try {
      await switchDemoUser(userId, '/receiver');
    } catch {
      router.push('/receiver');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Receiver Portal
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Student & Teacher Sign In</h1>
        <p className="text-xs text-slate-400 mt-1">
          Access electronics equipment discovery, AI project recipes, and booking requests.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Switch Demo Receivers */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-6 space-y-3 shadow-lg">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-cyan-400" /> One-Click Receiver Demo Sign In
        </h2>
        <div className="space-y-2">
          {receiverDemoUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleQuickSwitch(u.id)}
              className="w-full text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center gap-1.5">
                  {u.name}
                  <span className="text-[10px] font-normal text-cyan-300/80 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                    {u.post}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {u.instituteName} • ID: {u.idNumber}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleLogin} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@iotogether.edu"
            required
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" /> {loading ? 'Signing in...' : 'Sign In as Receiver'}
        </button>

        <div className="text-center pt-2 border-t border-neutral-800 text-xs text-slate-400">
          New student or teacher?{' '}
          <Link href="/receiver/signup" className="text-cyan-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
}

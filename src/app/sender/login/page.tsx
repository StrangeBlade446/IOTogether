'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, switchDemoUser } from '@/app/actions/auth';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { Shield, LogIn, ArrowRight, UserCheck, AlertCircle, Building2 } from 'lucide-react';

export default function KeeperLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keeperDemoUsers = DEMO_USERS.filter((u) => u.platformType === 'sender');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(email);
      if (res.success) {
        router.push('/sender');
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
      await switchDemoUser(userId, '/sender');
    } catch {
      router.push('/sender');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#263447] text-[#C49A55] border border-[#C49A55]/30 mb-2">
          <Shield className="w-3.5 h-3.5 fill-current" /> Keeper Portal
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#F1E7D0] tracking-tight">Keeper Sign In</h1>
        <p className="text-xs text-[#F1E7D0]/70 mt-1 font-sans">
          For institutions and laboratories that possess electronics equipment. Inspect borrower ID cards and display Handover QR codes.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* One-Click Institution Demo Profiles (2 Colleges + 1 School) */}
      <div className="bg-[#263447] border border-[#C49A55]/30 rounded-2xl p-5 mb-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-[#C49A55] uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Select Keeper Demo Profile
          </h2>
          <span className="text-[10px] text-[#F1E7D0]/60 font-mono">2 Colleges • 1 School</span>
        </div>

        <div className="space-y-2">
          {keeperDemoUsers.map((u, idx) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleQuickSwitch(u.id)}
              className="w-full text-left p-3 rounded-xl bg-[#141821] hover:bg-[#1a202c] border border-[#263447] hover:border-[#C49A55]/60 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-[#F1E7D0] group-hover:text-[#C49A55] flex items-center gap-1.5">
                  <span>{u.name}</span>
                  <span className="text-[10px] font-normal text-[#C49A55] bg-[#C49A55]/15 px-1.5 py-0.2 rounded border border-[#C49A55]/30">
                    {idx === 2 ? 'School' : 'College'}
                  </span>
                </div>
                <div className="text-[11px] text-[#F1E7D0]/70 mt-0.5 font-sans">
                  {u.instituteName}
                </div>
                <div className="text-[10px] text-[#F1E7D0]/50 font-mono">
                  {u.post} • {u.idNumber}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#F1E7D0]/40 group-hover:text-[#C49A55] group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleLogin} className="bg-[#263447] border border-[#263447] rounded-2xl p-5 space-y-4 shadow-xl">
        <div>
          <label className="block text-xs font-semibold text-[#F1E7D0] mb-1 font-sans">Institutional Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="keeper.apex@iotogether.edu"
            required
            className="w-full bg-[#141821] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-[#F1E7D0] placeholder-[#F1E7D0]/40 focus:outline-none focus:border-[#C49A55]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#C49A55] hover:bg-[#d4aa65] disabled:opacity-50 text-[#141821] font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" /> {loading ? 'Signing in...' : 'Sign In as Keeper'}
        </button>

        <div className="text-center pt-2 border-t border-[#141821] text-xs text-[#F1E7D0]/60">
          New institutional laboratory?{' '}
          <Link href="/sender/signup" className="text-[#C49A55] hover:underline font-semibold">
            Register as a Keeper
          </Link>
        </div>
      </form>
    </div>
  );
}

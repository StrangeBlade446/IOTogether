import React from 'react';
import Link from 'next/link';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { Logo } from '@/components/brand/Logo';
import { LoginForm } from './LoginForm';
import { Sparkles, Shield, GraduationCap, Building2 } from 'lucide-react';

export const revalidate = 0;

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Logo size="lg" showTagline />
          <h1 className="text-xl font-bold text-white mt-4">Sign in to IOTogether</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access multi-institution inventory, track your requests, and borrow equipment.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-6 p-4 rounded-xl bg-navy-850 border border-cyan-800/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Judge 1-Click Sign-in
          </span>
          <div className="space-y-1.5">
            {DEMO_USERS.slice(0, 3).map((u) => (
              <LoginForm key={u.id} userId={u.id} userName={u.name} userRole={u.roleLabel} />
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
            Register Student Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

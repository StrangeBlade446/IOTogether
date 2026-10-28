import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { SignupForm } from './SignupForm';

export const revalidate = 0;

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Logo size="lg" showTagline />
          <h2 className="text-xl font-bold text-white mt-4">Create Your Borrower Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Join the verified network to borrow hardware from academic labs & makerspaces.
          </p>
        </div>

        <SignupForm />

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In with Demo Persona
          </Link>
        </div>
      </div>
    </div>
  );
}

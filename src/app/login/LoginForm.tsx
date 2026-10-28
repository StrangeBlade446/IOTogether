'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { switchDemoUser } from '@/app/actions/auth';
import { ArrowRight } from 'lucide-react';

interface LoginFormProps {
  userId: string;
  userName: string;
  userRole: string;
}

export function LoginForm({ userId, userName, userRole }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      await switchDemoUser(userId);
      router.push('/explore');
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isPending}
      className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700/80 hover:border-cyan-600 transition-all flex items-center justify-between text-left group"
    >
      <div>
        <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{userName}</p>
        <p className="text-[10px] text-slate-400">{userRole}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
    </button>
  );
}

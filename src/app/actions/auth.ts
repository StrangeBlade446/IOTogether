'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/store';

export async function enterPortalAction(portal: 'seeker' | 'keeper') {
  const cookieStore = cookies();
  const userId = portal === 'seeker'
    ? 'c0000000-0000-0000-0000-000000000001' // Rohan Verma (student)
    : 'b0000000-0000-0000-0000-000000000002'; // Prof. Alistair Vance (staff)

  cookieStore.set('iotogether_user_id', userId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, target: portal === 'seeker' ? '/receiver?role=seeker' : '/sender?role=keeper' };
}

export async function switchDemoUser(userId: string, returnUrl?: string) {
  const profile = db.getProfile(userId);
  if (!profile) {
    throw new Error('User not found');
  }

  const cookieStore = cookies();
  cookieStore.set('iotogether_user_id', userId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (returnUrl) {
    redirect(returnUrl);
  }
}

export async function logoutUser() {
  const cookieStore = cookies();
  cookieStore.delete('iotogether_user_id');
  redirect('/');
}

export async function loginUser(email: string) {
  // New/custom login is disabled in demonstration mode - direct to demo selection
  redirect('/auth/unavailable');
}

export async function registerUser(formData: {
  name: string;
  email: string;
  role?: string;
  post?: string;
  idNumber?: string;
  instituteName?: string;
}) {
  // New registration is disabled in demonstration mode - direct to demo selection
  redirect('/auth/unavailable');
}

export async function senderSignupAction(data: {
  name: string;
  email: string;
  post: string;
  idNumber: string;
  instituteName: string;
}) {
  // New registration is disabled in demonstration mode - direct to demo selection
  redirect('/auth/unavailable');
}

export async function receiverSignupAction(data: {
  name: string;
  email: string;
  post: string;
  idNumber: string;
  instituteName: string;
}) {
  // New registration is disabled in demonstration mode - direct to demo selection
  redirect('/auth/unavailable');
}

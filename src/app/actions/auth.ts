'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/store';

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
  const profile = db.getProfileByEmail(email);
  if (!profile) {
    return { success: false, error: 'No account found with this email. Use one of the demo accounts or register.' };
  }

  const cookieStore = cookies();
  cookieStore.set('iotogether_user_id', profile.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function registerUser(formData: { name: string; email: string; role?: string }) {
  const existing = db.getProfileByEmail(formData.email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const newProfile = db.upsertProfile({
    id: crypto.randomUUID(),
    display_name: formData.name,
    email: formData.email,
    platform_role: (formData.role as any) || 'student',
    verification_status: 'verified',
  });

  const cookieStore = cookies();
  cookieStore.set('iotogether_user_id', newProfile.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, profile: newProfile };
}

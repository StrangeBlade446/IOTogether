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

export async function registerUser(formData: {
  name: string;
  email: string;
  role?: string;
  post?: string;
  idNumber?: string;
  instituteName?: string;
}) {
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
    post: formData.post,
    id_number: formData.idNumber,
    institute_name: formData.instituteName,
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

export async function senderSignupAction(data: {
  name: string;
  email: string;
  post: string;
  idNumber: string;
  instituteName: string;
}) {
  if (!data.name || !data.email || !data.post || !data.idNumber || !data.instituteName) {
    return { success: false, error: 'All fields (Name, Post, Staff ID, Institute Name, Email) are required' };
  }

  const existing = db.getProfileByEmail(data.email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Create or link institution if needed
  const institutions = db.getInstitutions();
  let institution = institutions.find(
    (i) => i.name.toLowerCase() === data.instituteName.trim().toLowerCase()
  );

  const profileId = crypto.randomUUID();

  if (!institution) {
    const slug = data.instituteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    institution = db.createInstitution({
      name: data.instituteName,
      slug: slug || 'inst-' + Date.now(),
      institution_type: 'university',
      description: 'Academic laboratory resource center',
      address: 'Main Campus',
      city: 'Technology Hub',
      verification_status: 'verified',
      sharing_policy: 'open_to_verified',
    });
  }

  const newProfile = db.upsertProfile({
    id: profileId,
    display_name: data.name,
    email: data.email,
    platform_role: 'staff',
    verification_status: 'verified',
    post: data.post,
    id_number: data.idNumber,
    institute_name: data.instituteName,
  });

  // Assign staff membership to the institution
  if (institution) {
    db.upsertMembership({
      user_id: newProfile.id,
      institution_id: institution.id,
      role: 'inventory_manager',
      status: 'verified',
    });
  }

  const cookieStore = cookies();
  cookieStore.set('iotogether_user_id', newProfile.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, profile: newProfile };
}

export async function receiverSignupAction(data: {
  name: string;
  email: string;
  post: string;
  idNumber: string;
  instituteName: string;
}) {
  if (!data.name || !data.email || !data.post || !data.idNumber || !data.instituteName) {
    return { success: false, error: 'All fields (Name, Post, ID Number, Institute Name, Email) are required' };
  }

  const existing = db.getProfileByEmail(data.email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const profileId = crypto.randomUUID();
  const newProfile = db.upsertProfile({
    id: profileId,
    display_name: data.name,
    email: data.email,
    platform_role: 'student',
    verification_status: 'verified',
    post: data.post,
    id_number: data.idNumber,
    institute_name: data.instituteName,
  });

  // Connect student membership to matched institution if it exists
  const institutions = db.getInstitutions();
  const matched = institutions.find(
    (i) => i.name.toLowerCase() === data.instituteName.trim().toLowerCase()
  );
  if (matched) {
    db.upsertMembership({
      user_id: newProfile.id,
      institution_id: matched.id,
      role: 'student',
      status: 'verified',
    });
  }

  const cookieStore = cookies();
  cookieStore.set('iotogether_user_id', newProfile.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, profile: newProfile };
}

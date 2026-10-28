import { cookies } from 'next/headers';
import { db } from '@/lib/db/store';
import { Profile, Membership } from '@/types/database';
import { DEMO_USERS } from './demo-users';

export { DEMO_USERS };

export interface AuthSession {
  user: Profile;
  memberships: Membership[];
  isPlatformAdmin: boolean;
  managedInstitutions: string[]; // institution IDs where user is manager
}

export async function getSession(): Promise<AuthSession> {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get('iotogether_user_id')?.value;

  // Fallback to primary student demo user if not logged in
  const userId = userIdCookie || 'c0000000-0000-0000-0000-000000000001';

  let user = db.getProfile(userId);
  if (!user) {
    // Fallback to student
    user = db.getProfile('c0000000-0000-0000-0000-000000000001')!;
  }

  const memberships = db.getMemberships(user.id);
  const isPlatformAdmin = user.platform_role === 'platform_admin';
  const managedInstitutions = memberships
    .filter((m) => ['inventory_manager', 'institution_admin'].includes(m.role) && m.status === 'verified')
    .map((m) => m.institution_id);

  return {
    user,
    memberships,
    isPlatformAdmin,
    managedInstitutions,
  };
}

export function checkPermission(session: AuthSession, action: 'manage_institution' | 'platform_admin', institutionId?: string): boolean {
  if (action === 'platform_admin') {
    return session.isPlatformAdmin;
  }
  if (action === 'manage_institution') {
    if (session.isPlatformAdmin) return true;
    if (!institutionId) return session.managedInstitutions.length > 0;
    return session.managedInstitutions.includes(institutionId);
  }
  return false;
}

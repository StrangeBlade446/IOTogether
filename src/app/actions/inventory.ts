'use server';

import { revalidatePath } from 'next/cache';
import { getSession, checkPermission } from '@/lib/auth/session';
import { db } from '@/lib/db/store';
import { Resource } from '@/types/database';

export async function createResourceAction(data: {
  institutionId: string;
  name: string;
  slug: string;
  category: Resource['category'];
  description: string;
  specifications: Record<string, any>;
  imageUrl?: string;
  totalQuantity: number;
  dailyRatePaise: number;
  depositPaise: number;
  condition: Resource['condition'];
  locationDescription: string;
  minLoanDuration: number;
  maxLoanDuration: number;
  approvalRequired: boolean;
  trainingRequired: boolean;
  eligibilityPolicy: Resource['eligibility_policy'];
}) {
  const session = await getSession();
  if (!checkPermission(session, 'manage_institution', data.institutionId)) {
    return { success: false, error: 'Forbidden: You do not manage this institution' };
  }

  const newResource = db.createResource({
    institution_id: data.institutionId,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category,
    description: data.description,
    specifications: data.specifications || {},
    image_url: data.imageUrl,
    total_quantity: Number(data.totalQuantity),
    daily_rate_paise: Number(data.dailyRatePaise || 0),
    deposit_paise: Number(data.depositPaise || 0),
    currency: 'INR',
    condition: data.condition,
    location_description: data.locationDescription,
    min_loan_duration: Number(data.minLoanDuration || 1),
    max_loan_duration: Number(data.maxLoanDuration || 14),
    approval_required: data.approvalRequired,
    training_required: data.trainingRequired,
    eligibility_policy: data.eligibilityPolicy,
    status: 'active',
    created_by: session.user.id,
  });

  revalidatePath('/explore');
  revalidatePath('/manage/inventory');
  return { success: true, resource: newResource };
}

export async function updateResourceAction(
  resourceId: string,
  updates: Partial<Resource>
) {
  const session = await getSession();
  const existing = db.getResource(resourceId);
  if (!existing) {
    return { success: false, error: 'Resource not found' };
  }

  if (!checkPermission(session, 'manage_institution', existing.institution_id)) {
    return { success: false, error: 'Forbidden: You do not manage this institution' };
  }

  const updated = db.updateResource(resourceId, updates, session.user.id);
  revalidatePath('/explore');
  revalidatePath(`/resources/${resourceId}`);
  revalidatePath('/manage/inventory');
  return { success: true, resource: updated };
}

export async function verifyInstitutionAction(institutionId: string, status: 'verified' | 'suspended') {
  const session = await getSession();
  if (!session.isPlatformAdmin) {
    return { success: false, error: 'Forbidden: Platform admin privileges required' };
  }

  const result = db.verifyInstitution(institutionId, session.user.id, status);
  revalidatePath('/admin/institutions');
  revalidatePath('/institutions');
  revalidatePath('/explore');
  return { success: true, institution: result };
}

export async function verifyMembershipAction(membershipId: string, status: 'verified' | 'rejected') {
  const session = await getSession();
  const membership = db.getMemberships().find((m) => m.id === membershipId);
  if (!membership) {
    return { success: false, error: 'Membership not found' };
  }

  if (!checkPermission(session, 'manage_institution', membership.institution_id) && !session.isPlatformAdmin) {
    return { success: false, error: 'Forbidden: Staff privileges required' };
  }

  const result = db.verifyMembership(membershipId, session.user.id, status);
  revalidatePath('/manage/members');
  revalidatePath('/admin/memberships');
  return { success: true, membership: result };
}

export async function requestMembershipAction(institutionId: string, role: 'student' = 'student') {
  const session = await getSession();
  if (!session.user) {
    return { success: false, error: 'Must be logged in to request membership' };
  }

  const result = db.requestMembership(session.user.id, institutionId, role);
  revalidatePath('/profile');
  revalidatePath('/institutions');
  return { success: true, membership: result };
}

export async function registerInstitutionAction(data: {
  name: string;
  institutionType: 'university' | 'college' | 'makerspace' | 'school' | 'lab';
  city: string;
  address: string;
  description: string;
  sharingPolicy: 'open_to_all' | 'open_to_verified' | 'internal_only';
}): Promise<{ success: boolean; institution?: any; error?: string }> {
  try {
    const session = await getSession();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newInst = db.createInstitution({
      name: data.name,
      slug,
      institution_type: data.institutionType,
      city: data.city,
      address: data.address,
      description: data.description,
      sharing_policy: data.sharingPolicy,
      verification_status: 'pending',
    });

    if (session.user) {
      db.requestMembership(session.user.id, newInst.id, 'inventory_manager');
    }

    revalidatePath('/institutions');
    revalidatePath('/admin/institutions');
    return { success: true, institution: newInst };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to register institution' };
  }
}

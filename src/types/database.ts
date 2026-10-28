// =============================================================================
// IOTogether TypeScript Database Definitions & Domain Models
// =============================================================================

export type PlatformRole = 'student' | 'staff' | 'institution_admin' | 'platform_admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'suspended';

export type InstitutionType = 'university' | 'college' | 'makerspace' | 'school' | 'lab';
export type SharingPolicy = 'open_to_all' | 'open_to_verified' | 'internal_only';

export type MemberRole = 'student' | 'inventory_manager' | 'institution_admin';
export type MembershipStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ResourceCategory =
  | 'microcontrollers'
  | 'single_board_computers'
  | 'sensors'
  | 'actuators_motors'
  | 'prototyping'
  | 'test_equipment'
  | 'robotics'
  | 'cameras_displays';

export type ResourceCondition = 'brand_new' | 'excellent' | 'good' | 'fair' | 'needs_maintenance' | 'damaged' | 'parts_missing';
export type ResourceStatus = 'active' | 'maintenance' | 'retired' | 'draft';
export type EligibilityPolicy = 'public' | 'verified_members_only' | 'training_certified';

export type UnitStatus = 'available' | 'checked_out' | 'maintenance' | 'lost' | 'retired';

export type BookingStatus =
  | 'pending'
  | 'waitlisted'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'checked_out'
  | 'overdue'
  | 'return_review'
  | 'incident_review'
  | 'completed';

export type PaymentStatus = 'not_required' | 'pending' | 'paid' | 'refunded' | 'waived';
export type ConditionReportType = 'checkout' | 'return';
export type IncidentType = 'damage' | 'missing' | 'late' | 'misuse' | 'dispute';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  platform_role: PlatformRole;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  institution_type: InstitutionType;
  description: string;
  city: string;
  address: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
  sharing_policy: SharingPolicy;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  institution_id: string;
  user_id: string;
  role: MemberRole;
  status: MembershipStatus;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  // Joins
  institution?: Institution;
  user?: Profile;
}

export interface ResourceSpecifications {
  [key: string]: string | number | boolean;
}

export interface Resource {
  id: string;
  institution_id: string;
  name: string;
  slug: string;
  category: ResourceCategory;
  description: string;
  specifications: ResourceSpecifications;
  image_url?: string;
  total_quantity: number;
  daily_rate_paise: number; // 0 for free
  deposit_paise: number; // 0 for none
  currency: string;
  condition: ResourceCondition;
  location_description: string;
  min_loan_duration: number;
  max_loan_duration: number;
  approval_required: boolean;
  training_required: boolean;
  eligibility_policy: EligibilityPolicy;
  status: ResourceStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joins
  institution?: Institution;
  available_quantity?: number; // Computed
}

export interface ResourceUnit {
  id: string;
  resource_id: string;
  asset_tag: string;
  serial_number?: string;
  condition: ResourceCondition;
  unit_status: UnitStatus;
  created_at: string;
}

export interface EligibilityRecord {
  id: string;
  user_id: string;
  institution_id: string;
  requirement_type: string;
  status: 'pending' | 'approved' | 'revoked' | 'expired';
  verified_by?: string;
  valid_from: string;
  expires_at?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  resource_id: string;
  borrower_id: string;
  unit_id?: string;
  quantity: number;
  start_at: string;
  due_at: string;
  status: BookingStatus;
  daily_rate_snapshot_paise: number;
  deposit_snapshot_paise: number;
  estimated_total_paise: number;
  payment_status: PaymentStatus;
  purpose: string;
  usage_rules_acknowledged: boolean;
  approved_by?: string;
  approved_at?: string;
  issued_by?: string;
  issued_at?: string;
  returned_by?: string;
  returned_at?: string;
  cancellation_reason?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  // Joins
  resource?: Resource;
  borrower?: Profile;
  unit?: ResourceUnit;
}

export interface ConditionReport {
  id: string;
  booking_id: string;
  report_type: ConditionReportType;
  condition: ResourceCondition;
  notes: string;
  evidence_paths: string[];
  submitted_by: string;
  created_at: string;
  // Joins
  submitter?: Profile;
}

export interface Incident {
  id: string;
  booking_id: string;
  reported_by: string;
  incident_type: IncidentType;
  description: string;
  evidence_paths: string[];
  status: IncidentStatus;
  assigned_to?: string;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  // Joins
  reporter?: Profile;
  booking?: Booking;
}

export interface WaitlistEntry {
  id: string;
  resource_id: string;
  user_id: string;
  quantity: number;
  status: 'active' | 'allocated' | 'cancelled' | 'expired';
  queue_position: number;
  priority_reason?: string;
  created_at: string;
  // Joins
  resource?: Resource;
  user?: Profile;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  institution_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  // Joins
  actor?: Profile;
  institution?: Institution;
}

export interface Notification {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  message: string;
  related_booking_id?: string;
  read_at?: string;
  created_at: string;
}

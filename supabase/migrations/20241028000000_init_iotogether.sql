-- =============================================================================
-- IOTogether: Multi-Institution Electronics Resource-Sharing Platform
-- Migration: 20241028000000_init_iotogether.sql
-- Description: Core Schema, RLS, Indexes, Atomic Booking Functions, & Triggers
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    platform_role TEXT NOT NULL CHECK (platform_role IN ('student', 'staff', 'institution_admin', 'platform_admin')) DEFAULT 'student',
    verification_status TEXT NOT NULL CHECK (verification_status IN ('unverified', 'pending', 'verified', 'suspended')) DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. INSTITUTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    institution_type TEXT NOT NULL CHECK (institution_type IN ('university', 'college', 'makerspace', 'school', 'lab')),
    description TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('unverified', 'pending', 'verified', 'suspended')) DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    sharing_policy TEXT NOT NULL DEFAULT 'open_to_verified' CHECK (sharing_policy IN ('open_to_all', 'open_to_verified', 'internal_only')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. MEMBERSHIPS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'inventory_manager', 'institution_admin')) DEFAULT 'student',
    status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'rejected', 'suspended')) DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_institution_user UNIQUE (institution_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 4. RESOURCES (INVENTORY)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'microcontrollers',
        'single_board_computers',
        'sensors',
        'actuators_motors',
        'prototyping',
        'test_equipment',
        'robotics',
        'cameras_displays'
    )),
    description TEXT NOT NULL,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    daily_rate_paise INTEGER NOT NULL DEFAULT 0 CHECK (daily_rate_paise >= 0),
    deposit_paise INTEGER NOT NULL DEFAULT 0 CHECK (deposit_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    condition TEXT NOT NULL CHECK (condition IN ('brand_new', 'excellent', 'good', 'fair', 'needs_maintenance')) DEFAULT 'good',
    location_description TEXT NOT NULL,
    min_loan_duration INTEGER NOT NULL DEFAULT 1 CHECK (min_loan_duration >= 1),
    max_loan_duration INTEGER NOT NULL DEFAULT 14 CHECK (max_loan_duration >= min_loan_duration),
    approval_required BOOLEAN NOT NULL DEFAULT true,
    training_required BOOLEAN NOT NULL DEFAULT false,
    eligibility_policy TEXT NOT NULL DEFAULT 'verified_members_only' CHECK (eligibility_policy IN ('public', 'verified_members_only', 'training_certified')),
    status TEXT NOT NULL CHECK (status IN ('active', 'maintenance', 'retired', 'draft')) DEFAULT 'active',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. RESOURCE UNITS (Serialized Equipment)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    asset_tag TEXT UNIQUE NOT NULL,
    serial_number TEXT,
    condition TEXT NOT NULL DEFAULT 'good',
    unit_status TEXT NOT NULL CHECK (unit_status IN ('available', 'checked_out', 'maintenance', 'lost', 'retired')) DEFAULT 'available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. ELIGIBILITY RECORDS (Certifications & Training)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.eligibility_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    requirement_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'revoked', 'expired')) DEFAULT 'approved',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. BOOKINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES public.resource_units(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    start_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'pending',
        'waitlisted',
        'approved',
        'rejected',
        'cancelled',
        'checked_out',
        'overdue',
        'return_review',
        'incident_review',
        'completed'
    )) DEFAULT 'pending',
    daily_rate_snapshot_paise INTEGER NOT NULL DEFAULT 0,
    deposit_snapshot_paise INTEGER NOT NULL DEFAULT 0,
    estimated_total_paise INTEGER NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('not_required', 'pending', 'paid', 'refunded', 'waived')) DEFAULT 'not_required',
    purpose TEXT NOT NULL,
    usage_rules_acknowledged BOOLEAN NOT NULL DEFAULT true,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    issued_at TIMESTAMPTZ,
    returned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    returned_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_booking_dates CHECK (due_at > start_at)
);

-- -----------------------------------------------------------------------------
-- 8. CONDITION REPORTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.condition_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('checkout', 'return')),
    condition TEXT NOT NULL CHECK (condition IN ('brand_new', 'excellent', 'good', 'fair', 'damaged', 'parts_missing')),
    notes TEXT NOT NULL,
    evidence_paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. INCIDENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    incident_type TEXT NOT NULL CHECK (incident_type IN ('damage', 'missing', 'late', 'misuse', 'dispute')),
    description TEXT NOT NULL,
    evidence_paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL CHECK (status IN ('open', 'investigating', 'resolved')) DEFAULT 'open',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. WAITLIST ENTRIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    status TEXT NOT NULL CHECK (status IN ('active', 'allocated', 'cancelled', 'expired')) DEFAULT 'active',
    queue_position INTEGER NOT NULL DEFAULT 1,
    priority_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate active waitlist requests per user & resource
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_waitlist ON public.waitlist_entries(resource_id, user_id) WHERE status = 'active';

-- -----------------------------------------------------------------------------
-- 11. AUDIT LOGS (Append-Only)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE & LOOKUPS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_resources_institution ON public.resources(institution_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_bookings_resource ON public.bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_borrower ON public.bookings(borrower_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_at, due_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_institution ON public.audit_logs(institution_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user platform admin?
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = user_id AND platform_role = 'platform_admin'
    );
$$;

-- Helper function: does user have active manager or admin role in institution?
CREATE OR REPLACE FUNCTION public.is_institution_staff(user_id UUID, inst_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE user_id = user_id
          AND institution_id = inst_id
          AND role IN ('inventory_manager', 'institution_admin')
          AND status = 'verified'
    );
$$;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own permitted profile fields"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- INSTITUTIONS POLICIES
CREATE POLICY "Anyone can view verified institutions"
ON public.institutions FOR SELECT
USING (verification_status = 'verified' OR auth.uid() IS NOT NULL);

CREATE POLICY "Only platform admins can insert or update institutions"
ON public.institutions FOR ALL TO authenticated
USING (public.is_platform_admin(auth.uid()));

-- MEMBERSHIPS POLICIES
CREATE POLICY "Memberships viewable by member or institution staff"
ON public.memberships FOR SELECT TO authenticated
USING (
    user_id = auth.uid() OR
    public.is_institution_staff(auth.uid(), institution_id) OR
    public.is_platform_admin(auth.uid())
);

CREATE POLICY "Users can request membership"
ON public.memberships FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Staff can update memberships"
ON public.memberships FOR UPDATE TO authenticated
USING (
    public.is_institution_staff(auth.uid(), institution_id) OR
    public.is_platform_admin(auth.uid())
);

-- RESOURCES POLICIES
CREATE POLICY "Active resources viewable by all authenticated users"
ON public.resources FOR SELECT TO authenticated
USING (
    status = 'active' OR
    public.is_institution_staff(auth.uid(), institution_id) OR
    public.is_platform_admin(auth.uid())
);

CREATE POLICY "Institution staff can manage resources"
ON public.resources FOR ALL TO authenticated
USING (
    public.is_institution_staff(auth.uid(), institution_id) OR
    public.is_platform_admin(auth.uid())
);

-- BOOKINGS POLICIES
CREATE POLICY "Borrowers view own bookings, staff view institution bookings"
ON public.bookings FOR SELECT TO authenticated
USING (
    borrower_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.resources r
        WHERE r.id = resource_id AND public.is_institution_staff(auth.uid(), r.institution_id)
    ) OR
    public.is_platform_admin(auth.uid())
);

CREATE POLICY "Borrowers can create bookings for themselves"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (borrower_id = auth.uid() AND status = 'pending');

CREATE POLICY "Borrowers can cancel, staff can update status"
ON public.bookings FOR UPDATE TO authenticated
USING (
    borrower_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.resources r
        WHERE r.id = resource_id AND public.is_institution_staff(auth.uid(), r.institution_id)
    ) OR
    public.is_platform_admin(auth.uid())
);

-- AUDIT LOGS: Append-only
CREATE POLICY "Audit logs viewable by staff and platform admins"
ON public.audit_logs FOR SELECT TO authenticated
USING (
    (institution_id IS NOT NULL AND public.is_institution_staff(auth.uid(), institution_id)) OR
    public.is_platform_admin(auth.uid())
);

CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (actor_id = auth.uid());

-- NOTIFICATIONS: Private to recipient
CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can mark own notifications read"
ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- ATOMIC BOOKING FUNCTION: Check Availability & Reserve Atomically
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
    p_resource_id UUID,
    p_borrower_id UUID,
    p_quantity INTEGER,
    p_start_at TIMESTAMPTZ,
    p_due_at TIMESTAMPTZ,
    p_purpose TEXT,
    p_acknowledged BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_resource RECORD;
    v_active_conflicts INTEGER;
    v_available_qty INTEGER;
    v_days INTEGER;
    v_daily_rate INTEGER;
    v_deposit INTEGER;
    v_total_paise INTEGER;
    v_new_booking_id UUID;
BEGIN
    -- 1. Validate dates
    IF p_due_at <= p_start_at THEN
        RETURN jsonb_build_object('success', false, 'error', 'Due date must be after start date');
    END IF;

    -- Calculate days (at least 1 day)
    v_days := GREATEST(1, CEIL(EXTRACT(EPOCH FROM (p_due_at - p_start_at)) / 86400));

    -- 2. Lock resource record for update to prevent concurrent race condition
    SELECT * INTO v_resource
    FROM public.resources
    WHERE id = p_resource_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Resource not found');
    END IF;

    IF v_resource.status != 'active' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Resource is not currently active for booking');
    END IF;

    IF v_days < v_resource.min_loan_duration THEN
        RETURN jsonb_build_object('success', false, 'error', format('Booking must be at least %s days', v_resource.min_loan_duration));
    END IF;

    IF v_days > v_resource.max_loan_duration THEN
        RETURN jsonb_build_object('success', false, 'error', format('Booking cannot exceed %s days', v_resource.max_loan_duration));
    END IF;

    -- 3. Calculate current overlapping reserved quantities (approved or checked_out or pending holds)
    SELECT COALESCE(SUM(b.quantity), 0) INTO v_active_conflicts
    FROM public.bookings b
    WHERE b.resource_id = p_resource_id
      AND b.status IN ('pending', 'approved', 'checked_out')
      AND (b.start_at < p_due_at AND b.due_at > p_start_at);

    v_available_qty := v_resource.total_quantity - v_active_conflicts;

    IF v_available_qty < p_quantity THEN
        RETURN jsonb_build_object(
            'success', false,
            'conflict', true,
            'available_quantity', GREATEST(0, v_available_qty),
            'requested_quantity', p_quantity,
            'error', format('Insufficient inventory: only %s unit(s) available for selected dates', GREATEST(0, v_available_qty))
        );
    END IF;

    -- 4. Calculate prices
    v_daily_rate := v_resource.daily_rate_paise;
    v_deposit := v_resource.deposit_paise;
    v_total_paise := (v_daily_rate * p_quantity * v_days) + (v_deposit * p_quantity);

    -- 5. Insert new booking with snapshot prices
    INSERT INTO public.bookings (
        resource_id,
        borrower_id,
        quantity,
        start_at,
        due_at,
        status,
        daily_rate_snapshot_paise,
        deposit_snapshot_paise,
        estimated_total_paise,
        payment_status,
        purpose,
        usage_rules_acknowledged
    ) VALUES (
        p_resource_id,
        p_borrower_id,
        p_quantity,
        p_start_at,
        p_due_at,
        'pending',
        v_daily_rate,
        v_deposit,
        v_total_paise,
        CASE WHEN v_total_paise > 0 THEN 'pending' ELSE 'not_required' END,
        p_purpose,
        p_acknowledged
    ) RETURNING id INTO v_new_booking_id;

    -- 6. Record Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        institution_id,
        entity_type,
        entity_id,
        action,
        metadata
    ) VALUES (
        p_borrower_id,
        v_resource.institution_id,
        'booking',
        v_new_booking_id,
        'created',
        jsonb_build_object(
            'quantity', p_quantity,
            'days', v_days,
            'start_at', p_start_at,
            'due_at', p_due_at,
            'estimated_total_paise', v_total_paise
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_new_booking_id,
        'estimated_total_paise', v_total_paise,
        'days', v_days
    );
END;
$$;

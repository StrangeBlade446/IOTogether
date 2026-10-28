-- =============================================================================
-- IOTogether: Deterministic Demonstration Seed Data
-- =============================================================================

-- 1. Profiles (Demo Accounts)
INSERT INTO public.profiles (id, display_name, email, platform_role, verification_status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Dr. Vikram Seth (Platform Admin)', 'admin@iotogether.edu', 'platform_admin', 'verified'),
    ('b0000000-0000-0000-0000-000000000002', 'Prof. Ananya Roy (NIT Manager)', 'manager.nit@iotogether.edu', 'staff', 'verified'),
    ('b0000000-0000-0000-0000-000000000003', 'Marcus Chen (GEC Lab Lead)', 'manager.gec@iotogether.edu', 'staff', 'verified'),
    ('c0000000-0000-0000-0000-000000000001', 'Aarav Sharma (Student)', 'student@iotogether.edu', 'student', 'verified'),
    ('c0000000-0000-0000-0000-000000000002', 'Priya Patel (Student)', 'priya.student@iotogether.edu', 'student', 'verified')
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    platform_role = EXCLUDED.platform_role;

-- 2. Institutions (Fictional Demonstration Institutions)
INSERT INTO public.institutions (id, name, slug, institution_type, description, city, address, verification_status, verified_by, verified_at, sharing_policy)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Northstar Institute of Technology', 'northstar-tech', 'university', 'Premier technical research university with high-tier embedded systems, robotics and electronics laboratories.', 'Bengaluru', 'Academic Block 4, Electronics Lab 201, Outer Ring Road, Bengaluru', 'verified', 'a0000000-0000-0000-0000-000000000001', NOW(), 'open_to_verified'),
    ('22222222-2222-2222-2222-222222222222', 'Greenfield Engineering College', 'greenfield-eng', 'college', 'Autonomous engineering college featuring dedicated student prototyping makerspaces and IoT sensor testing benches.', 'Pune', 'Department of ECE, Makerspace Room 102, Hinjewadi Phase 1, Pune', 'verified', 'a0000000-0000-0000-0000-000000000001', NOW(), 'open_to_verified'),
    ('33333333-3333-3333-3333-333333333333', 'Metro Makerspace', 'metro-makerspace', 'makerspace', 'Community fabrication lab and open electronics hardware incubator for students and hardware inventors.', 'Hyderabad', 'Plot 42, Hardware Park, Shamshabad, Hyderabad', 'verified', 'a0000000-0000-0000-0000-000000000001', NOW(), 'open_to_all')
ON CONFLICT (id) DO NOTHING;

-- 3. Memberships
INSERT INTO public.memberships (id, institution_id, user_id, role, status, verified_by, verified_at)
VALUES
    ('m0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'b0000000-0000-0000-0000-000000000002', 'inventory_manager', 'verified', 'a0000000-0000-0000-0000-000000000001', NOW()),
    ('m0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'b0000000-0000-0000-0000-000000000003', 'inventory_manager', 'verified', 'a0000000-0000-0000-0000-000000000001', NOW()),
    ('m0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000001', 'student', 'verified', 'b0000000-0000-0000-0000-000000000002', NOW()),
    ('m0000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'c0000000-0000-0000-0000-000000000001', 'student', 'verified', 'b0000000-0000-0000-0000-000000000003', NOW()),
    ('m0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'c0000000-0000-0000-0000-000000000002', 'student', 'verified', 'b0000000-0000-0000-0000-000000000002', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Eligibility Records (Trainings & Certifications)
INSERT INTO public.eligibility_records (id, user_id, institution_id, requirement_type, status, verified_by, valid_from, expires_at)
VALUES
    ('e0000001-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'lab_safety_course', 'approved', 'b0000000-0000-0000-0000-000000000002', NOW(), NOW() + INTERVAL '1 year'),
    ('e0000002-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'oscilloscope_training', 'approved', 'b0000000-0000-0000-0000-000000000002', NOW(), NOW() + INTERVAL '1 year')
ON CONFLICT (id) DO NOTHING;

-- 5. Resources (Core Demonstration Inventory)
INSERT INTO public.resources (
    id, institution_id, name, slug, category, description, specifications, image_url,
    total_quantity, daily_rate_paise, deposit_paise, currency, condition, location_description,
    min_loan_duration, max_loan_duration, approval_required, training_required, eligibility_policy, status, created_by
) VALUES
    -- Free Resource: Arduino Uno Rev3 (Northstar)
    (
        'd0000001-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        'Arduino Uno Rev3 Microcontroller Board',
        'arduino-uno-rev3',
        'microcontrollers',
        'Standard ATmega328P microcontroller board with 14 digital I/O pins, 6 analog inputs, 16 MHz quartz crystal, and USB connection. Ideal for prototyping sensors and actuators.',
        '{"microcontroller": "ATmega328P", "operating_voltage": "5V", "clock_speed": "16 MHz", "digital_io": 14, "analog_in": 6, "flash_memory": "32 KB"}'::jsonb,
        'https://images.unsplash.com/photo-1608562098869-2f6437d0c3be?auto=format&fit=crop&w=600&q=80',
        5, 0, 0, 'INR', 'excellent', 'Cabinet A2, Shelf 1, NIT Electronics Lab',
        1, 14, true, false, 'verified_members_only', 'active', 'b0000000-0000-0000-0000-000000000002'
    ),
    -- Free Resource: ESP32 NodeMCU Wi-Fi + Bluetooth (Greenfield)
    (
        'd0000002-0000-0000-0000-000000000002',
        '22222222-2222-2222-2222-222222222222',
        'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board',
        'esp32-nodemcu-wifi-ble',
        'microcontrollers',
        'Powerful dual-core 240MHz SoC with integrated 802.11b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR and BLE. Essential for connected IoT sensor nodes and edge computing.',
        '{"chip": "ESP-WROOM-32", "cores": 2, "frequency": "240 MHz", "wifi": "802.11 b/g/n", "bluetooth": "v4.2 BR/EDR & BLE", "ram": "520 KB"}'::jsonb,
        'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
        3, 0, 0, 'INR', 'excellent', 'Drawer 4, Greenfield Makerspace Hub',
        1, 7, true, false, 'verified_members_only', 'active', 'b0000000-0000-0000-0000-000000000003'
    ),
    -- Free Resource: DHT11 Sensor (Northstar)
    (
        'd0000003-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-111111111111',
        'DHT11 Temperature & Humidity Sensor Module',
        'dht11-temperature-humidity-sensor',
        'sensors',
        'Calibrated digital signal output temperature and humidity composite sensor. Features resistive-type humidity measurement component and NTC temperature measurement component.',
        '{"temp_range": "0-50 C (+/-2 C)", "humidity_range": "20-90% RH (+/-5%)", "sampling_rate": "1 Hz", "voltage": "3.3V - 5V"}'::jsonb,
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        8, 0, 0, 'INR', 'good', 'Component Box S-14, NIT Electronics Lab',
        1, 14, false, false, 'public', 'active', 'b0000000-0000-0000-0000-000000000002'
    ),
    -- Paid Resource: Raspberry Pi 4 Model B (4GB RAM) (Northstar)
    (
        'd0000004-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-111111111111',
        'Raspberry Pi 4 Model B (4GB RAM) Starter Kit',
        'raspberry-pi-4-model-b-4gb',
        'single_board_computers',
        'Quad-core 64-bit ARM Cortex-A72 at 1.5GHz, dual 4K micro-HDMI, Gigabit Ethernet, 2x USB 3.0, 2x USB 2.0. Supplied with 32GB microSD and official power supply.',
        '{"processor": "Broadcom BCM2711 1.5GHz", "ram": "4GB LPDDR4", "connectivity": "Dual-band Wi-Fi, BT 5.0, Gigabit Eth", "display": "2x micro-HDMI 4K"}'::jsonb,
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
        2, 5000, 200000, 'INR', 'excellent', 'Locker B-3, Embedded Systems Lab, NIT',
        2, 10, true, false, 'verified_members_only', 'active', 'b0000000-0000-0000-0000-000000000002'
    ),
    -- Training-Restricted: Rigol DS1054Z Digital Storage Oscilloscope (Northstar)
    (
        'd0000005-0000-0000-0000-000000000005',
        '11111111-1111-1111-1111-111111111111',
        'Rigol DS1054Z 50MHz 4-Channel Digital Oscilloscope',
        'rigol-ds1054z-oscilloscope',
        'test_equipment',
        'Four-channel 50MHz digital storage oscilloscope with 1GSa/s real-time sampling rate, 24Mpts deep memory, and 30,000 wfms/s capture rate. Requires verified Oscilloscope training.',
        '{"channels": 4, "bandwidth": "50 MHz", "sampling_rate": "1 GSa/s", "memory_depth": "24 Mpts", "screen": "7-inch WVGA"}'::jsonb,
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        1, 10000, 500000, 'INR', 'brand_new', 'Precision Bench 1, Test & Measurement Lab, NIT',
        1, 3, true, true, 'training_certified', 'active', 'b0000000-0000-0000-0000-000000000002'
    ),
    -- Deposit-Required: 4WD Autonomous Robotics Chassis Kit (Metro Makerspace)
    (
        'd0000006-0000-0000-0000-000000000006',
        '33333333-3333-3333-3333-333333333333',
        '4WD Smart Robot Car Chassis Kit with L298N Driver',
        '4wd-robotics-chassis-kit',
        'robotics',
        'Complete 4-wheel drive acrylic chassis kit with 4 DC gear motors, encoder wheels, battery holder, ultrasonic sensor mount, and L298N dual H-bridge motor driver module.',
        '{"motors": "4x DC TT gear motors 1:48", "driver": "L298N Dual H-Bridge", "wheels": "65mm rubber grip tires", "chassis": "Double deck laser-cut acrylic"}'::jsonb,
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
        2, 0, 150000, 'INR', 'good', 'Robotics Shelf R3, Metro Makerspace',
        2, 14, true, false, 'open_to_all', 'active', 'b0000000-0000-0000-0000-000000000002'
    ),
    -- Digital Multimeter (Greenfield)
    (
        'd0000007-0000-0000-0000-000000000007',
        '22222222-2222-2222-2222-222222222222',
        'Fluke 101 Pocket Digital Multimeter with Probes',
        'fluke-101-digital-multimeter',
        'test_equipment',
        'Compact basic true-RMS accurate digital multimeter measuring AC/DC voltage, resistance, capacitance, frequency, and continuity. CAT III 600V safety rated.',
        '{"ac_voltage": "600V", "dc_voltage": "600V", "resistance": "40 M-ohm", "capacitance": "100 uF", "safety_rating": "CAT III 600V"}'::jsonb,
        'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
        2, 0, 50000, 'INR', 'excellent', 'Cabinet M, Tool Station 3, Greenfield GEC',
        1, 7, true, false, 'verified_members_only', 'active', 'b0000000-0000-0000-0000-000000000003'
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Resource Units (Serial numbers & Asset tags)
INSERT INTO public.resource_units (id, resource_id, asset_tag, serial_number, condition, unit_status)
VALUES
    ('u0000001-0000-0000-0000-000000000001', 'd0000005-0000-0000-0000-000000000005', 'NIT-OSC-01', 'DS1ZA224500129', 'brand_new', 'available'),
    ('u0000002-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000004', 'NIT-RPI-01', 'RPI4B4-0982736', 'excellent', 'checked_out'),
    ('u0000003-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000004', 'NIT-RPI-02', 'RPI4B4-0982737', 'excellent', 'available'),
    ('u0000004-0000-0000-0000-000000000007', 'd0000007-0000-0000-0000-000000000007', 'GEC-DMM-01', 'FLK101-839211', 'excellent', 'available'),
    ('u0000005-0000-0000-0000-000000000007', 'd0000007-0000-0000-0000-000000000007', 'GEC-DMM-02', 'FLK101-839212', 'good', 'available')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Demonstration Bookings (All States: Pending, Approved, Checked Out, Completed, Incident)
INSERT INTO public.bookings (
    id, resource_id, borrower_id, quantity, start_at, due_at, status,
    daily_rate_snapshot_paise, deposit_snapshot_paise, estimated_total_paise, payment_status,
    purpose, approved_by, approved_at, issued_by, issued_at, returned_by, returned_at
) VALUES
    -- 1. Pending Request: Student requested Arduino Uno
    (
        'b1111111-0000-0000-0000-000000000001',
        'd0000001-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        1,
        NOW() + INTERVAL '1 day',
        NOW() + INTERVAL '5 days',
        'pending',
        0, 0, 0, 'not_required',
        'Autonomous obstacle avoidance robot for Semester 5 Embedded Systems mini-project.',
        NULL, NULL, NULL, NULL, NULL, NULL
    ),
    -- 2. Approved Request: Approved ESP-32
    (
        'b2222222-0000-0000-0000-000000000002',
        'd0000002-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000001',
        1,
        NOW(),
        NOW() + INTERVAL '4 days',
        'approved',
        0, 0, 0, 'not_required',
        'IoT smart weather station sending MQTT telemetry to AWS IoT Core.',
        'b0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours',
        NULL, NULL, NULL, NULL
    ),
    -- 3. Checked Out: Raspberry Pi 4 currently issued
    (
        'b3333333-0000-0000-0000-000000000003',
        'd0000004-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000001',
        1,
        NOW() - INTERVAL '2 days',
        NOW() + INTERVAL '3 days',
        'checked_out',
        5000, 200000, 225000, 'paid',
        'Computer vision edge inference node with OpenCV and MobileNet v2.',
        'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days',
        'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days',
        NULL, NULL
    ),
    -- 4. Completed Booking: DHT11 returned in good order
    (
        'b4444444-0000-0000-0000-000000000004',
        'd0000003-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        2,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '3 days',
        'completed',
        0, 0, 0, 'not_required',
        'Greenhouse climate monitoring proof of concept experiment.',
        'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '10 days',
        'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '10 days',
        'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days'
    ),
    -- 5. Incident Review: DMM with loose terminal probe
    (
        'b5555555-0000-0000-0000-000000000005',
        'd0000007-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-000000000002',
        1,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '1 day',
        'incident_review',
        0, 50000, 50000, 'pending',
        'High voltage capacitor charging circuit testing.',
        'b0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '5 days',
        'b0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '5 days',
        'b0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '1 day'
    )
ON CONFLICT (id) DO NOTHING;

-- 8. Condition Reports (Checkout & Return)
INSERT INTO public.condition_reports (id, booking_id, report_type, condition, notes, evidence_paths, submitted_by)
VALUES
    -- Checkout report for RPi 4
    (
        'cr000001-0000-0000-0000-000000000001',
        'b3333333-0000-0000-0000-000000000003',
        'checkout',
        'excellent',
        'Tested HDMI output and USB ports. All working normally. Included SanDisk 32GB SD card and power adaptor.',
        ARRAY['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300'],
        'b0000000-0000-0000-0000-000000000002'
    ),
    -- Return report for completed DHT11
    (
        'cr000002-0000-0000-0000-000000000002',
        'b4444444-0000-0000-0000-000000000004',
        'return',
        'good',
        'Returned in original static protective pouch. Pins straight and fully operational.',
        ARRAY['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'],
        'b0000000-0000-0000-0000-000000000002'
    ),
    -- Return report for DMM with loose probe
    (
        'cr000003-0000-0000-0000-000000000003',
        'b5555555-0000-0000-0000-000000000005',
        'return',
        'damaged',
        'Red positive test lead banana plug terminal sheath cracked during use.',
        ARRAY['https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=300'],
        'b0000000-0000-0000-0000-000000000003'
    )
ON CONFLICT (id) DO NOTHING;

-- 9. Incidents (Fictional demonstration incident)
INSERT INTO public.incidents (id, booking_id, reported_by, incident_type, description, status, assigned_to, resolution_notes)
VALUES
    (
        'inc00001-0000-0000-0000-000000000001',
        'b5555555-0000-0000-0000-000000000005',
        'b0000000-0000-0000-0000-000000000003',
        'damage',
        'Red test lead wire sheath pulled loose from banana plug jack. Multimeter main body intact and calibration accurate.',
        'investigating',
        'b0000000-0000-0000-0000-000000000003',
        'Lead probe replacement estimated at INR 350. Discussed with borrower; partial deposit deduction under review.'
    )
ON CONFLICT (id) DO NOTHING;

-- 10. Waitlist Entries
INSERT INTO public.waitlist_entries (id, resource_id, user_id, quantity, status, queue_position, priority_reason)
VALUES
    (
        'w0000001-0000-0000-0000-000000000001',
        'd0000005-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-000000000002',
        1,
        'active',
        1,
        'Final Year Capstone Project — RF Signal Analysis'
    )
ON CONFLICT (id) DO NOTHING;

-- 11. Audit Logs
INSERT INTO public.audit_logs (id, actor_id, institution_id, entity_type, entity_id, action, metadata)
VALUES
    ('a1111111-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'institution', '11111111-1111-1111-1111-111111111111', 'verified', '{"verified_by": "Dr. Vikram Seth"}'::jsonb),
    ('a2222222-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'resource', 'd0000001-0000-0000-0000-000000000001', 'created', '{"name": "Arduino Uno Rev3", "quantity": 5}'::jsonb),
    ('a3333333-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'booking', 'b3333333-0000-0000-0000-000000000003', 'issued', '{"unit": "NIT-RPI-01", "issued_to": "Aarav Sharma"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 12. Notifications
INSERT INTO public.notifications (id, user_id, event_type, title, message, related_booking_id)
VALUES
    (
        'n0000001-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'booking_approved',
        'Booking Request Approved!',
        'Your request for ESP-32 NodeMCU Wi-Fi Board has been approved by Greenfield Engineering College. You may pick it up at Makerspace Room 102.',
        'b2222222-0000-0000-0000-000000000002'
    ),
    (
        'n0000002-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'item_issued',
        'Equipment Issued',
        'Raspberry Pi 4 Model B (Asset Tag: NIT-RPI-01) has been checked out to you. Due date: in 3 days.',
        'b3333333-0000-0000-0000-000000000003'
    )
ON CONFLICT (id) DO NOTHING;

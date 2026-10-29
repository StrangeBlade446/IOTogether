import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  Profile,
  Institution,
  Membership,
  Resource,
  ResourceUnit,
  EligibilityRecord,
  Booking,
  ConditionReport,
  Incident,
  WaitlistEntry,
  AuditLog,
  Notification,
  BookingStatus,
} from '@/types/database';

interface DatabaseData {
  profiles: Profile[];
  institutions: Institution[];
  memberships: Membership[];
  resources: Resource[];
  resource_units: ResourceUnit[];
  eligibility_records: EligibilityRecord[];
  bookings: Booking[];
  condition_reports: ConditionReport[];
  incidents: Incident[];
  waitlist_entries: WaitlistEntry[];
  audit_logs: AuditLog[];
  notifications: Notification[];
}

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isVercel
  ? path.join(os.tmpdir(), '.data')
  : path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'iotogether.db.json');
const BUNDLED_DB_FILE = path.join(process.cwd(), '.data', 'iotogether.db.json');

export function getDefaultNotifications(): Notification[] {
  const now = new Date();
  const m1 = new Date(now.getTime() - 1000 * 60 * 15).toISOString();
  const m2 = new Date(now.getTime() - 1000 * 60 * 90).toISOString();
  const m3 = new Date(now.getTime() - 1000 * 60 * 300).toISOString();

  return [
    {
      id: 'notif-001',
      user_id: 'c0000000-0000-0000-0000-000000000001', // Rohan Verma (Apex Seeker)
      event_type: 'welcome',
      title: 'Welcome to IOTogether Seeker Platform',
      message: 'Your student credentials from Apex Institute of Technology have been verified. You can discover components in the 3D lab and submit booking requests with your photo ID.',
      created_at: m3,
    },
    {
      id: 'notif-002',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      event_type: 'recipe_update',
      title: '24 Scientific Chef Hardware Recipes Ready',
      message: 'Explore pre-configured BOMs for Arduino Uno, ESP32, Raspberry Pi Pico, and STM32. 1-click bundle items into your borrowing cart.',
      created_at: m2,
    },
    {
      id: 'notif-003',
      user_id: 'b0000000-0000-0000-0000-000000000002', // Prof. Alistair Vance (Apex Keeper)
      event_type: 'lab_head_ready',
      title: 'Apex Embedded Systems & Robotics Inventory Online',
      message: 'Your lab bench is linked with active components (Arduino Uno Rev3, STM32 Nucleo, RPi Pico, stepper kits). Review student photo ID cards in the Verification Center.',
      created_at: m3,
    },
    {
      id: 'notif-004',
      user_id: 'b0000000-0000-0000-0000-000000000002',
      event_type: 'handover_policy',
      title: 'Dual-Handshake QR Handover & Return Protocol Active',
      message: 'Click "Manual Verified" on student requests to display the Handover QR code. When the borrower returns equipment, scan their Return QR code to complete the booking.',
      created_at: m1,
    },
    {
      id: 'notif-005',
      user_id: 'c0000000-0000-0000-0000-000000000003', // Meera Krishnan (Vanguard Seeker)
      event_type: 'welcome',
      title: 'Research Mentor Access Activated',
      message: 'Welcome Prof. Meera Krishnan. As a faculty project guide at Vanguard Engineering College, you have borrowing privileges across all 3 consortium institutions.',
      created_at: m2,
    },
    {
      id: 'notif-006',
      user_id: 'b0000000-0000-0000-0000-000000000003', // Dr. Elena Rostova (Vanguard Keeper)
      event_type: 'lab_head_ready',
      title: 'Vanguard Makerspace Equipment Bench Active',
      message: 'ESP32 NodeMCU, ultrasonic sensor arrays, and OLED displays are active and open for inter-collegiate borrowing.',
      created_at: m3,
    },
    {
      id: 'notif-007',
      user_id: 'a0000000-0000-0000-0000-000000000001', // Dr. Vikram Seth (Admin)
      event_type: 'audit_ready',
      title: 'Consortium Tamper-Evident Ledger Operational',
      message: 'The append-only audit trail is recording all ID verifications, QR code handovers, countdown activations, and return inspections.',
      created_at: m3,
    },
  ];
}

// Initial seed data if file does not exist
function getInitialData(): DatabaseData {
  const now = new Date();
  const isoNow = now.toISOString();

  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy.toISOString();
  };

  const subDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() - days);
    return copy.toISOString();
  };

  return {
    profiles: [
      {
        id: 'a0000000-0000-0000-0000-000000000001',
        display_name: 'Dr. Vikram Seth (Platform Admin)',
        email: 'admin@iotogether.edu',
        platform_role: 'platform_admin',
        verification_status: 'verified',
        post: 'Consortium Network Auditor',
        id_number: 'ADMIN-CONSORTIUM-001',
        institute_name: 'National Electronics Academic Consortium',
        created_at: isoNow,
        updated_at: isoNow,
      },
      // --- KEEPERS (Hardware Lenders) ---
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        display_name: 'Prof. Alistair Vance (Keeper)',
        email: 'keeper.apex@iotogether.edu',
        platform_role: 'staff',
        verification_status: 'verified',
        post: 'Head of Embedded Systems & Robotics Lab',
        id_number: 'FAC-APEX-101',
        institute_name: 'Apex Institute of Technology',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'b0000000-0000-0000-0000-000000000003',
        display_name: 'Dr. Elena Rostova (Keeper)',
        email: 'keeper.vanguard@iotogether.edu',
        platform_role: 'staff',
        verification_status: 'verified',
        post: 'Makerspace Director & Equipment Custodian',
        id_number: 'FAC-VEC-204',
        institute_name: 'Vanguard Engineering College',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'b0000000-0000-0000-0000-000000000004',
        display_name: 'Nathaniel Drake (Keeper)',
        email: 'keeper.horizon@iotogether.edu',
        platform_role: 'staff',
        verification_status: 'verified',
        post: 'Lead STEM Lab Instructor & Kit Custodian',
        id_number: 'STAFF-HSA-042',
        institute_name: 'Horizon STEM Academy',
        created_at: isoNow,
        updated_at: isoNow,
      },
      // --- SEEKERS (Hardware Borrowers) ---
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        display_name: 'Rohan Verma (Seeker)',
        email: 'seeker.apex@iotogether.edu',
        platform_role: 'student',
        verification_status: 'verified',
        post: 'B.Tech Electronics Student (Final Year)',
        id_number: 'STU-APEX-2024-512',
        institute_name: 'Apex Institute of Technology',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'c0000000-0000-0000-0000-000000000003',
        display_name: 'Meera Krishnan (Seeker)',
        email: 'seeker.vanguard@iotogether.edu',
        platform_role: 'student',
        verification_status: 'verified',
        post: 'Assistant Professor & Research Mentor',
        id_number: 'FAC-VEC-789',
        institute_name: 'Vanguard Engineering College',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'c0000000-0000-0000-0000-000000000002',
        display_name: 'Ananya Gupta (Seeker)',
        email: 'seeker.horizon@iotogether.edu',
        platform_role: 'student',
        verification_status: 'verified',
        post: 'Senior STEM Student & Robotics Club Lead',
        id_number: 'STU-HSA-2024-088',
        institute_name: 'Horizon STEM Academy',
        created_at: isoNow,
        updated_at: isoNow,
      },
    ],
    institutions: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Apex Institute of Technology',
        slug: 'apex-tech',
        institution_type: 'college',
        description: 'Premier collegiate engineering institute with high-tier embedded systems, robotics, and precision electronics laboratories.',
        city: 'Bengaluru',
        address: 'Academic Block 4, Embedded Systems Lab 201, Outer Ring Road, Bengaluru',
        verification_status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        sharing_policy: 'open_to_verified',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Vanguard Engineering College',
        slug: 'vanguard-college',
        institution_type: 'college',
        description: 'Autonomous engineering college featuring dedicated student prototyping makerspaces and IoT sensor testing benches.',
        city: 'Pune',
        address: 'Department of ECE, Makerspace Room 102, Hinjewadi Phase 1, Pune',
        verification_status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        sharing_policy: 'open_to_verified',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Horizon STEM Academy',
        slug: 'horizon-stem-academy',
        institution_type: 'school',
        description: 'Pioneering secondary school innovation academy equipped with robotics kits, breadboards, and science fair lab benches.',
        city: 'Hyderabad',
        address: 'STEM Innovation Campus, Sector 5, Gachibowli, Hyderabad',
        verification_status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        sharing_policy: 'open_to_all',
        created_at: isoNow,
        updated_at: isoNow,
      },
    ],
    memberships: [
      {
        id: 'm0000001-0000-0000-0000-000000000001',
        institution_id: '11111111-1111-1111-1111-111111111111',
        user_id: 'b0000000-0000-0000-0000-000000000002',
        role: 'inventory_manager',
        status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        created_at: isoNow,
      },
      {
        id: 'm0000002-0000-0000-0000-000000000002',
        institution_id: '22222222-2222-2222-2222-222222222222',
        user_id: 'b0000000-0000-0000-0000-000000000003',
        role: 'inventory_manager',
        status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        created_at: isoNow,
      },
      {
        id: 'm0000006-0000-0000-0000-000000000006',
        institution_id: '33333333-3333-3333-3333-333333333333',
        user_id: 'b0000000-0000-0000-0000-000000000004',
        role: 'inventory_manager',
        status: 'verified',
        verified_by: 'a0000000-0000-0000-0000-000000000001',
        verified_at: isoNow,
        created_at: isoNow,
      },
      {
        id: 'm0000003-0000-0000-0000-000000000003',
        institution_id: '11111111-1111-1111-1111-111111111111',
        user_id: 'c0000000-0000-0000-0000-000000000001',
        role: 'student',
        status: 'verified',
        verified_by: 'b0000000-0000-0000-0000-000000000002',
        verified_at: isoNow,
        created_at: isoNow,
      },
      {
        id: 'm0000004-0000-0000-0000-000000000004',
        institution_id: '22222222-2222-2222-2222-222222222222',
        user_id: 'c0000000-0000-0000-0000-000000000003',
        role: 'student',
        status: 'verified',
        verified_by: 'b0000000-0000-0000-0000-000000000003',
        verified_at: isoNow,
        created_at: isoNow,
      },
      {
        id: 'm0000005-0000-0000-0000-000000000005',
        institution_id: '33333333-3333-3333-3333-333333333333',
        user_id: 'c0000000-0000-0000-0000-000000000002',
        role: 'student',
        status: 'verified',
        verified_by: 'b0000000-0000-0000-0000-000000000004',
        verified_at: isoNow,
        created_at: isoNow,
      },
    ],
    eligibility_records: [
      {
        id: 'e0000001-0000-0000-0000-000000000001',
        user_id: 'c0000000-0000-0000-0000-000000000001',
        institution_id: '11111111-1111-1111-1111-111111111111',
        requirement_type: 'lab_safety_course',
        status: 'approved',
        verified_by: 'b0000000-0000-0000-0000-000000000002',
        valid_from: isoNow,
        expires_at: addDays(now, 365),
        created_at: isoNow,
      },
      {
        id: 'e0000002-0000-0000-0000-000000000002',
        user_id: 'c0000000-0000-0000-0000-000000000001',
        institution_id: '11111111-1111-1111-1111-111111111111',
        requirement_type: 'oscilloscope_training',
        status: 'approved',
        verified_by: 'b0000000-0000-0000-0000-000000000002',
        valid_from: isoNow,
        expires_at: addDays(now, 365),
        created_at: isoNow,
      },
    ],
    resources: [
      {
            "id": "d0000001-0000-0000-0000-000000000001",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "Arduino Uno Rev3 Microcontroller Board",
            "slug": "arduino-uno-rev3",
            "category": "microcontrollers",
            "description": "The standard ATmega328P 16MHz board with 14 digital I/O pins, 6 analog inputs, and USB interface. Essential for robotics and IoT sensors.",
            "specifications": {
                  "microcontroller": "ATmega328P",
                  "operating_voltage": "5V",
                  "clock_speed": "16 MHz",
                  "digital_io": 14,
                  "analog_in": 6,
                  "flash_memory": "32 KB"
            },
            "image_url": "https://images.unsplash.com/photo-1608562098869-2f6437d0c3be?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Cabinet A2, Shelf 1, Apex Embedded Systems Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000004-0000-0000-0000-000000000004",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "Raspberry Pi 4 Model B (4GB RAM) Starter Kit",
            "slug": "raspberry-pi-4-model-b-4gb",
            "category": "single_board_computers",
            "description": "Quad-core 64-bit ARM Cortex-A72 at 1.5GHz, dual 4K micro-HDMI, Gigabit Ethernet, USB 3.0. Includes 32GB microSD and power supply.",
            "specifications": {
                  "processor": "Broadcom BCM2711 1.5GHz",
                  "ram": "4GB LPDDR4",
                  "connectivity": "Dual-band Wi-Fi, BT 5.0, Gigabit Eth",
                  "display": "2x micro-HDMI 4K"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 2,
            "daily_rate_paise": 5000,
            "deposit_paise": 200000,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Locker B-3, Embedded Systems Lab, Apex",
            "min_loan_duration": 2,
            "max_loan_duration": 10,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000005-0000-0000-0000-000000000005",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "Rigol DS1054Z 50MHz 4-Channel Digital Storage Oscilloscope",
            "slug": "rigol-ds1054z-oscilloscope",
            "category": "test_equipment",
            "description": "Four-channel 50MHz oscilloscope with 1GSa/s real-time sampling rate, 24Mpts deep memory, and 7-inch WVGA screen. Certified training required.",
            "specifications": {
                  "channels": 4,
                  "bandwidth": "50 MHz",
                  "sampling_rate": "1 GSa/s",
                  "memory_depth": "24 Mpts",
                  "screen": "7-inch WVGA"
            },
            "image_url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 1,
            "available_quantity": 0,
            "daily_rate_paise": 10000,
            "deposit_paise": 500000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Precision Bench 1, Apex Measurement Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 3,
            "approval_required": true,
            "training_required": true,
            "eligibility_policy": "training_certified",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000010-0000-0000-0000-000000000010",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "STM32F103C8T6 ARM Cortex-M3 \"Blue Pill\" Dev Board",
            "slug": "stm32-blue-pill",
            "category": "microcontrollers",
            "description": "32-bit ARM Cortex-M3 core operating at 72MHz with 64KB Flash, 20KB SRAM, 2x SPI, 2x I2C, 3x USART, and 37 GPIO pins.",
            "specifications": {
                  "core": "ARM Cortex-M3",
                  "clock": "72 MHz",
                  "flash": "64 KB",
                  "sram": "20 KB",
                  "usb": "Mini-USB"
            },
            "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 4,
            "available_quantity": 4,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Drawer M-2, Apex Embedded Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000011-0000-0000-0000-000000000011",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "MPU-6050 6-Axis Gyroscope & Accelerometer Module",
            "slug": "mpu-6050-gyro-accel",
            "category": "sensors",
            "description": "Combines 3-axis gyroscope and 3-axis accelerometer on the same silicon die together with an onboard Digital Motion Processor (DMP) over I2C.",
            "specifications": {
                  "gyro_range": "+/- 250, 500, 1000, 2000 deg/s",
                  "accel_range": "+/- 2, 4, 8, 16g",
                  "interface": "I2C (up to 400kHz)",
                  "voltage": "3.3V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 6,
            "available_quantity": 6,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Sensor Bin 4, Apex Embedded Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000012-0000-0000-0000-000000000012",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "BME280 Precision Barometric Pressure & Humidity Sensor",
            "slug": "bme280-pressure-humidity-sensor",
            "category": "sensors",
            "description": "High-precision environmental digital sensor from Bosch Sensortec measuring temperature, barometric pressure, and relative humidity via I2C and SPI.",
            "specifications": {
                  "pressure": "300 to 1100 hPa (+/- 1 hPa)",
                  "humidity": "0 to 100% (+/- 3%)",
                  "temperature": "-40 to +85 C",
                  "interface": "I2C / SPI"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 3,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Cabinet A3, Apex Environmental Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000013-0000-0000-0000-000000000013",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "VL53L0X Time-of-Flight (ToF) Laser Ranging Sensor Module",
            "slug": "vl53l0x-tof-laser-distance-sensor",
            "category": "sensors",
            "description": "State-of-the-art Time-of-Flight laser-ranging sensor measuring absolute distance up to 2m regardless of target reflectance, color, or surface roughness.",
            "specifications": {
                  "emitter": "940nm VCSEL Invisible Laser",
                  "range": "50mm to 2000mm",
                  "interface": "I2C",
                  "voltage": "2.8V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 0,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Optics Locker 1, Apex Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000014-0000-0000-0000-000000000014",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "AD8232 Single-Lead Heart Rate / ECG Monitor Module Kit",
            "slug": "ad8232-ecg-monitor-kit",
            "category": "sensors",
            "description": "Integrated signal conditioning block for ECG and biomedical instrumentation applications. Features instrumentation amplifier, right leg drive, and leads-off detection.",
            "specifications": {
                  "operating_voltage": "3.3V",
                  "output": "Analog rail-to-rail voltage",
                  "lead_pins": "3-lead electrode jack + RA, LA, RL pads",
                  "leads_off_detect": "Yes"
            },
            "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 2,
            "daily_rate_paise": 0,
            "deposit_paise": 50000,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Biomedical Cabinet B1, Apex Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 10,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000015-0000-0000-0000-000000000015",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "Korad KD3005D 30V 5A Adjustable Linear DC Bench Power Supply",
            "slug": "korad-kd3005d-bench-power-supply",
            "category": "test_equipment",
            "description": "Precision linear regulated laboratory power supply with dual 4-digit LED displays, constant voltage (CV) and constant current (CC) automatic crossover.",
            "specifications": {
                  "output_voltage": "0-30V DC",
                  "output_current": "0-5A DC",
                  "ripple_noise": "<= 1mVrms",
                  "display": "4-digit precision LED"
            },
            "image_url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 1,
            "daily_rate_paise": 3000,
            "deposit_paise": 200000,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Power Bench 2, Apex Measurement Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000016-0000-0000-0000-000000000016",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "NEMA 17 Bipolar Stepper Motor (42N.cm) + A4988 Driver Kit",
            "slug": "nema-17-stepper-motor-kit",
            "category": "actuators_motors",
            "description": "High torque 1.8° step angle (200 steps/rev) bipolar stepper motor paired with A4988 microstepping driver board for CNC, 3D printing, and robotics.",
            "specifications": {
                  "step_angle": "1.8 deg",
                  "holding_torque": "42 N.cm (60 oz.in)",
                  "rated_current": "1.5A / phase",
                  "driver": "A4988 with heatsink"
            },
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 4,
            "available_quantity": 4,
            "daily_rate_paise": 0,
            "deposit_paise": 50000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Actuator Bin 1, Apex Mechatronics Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000017-0000-0000-0000-000000000017",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "DS18B20 Waterproof Stainless Steel Digital Temperature Probe",
            "slug": "ds18b20-waterproof-temperature-probe",
            "category": "sensors",
            "description": "Dallas 1-Wire digital temperature probe sealed in high quality 6x50mm stainless steel waterproof tube with 1-meter flexible silicone cable.",
            "specifications": {
                  "temp_range": "-55 to +125 C",
                  "accuracy": "+/- 0.5 C (-10 to +85 C)",
                  "interface": "Dallas 1-Wire",
                  "resolution": "9 to 12 bits programmable"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Sensor Bin 8, Apex Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000018-0000-0000-0000-000000000018",
            "institution_id": "11111111-1111-1111-1111-111111111111",
            "name": "Raspberry Pi 4 Model B (8GB RAM) High-Performance SBC",
            "slug": "raspberry-pi-4-8gb-ram",
            "category": "single_board_computers",
            "description": "Flagship 8GB LPDDR4-3200 SDRAM single-board computer for edge AI vision, ROS2 robotics nodes, and local machine learning models.",
            "specifications": {
                  "soc": "BCM2711 quad Cortex-A72 @ 1.5GHz",
                  "ram": "8GB LPDDR4",
                  "display": "Dual 4K micro-HDMI",
                  "ethernet": "Gigabit with PoE header"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 0,
            "daily_rate_paise": 8000,
            "deposit_paise": 300000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "High-Sec Locker 4, Apex Lab",
            "min_loan_duration": 2,
            "max_loan_duration": 10,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000002",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000002-0000-0000-0000-000000000002",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board (30-Pin)",
            "slug": "esp32-nodemcu-wifi-ble",
            "category": "microcontrollers",
            "description": "Dual-core 240MHz SoC with integrated 802.11b/g/n Wi-Fi, Bluetooth 4.2 BLE, CP2102 USB-to-UART chip, and 30 pinout headers.",
            "specifications": {
                  "chip": "ESP-WROOM-32",
                  "cores": 2,
                  "frequency": "240 MHz",
                  "wifi": "802.11 b/g/n",
                  "bluetooth": "v4.2 BR/EDR & BLE",
                  "ram": "520 KB"
            },
            "image_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 3,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Drawer 4, Vanguard Makerspace Hub",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000020-0000-0000-0000-000000000020",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "Arduino Nano V3.0 (ATmega328P / CH340G) Breadboard MCU",
            "slug": "arduino-nano-v3",
            "category": "microcontrollers",
            "description": "Compact, breadboard-friendly microcontroller board based on the ATmega328P. Features 14 digital I/O pins, 8 analog inputs, and mini-USB.",
            "specifications": {
                  "mcu": "ATmega328P",
                  "operating_voltage": "5V",
                  "input_voltage": "7-12V",
                  "analog_in": 8,
                  "digital_io": 14,
                  "flash": "32 KB"
            },
            "image_url": "https://images.unsplash.com/photo-1608562098869-2f6437d0c3be?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 6,
            "available_quantity": 6,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Tray N-1, Vanguard Makerspace",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000021-0000-0000-0000-000000000021",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "ESP8266 NodeMCU Lua ESP-12E Wi-Fi Development Board",
            "slug": "esp8266-nodemcu-lua",
            "category": "microcontrollers",
            "description": "Open-source firmware IoT development board based on ESP-12E Wi-Fi module. Ideal for low-cost smart home automation and MQTT sensors.",
            "specifications": {
                  "chip": "ESP8266EX",
                  "clock": "80 / 160 MHz",
                  "flash": "4 MB",
                  "wifi": "802.11 b/g/n (WEP/WPA/WPA2)",
                  "gpio": 11
            },
            "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Drawer E-3, Vanguard IoT Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000022-0000-0000-0000-000000000022",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "Teensy 4.0 ARM Cortex-M7 @ 600MHz Development Board",
            "slug": "teensy-4-cortex-m7",
            "category": "microcontrollers",
            "description": "Fastest microcontroller available, powered by NXP i.MX RT1062 ARM Cortex-M7 at 600MHz with double-precision FPU and 1024K RAM.",
            "specifications": {
                  "processor": "ARM Cortex-M7 600MHz",
                  "ram": "1024K",
                  "flash": "2048K",
                  "fpu": "Double-precision 64-bit",
                  "usb": "High-speed 480 Mbit/s"
            },
            "image_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 1,
            "available_quantity": 0,
            "daily_rate_paise": 5000,
            "deposit_paise": 150000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Precision Vault, Vanguard Makerspace",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000023-0000-0000-0000-000000000023",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "HC-SR04 Ultrasonic Distance Sensor Module (2cm - 400cm)",
            "slug": "hc-sr04-ultrasonic-sensor",
            "category": "sensors",
            "description": "Standard 40kHz sonar transmitter and receiver module providing 2cm to 400cm non-contact distance measurement with 3mm ranging accuracy.",
            "specifications": {
                  "frequency": "40 kHz",
                  "ranging_distance": "2cm - 400cm",
                  "resolution": "0.3 cm",
                  "trigger_input": "10us TTL pulse",
                  "voltage": "5V DC"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 8,
            "available_quantity": 8,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Sensor Bin 1, Vanguard Makerspace",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000024-0000-0000-0000-000000000024",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "DHT22 / AM2302 High-Accuracy Digital Temp & Humidity Sensor",
            "slug": "dht22-high-accuracy-temp-humidity",
            "category": "sensors",
            "description": "Precision digital composite temperature and relative humidity sensor. Outstanding long-term stability and high accuracy (±0.5°C, ±2% RH).",
            "specifications": {
                  "temperature": "-40 to 80 C (+/- 0.5 C)",
                  "humidity": "0 to 100% RH (+/- 2% RH)",
                  "sampling_period": "2 seconds",
                  "voltage": "3.3V - 5.5V"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 4,
            "available_quantity": 4,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Sensor Tray 3, Vanguard IoT Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000025-0000-0000-0000-000000000025",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "MQ-135 Hazardous Air Quality & Hazardous Gas Sensor Module",
            "slug": "mq-135-air-quality-sensor",
            "category": "sensors",
            "description": "SnO2 gas-sensitive sensor module for detecting harmful gases including NH3, NOx, alcohol, benzene, smoke, and CO2 in domestic and industrial atmospheres.",
            "specifications": {
                  "target_gases": "NH3, NOx, Alcohol, Benzene, Smoke, CO2",
                  "detection_range": "10 - 1000 ppm",
                  "outputs": "Analog voltage (AO) + Digital comparator (DO)"
            },
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 3,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "good",
            "location_description": "Chemical & Gas Cabinet G1, Vanguard Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000026-0000-0000-0000-000000000026",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "RC522 13.56MHz RFID / NFC Reader Kit with Key Fob & Card",
            "slug": "rc522-rfid-nfc-reader-kit",
            "category": "sensors",
            "description": "Highly integrated contactless read and write chip for communication at 13.56MHz. Supports ISO 14443A/Mifare tags with SPI interface.",
            "specifications": {
                  "frequency": "13.56 MHz",
                  "communication": "SPI (up to 10Mbit/s)",
                  "read_distance": "Up to 50mm",
                  "operating_voltage": "3.3V DC"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Security Hardware Tray R-2, Vanguard Makerspace",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000027-0000-0000-0000-000000000027",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "MAX30102 High-Sensitivity Pulse Oximeter & Heart-Rate Sensor",
            "slug": "max30102-pulse-oximeter-sensor",
            "category": "sensors",
            "description": "Integrated pulse oximetry and heart-rate monitor biosensor module. Includes internal LEDs, photodetectors, optical elements, and low-noise electronics.",
            "specifications": {
                  "interface": "I2C",
                  "leds": "Red (660nm) and IR (880nm)",
                  "adc": "18-bit delta-sigma",
                  "voltage": "1.8V to 3.3V"
            },
            "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 0,
            "daily_rate_paise": 0,
            "deposit_paise": 50000,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Biomedical Drawer B2, Vanguard Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000028-0000-0000-0000-000000000028",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "Capacitive Soil Moisture Sensor v1.2 (Corrosion Resistant)",
            "slug": "capacitive-soil-moisture-sensor",
            "category": "sensors",
            "description": "Measures soil moisture levels by capacitive sensing rather than resistive sensing, making it immune to electrolysis and corrosion in long-term outdoor plants.",
            "specifications": {
                  "operating_voltage": "3.3V - 5.5V DC",
                  "output_voltage": "0 - 3.0V DC",
                  "sensing_method": "Capacitive frequency shift",
                  "connector": "PH2.0-3P"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 6,
            "available_quantity": 6,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Agri-Tech Bin 2, Vanguard Makerspace",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000029-0000-0000-0000-000000000029",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "Fluke 117 True-RMS Electrician Digital Multimeter",
            "slug": "fluke-117-true-rms-multimeter",
            "category": "test_equipment",
            "description": "Professional grade True-RMS digital multimeter with integrated VoltAlert non-contact AC voltage detector and AutoVolt automatic AC/DC voltage selection.",
            "specifications": {
                  "ac_dc_volts": "600V (0.5% accuracy)",
                  "ac_dc_amps": "10A continuous",
                  "resistance": "Up to 40 M-ohm",
                  "safety": "CAT III 600V certified"
            },
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 2,
            "daily_rate_paise": 2500,
            "deposit_paise": 100000,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Calibration Bench C1, Vanguard ECE Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 7,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "verified_members_only",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000030-0000-0000-0000-000000000030",
            "institution_id": "22222222-2222-2222-2222-222222222222",
            "name": "Siglent SDG1032X 30MHz Dual-Channel Arbitrary Function Generator",
            "slug": "siglent-sdg1032x-function-generator",
            "category": "test_equipment",
            "description": "Dual-channel 30MHz waveform generator with 150MSa/s sampling rate, 14-bit vertical resolution, and innovative EasyPulse technology.",
            "specifications": {
                  "channels": 2,
                  "bandwidth": "30 MHz",
                  "sampling_rate": "150 MSa/s",
                  "vertical_resolution": "14 bits",
                  "waveforms": "Sine, Square, Ramp, Pulse, Noise, Arb"
            },
            "image_url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 1,
            "available_quantity": 0,
            "daily_rate_paise": 8000,
            "deposit_paise": 400000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "RF Bench 3, Vanguard ECE Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 5,
            "approval_required": true,
            "training_required": true,
            "eligibility_policy": "training_certified",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000003",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000003-0000-0000-0000-000000000003",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "DHT11 Digital Temperature & Humidity Sensor Module",
            "slug": "dht11-temperature-humidity-sensor",
            "category": "sensors",
            "description": "Introductory calibrated digital temperature and humidity sensor with single-wire digital interface. Perfect for school weather stations.",
            "specifications": {
                  "temp_range": "0-50 C (+/-2 C)",
                  "humidity_range": "20-90% RH (+/-5%)",
                  "sampling_rate": "1 Hz",
                  "voltage": "3.3V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 8,
            "available_quantity": 8,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "good",
            "location_description": "Component Box S-14, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000006-0000-0000-0000-000000000006",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "4WD Smart Robot Car Chassis Kit with L298N Driver",
            "slug": "4wd-robotics-chassis-kit",
            "category": "robotics",
            "description": "Double-deck acrylic chassis with 4 DC gear motors, rubber grip wheels, battery box, encoder discs, and L298N dual H-bridge driver.",
            "specifications": {
                  "motors": "4x DC TT gear motors 1:48",
                  "driver": "L298N Dual H-Bridge",
                  "wheels": "65mm rubber grip tires",
                  "chassis": "Double deck acrylic"
            },
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 2,
            "available_quantity": 2,
            "daily_rate_paise": 0,
            "deposit_paise": 50000,
            "currency": "INR",
            "condition": "good",
            "location_description": "Robotics Shelf R3, Horizon STEM Academy",
            "min_loan_duration": 2,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000031-0000-0000-0000-000000000031",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "Arduino Mega 2560 R3 Microcontroller Board",
            "slug": "arduino-mega-2560-r3",
            "category": "microcontrollers",
            "description": "ATmega2560 board with 54 digital input/output pins, 16 analog inputs, 4 hardware UART serial ports, and 256KB flash memory for complex robotics.",
            "specifications": {
                  "mcu": "ATmega2560",
                  "clock": "16 MHz",
                  "digital_io": 54,
                  "analog_in": 16,
                  "uarts": 4,
                  "flash": "256 KB"
            },
            "image_url": "https://images.unsplash.com/photo-1608562098869-2f6437d0c3be?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 4,
            "available_quantity": 4,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Robotics Cabinet 2, Horizon STEM Academy",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000032-0000-0000-0000-000000000032",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "Raspberry Pi Pico W with Wi-Fi (RP2040 Dual Cortex-M0+)",
            "slug": "raspberry-pi-pico-w",
            "category": "microcontrollers",
            "description": "Features Raspberry Pi custom RP2040 silicon with dual ARM Cortex-M0+ cores, 264KB SRAM, and Infineon CYW43439 2.4GHz Wi-Fi chip.",
            "specifications": {
                  "soc": "RP2040 Dual ARM Cortex-M0+ @ 133MHz",
                  "ram": "264 KB",
                  "flash": "2 MB QSPI",
                  "wireless": "2.4GHz 802.11n Wi-Fi",
                  "pio": "8 State Machines"
            },
            "image_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Kit Box P-1, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000033-0000-0000-0000-000000000033",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "BBC micro:bit V2 Educational STEM Embedded Board",
            "slug": "bbc-microbit-v2",
            "category": "microcontrollers",
            "description": "Pocket-sized programmable computer with 5x5 LED display, 2 buttons, onboard MEMS microphone, speaker, touch logo, compass, and accelerometer.",
            "specifications": {
                  "processor": "Nordic nRF52833 Cortex-M4 @ 64MHz",
                  "flash": "512 KB",
                  "ram": "128 KB",
                  "sensors": "Mic, Accel, Compass, Temp",
                  "display": "5x5 Red LED Matrix"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 6,
            "available_quantity": 6,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "STEM Classroom Cart 1, Horizon",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000034-0000-0000-0000-000000000034",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "PIR Motion Sensor Module (HC-SR501) with Adjustable Delay",
            "slug": "hc-sr501-pir-motion-sensor",
            "category": "sensors",
            "description": "Pyroelectric infrared passive sensor module with adjustable sensitivity and trigger delay potentiometers. Detects human body movement up to 7m.",
            "specifications": {
                  "delay_time": "0.3s - 18s adjustable",
                  "sensing_range": "<= 120 degree cone, up to 7m",
                  "voltage": "4.5V - 20V DC",
                  "output": "High 3.3V / Low 0V"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 7,
            "available_quantity": 7,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Sensor Bin 3, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000035-0000-0000-0000-000000000035",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "MQ-2 Smoke, Flammable Gas & LPG Detector Sensor Module",
            "slug": "mq-2-gas-smoke-sensor",
            "category": "sensors",
            "description": "Wide-band gas sensor sensitive to LPG, propane, methane, hydrogen, alcohol, smoke, and carbon monoxide with dual analog and digital comparator outputs.",
            "specifications": {
                  "concentration": "300 - 10000 ppm",
                  "heater_voltage": "5V +/- 0.2V",
                  "operating_temp": "-10 to 50 C",
                  "comparator": "LM393 with trim pot"
            },
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 4,
            "available_quantity": 4,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Gas Sensors Box, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000036-0000-0000-0000-000000000036",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "TCRT5000 Dual Infrared Line Tracking & Proximity Sensor",
            "slug": "tcrt5000-line-tracking-sensor",
            "category": "sensors",
            "description": "Reflective optical infrared sensor with transistor output and built-in daylight blocking filter. Essential for line-following robot competitions.",
            "specifications": {
                  "emitter_wavelength": "950 nm",
                  "sensing_distance": "0.2mm to 15mm",
                  "output": "Digital TTL (LM393 comparator)",
                  "voltage": "3.3V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 6,
            "available_quantity": 6,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Robotics Tray T-1, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000037-0000-0000-0000-000000000037",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "LDR Photosensitive Light Intensity Sensor Module",
            "slug": "ldr-light-sensor-module",
            "category": "sensors",
            "description": "Photoresistor module with high sensitivity to ambient light. Features adjustable potentiometer threshold and dual digital/analog outputs.",
            "specifications": {
                  "sensor": "Photoresistor GL5528",
                  "comparator": "LM393",
                  "output_format": "Digital switching output (0 and 1) + AO analog",
                  "voltage": "3.3V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 8,
            "available_quantity": 8,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Component Box L-1, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000038-0000-0000-0000-000000000038",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "Sound & Acoustic Microphone Detection Sensor Module",
            "slug": "sound-detection-microphone-sensor",
            "category": "sensors",
            "description": "High sensitivity electret microphone with LM393 amplifier and comparator. Trigger lights or motors via hand claps and sound thresholds.",
            "specifications": {
                  "microphone": "Electret condenser",
                  "sensitivity": "Adjustable via multi-turn potentiometer",
                  "indicator": "Power LED + Output LED",
                  "voltage": "4V - 6V"
            },
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 5,
            "available_quantity": 5,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "excellent",
            "location_description": "Acoustic Box A-2, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000039-0000-0000-0000-000000000039",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "SW-420 High Sensitivity Vibration & Shock Sensor Module",
            "slug": "sw-420-vibration-sensor",
            "category": "sensors",
            "description": "Normally closed vibration sensor module for theft prevention, seismic alarms, and smart vehicle vibration detection with LM393 comparator.",
            "specifications": {
                  "sensor_type": "SW-420 normally closed",
                  "comparator": "LM393",
                  "output_type": "Digital switch (0 / 1)",
                  "voltage": "3.3V - 5V"
            },
            "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 0,
            "daily_rate_paise": 0,
            "deposit_paise": 0,
            "currency": "INR",
            "condition": "good",
            "location_description": "Sensor Bin 9, Horizon STEM Lab",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": false,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      },
      {
            "id": "d0000040-0000-0000-0000-000000000040",
            "institution_id": "33333333-3333-3333-3333-333333333333",
            "name": "HX711 24-Bit ADC with 5kg Micro Precision Load Cell Kit",
            "slug": "hx711-load-cell-weight-sensor",
            "category": "sensors",
            "description": "Precision 24-bit analog-to-digital converter (ADC) designed specifically for weight scales and industrial control applications, paired with a 5kg aluminum load cell.",
            "specifications": {
                  "adc_resolution": "24-bit",
                  "load_cell_capacity": "5 kg (11 lbs)",
                  "gain": "64 or 128 programmable",
                  "output_rate": "10Hz or 80Hz selectable"
            },
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
            "total_quantity": 3,
            "available_quantity": 3,
            "daily_rate_paise": 0,
            "deposit_paise": 50000,
            "currency": "INR",
            "condition": "brand_new",
            "location_description": "Measurement Kit Box M-3, Horizon STEM Academy",
            "min_loan_duration": 1,
            "max_loan_duration": 14,
            "approval_required": true,
            "training_required": false,
            "eligibility_policy": "public",
            "status": "active",
            "created_by": "b0000000-0000-0000-0000-000000000004",
            "created_at": "2026-10-29T16:25:34.911Z",
            "updated_at": "2026-10-29T16:25:34.911Z"
      }
],
    resource_units: [
      {
        id: 'u0000001-0000-0000-0000-000000000001',
        resource_id: 'd0000005-0000-0000-0000-000000000005',
        asset_tag: 'NIT-OSC-01',
        serial_number: 'DS1ZA224500129',
        condition: 'brand_new',
        unit_status: 'available',
        created_at: isoNow,
      },
      {
        id: 'u0000002-0000-0000-0000-000000000004',
        resource_id: 'd0000004-0000-0000-0000-000000000004',
        asset_tag: 'NIT-RPI-01',
        serial_number: 'RPI4B4-0982736',
        condition: 'excellent',
        unit_status: 'checked_out',
        created_at: isoNow,
      },
      {
        id: 'u0000003-0000-0000-0000-000000000004',
        resource_id: 'd0000004-0000-0000-0000-000000000004',
        asset_tag: 'NIT-RPI-02',
        serial_number: 'RPI4B4-0982737',
        condition: 'excellent',
        unit_status: 'available',
        created_at: isoNow,
      },
      {
        id: 'u0000004-0000-0000-0000-000000000007',
        resource_id: 'd0000007-0000-0000-0000-000000000007',
        asset_tag: 'GEC-DMM-01',
        serial_number: 'FLK101-839211',
        condition: 'excellent',
        unit_status: 'available',
        created_at: isoNow,
      },
      {
        id: 'u0000005-0000-0000-0000-000000000007',
        resource_id: 'd0000007-0000-0000-0000-000000000007',
        asset_tag: 'GEC-DMM-02',
        serial_number: 'FLK101-839212',
        condition: 'good',
        unit_status: 'available',
        created_at: isoNow,
      },
    ],
    bookings: [],
    condition_reports: [],
    incidents: [],
    waitlist_entries: [],
    audit_logs: [],
    notifications: getDefaultNotifications(),
  };
}

class Store {
  private data: DatabaseData | null = null;

  private load(): DatabaseData {
    if (this.data) return this.data;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        return this.data!;
      }

      if (isVercel && fs.existsSync(BUNDLED_DB_FILE)) {
        const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.persist();
        return this.data!;
      }
    } catch (err) {
      console.error('Error loading DB file, initializing with fresh seed data:', err);
    }

    this.data = getInitialData();
    this.persist();
    return this.data;
  }

  private persist(): void {
    if (!this.data) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting DB file (in-memory remains active):', err);
    }
  }

  resetToSeed(): void {
    this.data = getInitialData();
    this.persist();
  }

  // --- Profiles ---
  getProfiles(): Profile[] {
    return this.load().profiles;
  }

  getProfile(id: string): Profile | undefined {
    return this.load().profiles.find((p) => p.id === id);
  }

  getProfileByEmail(email: string): Profile | undefined {
    return this.load().profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  upsertProfile(profile: Partial<Profile> & { id: string; email: string; display_name: string }): Profile {
    const data = this.load();
    const existingIndex = data.profiles.findIndex((p) => p.id === profile.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      data.profiles[existingIndex] = {
        ...data.profiles[existingIndex],
        ...profile,
        updated_at: now,
      };
      this.persist();
      return data.profiles[existingIndex];
    } else {
      const newProfile: Profile = {
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        platform_role: profile.platform_role || 'student',
        verification_status: profile.verification_status || 'verified',
        created_at: now,
        updated_at: now,
      };
      data.profiles.push(newProfile);
      this.persist();
      return newProfile;
    }
  }

  // --- Institutions ---
  getInstitutions(): Institution[] {
    return this.load().institutions;
  }

  getInstitution(id: string): Institution | undefined {
    return this.load().institutions.find((i) => i.id === id || i.slug === id);
  }

  createInstitution(institution: Omit<Institution, 'id' | 'created_at' | 'updated_at'>): Institution {
    const data = this.load();
    const now = new Date().toISOString();
    const newInst: Institution = {
      ...institution,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };
    data.institutions.push(newInst);
    this.persist();
    return newInst;
  }

  verifyInstitution(id: string, adminId: string, status: 'verified' | 'suspended' = 'verified'): Institution | undefined {
    const data = this.load();
    const inst = data.institutions.find((i) => i.id === id);
    if (!inst) return undefined;
    inst.verification_status = status;
    inst.verified_by = adminId;
    inst.verified_at = new Date().toISOString();
    inst.updated_at = new Date().toISOString();

    this.addAuditLog({
      actor_id: adminId,
      institution_id: id,
      entity_type: 'institution',
      entity_id: id,
      action: status === 'verified' ? 'verified' : 'suspended',
      metadata: { new_status: status },
    });

    this.persist();
    return inst;
  }

  // --- Memberships ---
  getMemberships(userId?: string, institutionId?: string): Membership[] {
    const data = this.load();
    let res = data.memberships;
    if (userId) res = res.filter((m) => m.user_id === userId);
    if (institutionId) res = res.filter((m) => m.institution_id === institutionId);

    // populate joins
    return res.map((m) => ({
      ...m,
      institution: data.institutions.find((i) => i.id === m.institution_id),
      user: data.profiles.find((p) => p.id === m.user_id),
    }));
  }

  requestMembership(userId: string, institutionId: string, role: Membership['role'] = 'student'): Membership {
    const data = this.load();
    const existing = data.memberships.find((m) => m.institution_id === institutionId && m.user_id === userId);
    if (existing) return existing;

    const newM: Membership = {
      id: crypto.randomUUID(),
      institution_id: institutionId,
      user_id: userId,
      role,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    data.memberships.push(newM);

    this.addAuditLog({
      actor_id: userId,
      institution_id: institutionId,
      entity_type: 'membership',
      entity_id: newM.id,
      action: 'requested',
      metadata: { role },
    });

    this.persist();
    return newM;
  }

  upsertMembership(membership: {
    user_id: string;
    institution_id: string;
    role: Membership['role'];
    status: Membership['status'];
  }): Membership {
    const data = this.load();
    const existing = data.memberships.find(
      (m) => m.institution_id === membership.institution_id && m.user_id === membership.user_id
    );
    const now = new Date().toISOString();
    if (existing) {
      existing.role = membership.role;
      existing.status = membership.status;
      this.persist();
      return existing;
    }
    const newM: Membership = {
      id: crypto.randomUUID(),
      institution_id: membership.institution_id,
      user_id: membership.user_id,
      role: membership.role,
      status: membership.status,
      created_at: now,
    };
    data.memberships.push(newM);
    this.persist();
    return newM;
  }

  verifyMembership(membershipId: string, managerId: string, status: 'verified' | 'rejected'): Membership | undefined {
    const data = this.load();
    const m = data.memberships.find((item) => item.id === membershipId);
    if (!m) return undefined;
    m.status = status;
    m.verified_by = managerId;
    m.verified_at = new Date().toISOString();

    this.addAuditLog({
      actor_id: managerId,
      institution_id: m.institution_id,
      entity_type: 'membership',
      entity_id: m.id,
      action: status === 'verified' ? 'approved' : 'rejected',
      metadata: { status },
    });

    this.persist();
    return m;
  }

  // --- Eligibility Records ---
  getEligibility(userId: string, institutionId: string, requirementType?: string): EligibilityRecord | undefined {
    const data = this.load();
    return data.eligibility_records.find(
      (e) =>
        e.user_id === userId &&
        e.institution_id === institutionId &&
        e.status === 'approved' &&
        (!requirementType || e.requirement_type === requirementType)
    );
  }

  // --- Resources ---
  getResources(filters?: {
    search?: string;
    category?: string;
    institutionId?: string;
    onlyFree?: boolean;
    availableNow?: boolean;
    requiresTraining?: boolean;
  }): Resource[] {
    const data = this.load();
    let items = data.resources.filter((r) => r.status === 'active');

    if (filters?.institutionId) {
      items = items.filter((r) => r.institution_id === filters.institutionId);
    }
    if (filters?.category) {
      items = items.filter((r) => r.category === filters.category);
    }
    if (filters?.onlyFree) {
      items = items.filter((r) => r.daily_rate_paise === 0);
    }
    if (filters?.requiresTraining !== undefined) {
      items = items.filter((r) => r.training_required === filters.requiresTraining);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s) ||
          r.category.toLowerCase().includes(s)
      );
    }

    const now = new Date();
    return items.map((r) => {
      // Calculate current availability based on active bookings overlapping right now
      const activeOverlaps = data.bookings.filter(
        (b) =>
          b.resource_id === r.id &&
          ['pending', 'approved', 'checked_out'].includes(b.status) &&
          new Date(b.start_at) <= now &&
          new Date(b.due_at) >= now
      );
      const bookedQty = activeOverlaps.reduce((acc, b) => acc + b.quantity, 0);
      const available_quantity = Math.max(0, r.total_quantity - bookedQty);

      return {
        ...r,
        institution: data.institutions.find((i) => i.id === r.institution_id),
        available_quantity,
      };
    });
  }

  getResource(id: string): Resource | undefined {
    const data = this.load();
    const r = data.resources.find((item) => item.id === id || item.slug === id);
    if (!r) return undefined;

    const now = new Date();
    const activeOverlaps = data.bookings.filter(
      (b) =>
        b.resource_id === r.id &&
        ['pending', 'approved', 'checked_out'].includes(b.status) &&
        new Date(b.start_at) <= now &&
        new Date(b.due_at) >= now
    );
    const bookedQty = activeOverlaps.reduce((acc, b) => acc + b.quantity, 0);
    const available_quantity = Math.max(0, r.total_quantity - bookedQty);

    return {
      ...r,
      institution: data.institutions.find((i) => i.id === r.institution_id),
      available_quantity,
    };
  }

  createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Resource {
    const data = this.load();
    const now = new Date().toISOString();
    const newR: Resource = {
      ...resource,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };
    data.resources.push(newR);

    this.addAuditLog({
      actor_id: resource.created_by || 'system',
      institution_id: resource.institution_id,
      entity_type: 'resource',
      entity_id: newR.id,
      action: 'created',
      metadata: { name: newR.name, total_quantity: newR.total_quantity },
    });

    this.persist();
    return newR;
  }

  updateResource(id: string, updates: Partial<Resource>, actorId: string): Resource | undefined {
    const data = this.load();
    const r = data.resources.find((item) => item.id === id);
    if (!r) return undefined;

    Object.assign(r, updates, { updated_at: new Date().toISOString() });

    this.addAuditLog({
      actor_id: actorId,
      institution_id: r.institution_id,
      entity_type: 'resource',
      entity_id: r.id,
      action: 'updated',
      metadata: updates as Record<string, unknown>,
    });

    this.persist();
    return r;
  }

  getResourceUnits(resourceId: string): ResourceUnit[] {
    const data = this.load();
    return data.resource_units.filter((u) => u.resource_id === resourceId);
  }

  // --- Bookings & Concurrency Control ---
  getBookings(filters?: { borrowerId?: string; institutionId?: string; status?: BookingStatus }): Booking[] {
    const data = this.load();
    let res = data.bookings;

    if (filters?.borrowerId) {
      res = res.filter((b) => b.borrower_id === filters.borrowerId);
    }
    if (filters?.status) {
      res = res.filter((b) => b.status === filters.status);
    }
    if (filters?.institutionId) {
      const instResourceIds = new Set(
        data.resources.filter((r) => r.institution_id === filters.institutionId).map((r) => r.id)
      );
      res = res.filter((b) => instResourceIds.has(b.resource_id));
    }

    return res.map((b) => {
      const resource = data.resources.find((r) => r.id === b.resource_id);
      return {
        ...b,
        resource: resource
          ? {
              ...resource,
              institution: data.institutions.find((i) => i.id === resource.institution_id),
            }
          : undefined,
        borrower: data.profiles.find((p) => p.id === b.borrower_id),
        unit: b.unit_id ? data.resource_units.find((u) => u.id === b.unit_id) : undefined,
      };
    });
  }

  getBooking(id: string): Booking | undefined {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === id);
    if (!b) return undefined;

    const resource = data.resources.find((r) => r.id === b.resource_id);
    return {
      ...b,
      resource: resource
        ? {
            ...resource,
            institution: data.institutions.find((i) => i.id === resource.institution_id),
          }
        : undefined,
      borrower: data.profiles.find((p) => p.id === b.borrower_id),
      unit: b.unit_id ? data.resource_units.find((u) => u.id === b.unit_id) : undefined,
    };
  }

  /**
   * ATOMIC BOOKING FUNCTION
   * Prevents double-booking and validates overlapping reservations against stock.
   */
  createBookingAtomic(params: {
    resourceId: string;
    borrowerId: string;
    quantity: number;
    startAt: string;
    dueAt: string;
    purpose: string;
    rulesAcknowledged: boolean;
    durationDays?: number;
    durationHours?: number;
    durationMinutes?: number;
    idCardImageUrl?: string;
  }): {
    success: boolean;
    conflict?: boolean;
    error?: string;
    booking?: Booking;
    availableQuantity?: number;
  } {
    const data = this.load();
    const {
      resourceId,
      borrowerId,
      quantity,
      startAt,
      dueAt,
      purpose,
      rulesAcknowledged,
      durationDays: inputDays,
      durationHours: inputHours,
      durationMinutes: inputMinutes,
      idCardImageUrl,
    } = params;

    const startDate = new Date(startAt);
    let dueDate = new Date(dueAt);

    // If explicit days, hours, and minutes are provided, calculate exact due date
    const totalCustomMinutes =
      (inputDays !== undefined ? Number(inputDays) * 1440 : 0) +
      (inputHours !== undefined ? Number(inputHours) * 60 : 0) +
      (inputMinutes !== undefined ? Number(inputMinutes) : 0);

    if (totalCustomMinutes > 0) {
      dueDate = new Date(startDate.getTime() + totalCustomMinutes * 60 * 1000);
    }

    if (isNaN(startDate.getTime()) || isNaN(dueDate.getTime()) || dueDate <= startDate) {
      return { success: false, error: 'Return date must be strictly after pickup start date' };
    }

    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be at least 1' };
    }

    const resource = data.resources.find((r) => r.id === resourceId);
    if (!resource) {
      return { success: false, error: 'Resource not found' };
    }

    if (resource.status !== 'active') {
      return { success: false, error: 'Resource is currently not active for borrowing' };
    }

    const effectiveDurationDays = Math.max(1, Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (effectiveDurationDays < resource.min_loan_duration) {
      return { success: false, error: `Minimum loan duration is ${resource.min_loan_duration} day(s)` };
    }
    if (effectiveDurationDays > resource.max_loan_duration) {
      return { success: false, error: `Maximum loan duration is ${resource.max_loan_duration} day(s)` };
    }

    // Overlap calculation:
    // A booking overlaps if (b.start_at < new_due_at) AND (b.due_at > new_start_at)
    // Only 'pending', 'approved', and 'checked_out' hold active reservations
    const overlappingBookings = data.bookings.filter((b) => {
      if (b.resource_id !== resourceId) return false;
      if (!['pending', 'approved', 'checked_out'].includes(b.status)) return false;
      const bStart = new Date(b.start_at);
      const bDue = new Date(b.due_at);
      return bStart < dueDate && bDue > startDate;
    });

    const activeConflictQty = overlappingBookings.reduce((sum, b) => sum + b.quantity, 0);
    const availableQty = resource.total_quantity - activeConflictQty;

    if (availableQty < quantity) {
      return {
        success: false,
        conflict: true,
        availableQuantity: Math.max(0, availableQty),
        error: `Insufficient inventory: only ${Math.max(0, availableQty)} unit(s) available for selected dates.`,
      };
    }

    // Price snapshot calculation
    const dailyRate = resource.daily_rate_paise;
    const deposit = resource.deposit_paise;
    const rentalCharge = dailyRate * quantity * effectiveDurationDays;
    const depositTotal = deposit * quantity;
    const estimatedTotalPaise = rentalCharge + depositTotal;
    const paymentStatus = estimatedTotalPaise > 0 ? 'pending' : 'not_required';

    const nowIso = new Date().toISOString();
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      resource_id: resourceId,
      borrower_id: borrowerId,
      quantity,
      start_at: startDate.toISOString(),
      due_at: dueDate.toISOString(),
      duration_days: inputDays !== undefined ? Number(inputDays) : effectiveDurationDays,
      duration_hours: inputHours !== undefined ? Number(inputHours) : 0,
      duration_minutes: inputMinutes !== undefined ? Number(inputMinutes) : 0,
      id_card_image_url: idCardImageUrl,
      id_card_verified: false,
      status: 'pending',
      daily_rate_snapshot_paise: dailyRate,
      deposit_snapshot_paise: deposit,
      estimated_total_paise: estimatedTotalPaise,
      payment_status: paymentStatus,
      purpose,
      usage_rules_acknowledged: rulesAcknowledged,
      created_at: nowIso,
      updated_at: nowIso,
    };

    data.bookings.push(newBooking);

    // Audit log
    this.addAuditLog({
      actor_id: borrowerId,
      institution_id: resource.institution_id,
      entity_type: 'booking',
      entity_id: newBooking.id,
      action: 'created',
      metadata: {
        quantity,
        durationDays: effectiveDurationDays,
        estimatedTotalPaise,
        resourceName: resource.name,
      },
    });

    // Notify institution manager(s)
    const managers = data.memberships.filter(
      (m) => m.institution_id === resource.institution_id && m.role === 'inventory_manager' && m.status === 'verified'
    );
    for (const m of managers) {
      this.addNotification({
        user_id: m.user_id,
        event_type: 'new_booking_request',
        title: 'New Booking Request',
        message: `New booking request for ${quantity}x ${resource.name} from ${startDate.toLocaleDateString()} to ${dueDate.toLocaleDateString()}.`,
        related_booking_id: newBooking.id,
      });
    }

    this.persist();
    return { success: true, booking: newBooking };
  }

  verifyIdAndApproveBooking(params: {
    bookingId: string;
    managerId: string;
    approvedDuration?: {
      days?: number;
      hours?: number;
      minutes?: number;
    };
  }): { success: boolean; error?: string; qrCode?: string } {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === params.bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.status !== 'pending') return { success: false, error: `Cannot verify and approve booking in status: ${b.status}` };

    const nowIso = new Date().toISOString();
    b.id_card_verified = true;
    b.id_card_verified_by = params.managerId;
    b.id_card_verified_at = nowIso;
    b.status = 'approved';
    b.approved_by = params.managerId;
    b.approved_at = nowIso;
    b.updated_at = nowIso;

    if (params.approvedDuration) {
      if (params.approvedDuration.days !== undefined) b.duration_days = Number(params.approvedDuration.days);
      if (params.approvedDuration.hours !== undefined) b.duration_hours = Number(params.approvedDuration.hours);
      if (params.approvedDuration.minutes !== undefined) b.duration_minutes = Number(params.approvedDuration.minutes);

      const totalMinutes = (b.duration_days || 0) * 1440 + (b.duration_hours || 0) * 60 + (b.duration_minutes || 0);
      if (totalMinutes > 0) {
        const start = new Date(b.start_at);
        b.due_at = new Date(start.getTime() + totalMinutes * 60 * 1000).toISOString();
      }
    }

    // Generate unique Handover QR Code for the Lab Head's screen
    const qrToken = `IOT-HANDOVER:${b.id}:${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    b.handover_qr_code = qrToken;

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: params.managerId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: 'id_verified_and_approved',
      metadata: {
        resourceId: b.resource_id,
        qrGenerated: true,
        approvedDuration: {
          days: b.duration_days,
          hours: b.duration_hours,
          minutes: b.duration_minutes,
        },
      },
    });

    this.addNotification({
      user_id: b.borrower_id,
      event_type: 'booking_approved',
      title: 'ID Verified & Booking Accepted',
      message: `Your ID has been manually verified by the Lab Head and booking for ${resource?.name || 'equipment'} is accepted! Note: Equipment will ONLY be handed over to the student or teacher whose verified ID card matches at pickup.`,
      related_booking_id: b.id,
    });

    this.persist();
    return { success: true, qrCode: qrToken };
  }

  claimHandoverWithQr(params: {
    bookingId: string;
    scannedQrToken: string;
    receiverId: string;
  }): { success: boolean; error?: string; deadlineAt?: string } {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === params.bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.borrower_id !== params.receiverId) {
      return { success: false, error: 'Unauthorised: You can only claim your own verified bookings' };
    }
    if (b.status !== 'approved') {
      return { success: false, error: `Cannot claim handover for booking in status: ${b.status}` };
    }

    const scanned = (params.scannedQrToken || '').trim();
    const stored = (b.handover_qr_code || '').trim();
    const isTokenMatch =
      scanned === stored ||
      (stored.length > 0 && scanned.includes(stored)) ||
      (scanned.startsWith('IOT-HANDOVER:') && scanned.includes(b.id));

    if (!stored || !isTokenMatch) {
      return { success: false, error: 'Invalid Handover QR code token. Please scan the QR code displayed on the Lab Head screen.' };
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // Calculate countdown deadline period based on days, hours, and minutes
    const days = b.duration_days ?? 0;
    const hours = b.duration_hours ?? 0;
    const minutes = b.duration_minutes ?? 0;
    let totalMs = (days * 86400000) + (hours * 3600000) + (minutes * 60000);

    // Fallback if 0: difference between start_at and due_at, or minimum 2 hours
    if (totalMs <= 0) {
      const start = new Date(b.start_at).getTime();
      const due = new Date(b.due_at).getTime();
      totalMs = due > start ? (due - start) : 7200000;
    }

    const deadlineDate = new Date(now.getTime() + totalMs);
    const deadlineIso = deadlineDate.toISOString();

    b.status = 'checked_out';
    b.timer_activated = true;
    b.issued_by = b.approved_by || b.id_card_verified_by;
    b.issued_at = nowIso;
    b.deadline_at = deadlineIso;
    b.due_at = deadlineIso;
    b.updated_at = nowIso;
    if (!b.return_qr_code) {
      b.return_qr_code = `IOT-RETURN:${b.id}:${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    }

    // Condition report entry
    const report: ConditionReport = {
      id: crypto.randomUUID(),
      booking_id: b.id,
      report_type: 'checkout',
      condition: 'good',
      notes: 'Handover completed via Lab Head QR verification and receiver scan.',
      evidence_paths: [],
      submitted_by: params.receiverId,
      created_at: nowIso,
    };
    data.condition_reports.push(report);

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: params.receiverId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: 'handover_claimed_qr',
      metadata: {
        deadlineAt: deadlineIso,
        durationDays: days,
        durationHours: hours,
        durationMinutes: minutes,
      },
    });

    // Notify Receiver
    this.addNotification({
      user_id: b.borrower_id,
      event_type: 'item_issued',
      title: 'Equipment Handover Completed — Timer Active!',
      message: `You have successfully received ${resource?.name || 'equipment'}. Your countdown timer is running until ${deadlineDate.toLocaleString()}.`,
      related_booking_id: b.id,
    });

    // Notify Sender / Lab Head
    if (b.approved_by) {
      this.addNotification({
        user_id: b.approved_by,
        event_type: 'item_issued',
        title: 'Handover Completed — Timer Active',
        message: `${resource?.name || 'Equipment'} has been collected by receiver. Return countdown timer active until ${deadlineDate.toLocaleString()}.`,
        related_booking_id: b.id,
      });
    }

    this.persist();
    return { success: true, deadlineAt: deadlineIso };
  }

  approveBooking(bookingId: string, managerId: string): { success: boolean; error?: string } {
    return this.verifyIdAndApproveBooking({ bookingId, managerId });
  }

  rejectBooking(bookingId: string, managerId: string, reason: string): { success: boolean; error?: string } {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.status !== 'pending') return { success: false, error: `Cannot reject booking in status: ${b.status}` };

    b.status = 'rejected';
    b.rejection_reason = reason;
    b.updated_at = new Date().toISOString();

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: managerId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: 'rejected',
      metadata: { reason },
    });

    this.addNotification({
      user_id: b.borrower_id,
      event_type: 'booking_rejected',
      title: 'Booking Request Declined',
      message: `Your booking request for ${resource?.name || 'equipment'} was declined. Reason: ${reason}`,
      related_booking_id: b.id,
    });

    this.persist();
    return { success: true };
  }

  cancelBooking(bookingId: string, borrowerId: string, reason: string): { success: boolean; error?: string } {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.borrower_id !== borrowerId) return { success: false, error: 'Unauthorised: You can only cancel your own bookings' };
    if (!['pending', 'approved'].includes(b.status)) {
      return { success: false, error: `Cannot cancel a booking in status: ${b.status}` };
    }

    b.status = 'cancelled';
    b.cancellation_reason = reason;
    b.updated_at = new Date().toISOString();

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: borrowerId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: 'cancelled',
      metadata: { reason },
    });

    this.persist();
    return { success: true };
  }

  checkoutEquipment(params: {
    bookingId: string;
    managerId: string;
    unitId?: string;
    condition: ConditionReport['condition'];
    notes: string;
    evidencePaths?: string[];
  }): { success: boolean; error?: string } {
    const data = this.load();
    const { bookingId, managerId, unitId, condition, notes, evidencePaths = [] } = params;

    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.status !== 'approved') return { success: false, error: 'Only approved bookings can be checked out' };

    const nowIso = new Date().toISOString();
    b.status = 'checked_out';
    b.unit_id = unitId;
    b.issued_by = managerId;
    b.issued_at = nowIso;
    b.updated_at = nowIso;

    // Update unit status if serialized
    if (unitId) {
      const unit = data.resource_units.find((u) => u.id === unitId);
      if (unit) {
        unit.unit_status = 'checked_out';
        unit.condition = condition;
      }
    }

    // Create condition report
    const report: ConditionReport = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      report_type: 'checkout',
      condition,
      notes,
      evidence_paths: evidencePaths,
      submitted_by: managerId,
      created_at: nowIso,
    };
    data.condition_reports.push(report);

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: managerId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: 'checked_out',
      metadata: { unitId, condition, notes },
    });

    this.addNotification({
      user_id: b.borrower_id,
      event_type: 'item_issued',
      title: 'Equipment Handover Completed',
      message: `${resource?.name || 'Equipment'} has been checked out. Return due date: ${new Date(b.due_at).toLocaleDateString()}.`,
      related_booking_id: b.id,
    });

    this.persist();
    return { success: true };
  }

  returnEquipment(params: {
    bookingId: string;
    managerId: string;
    condition: ConditionReport['condition'];
    notes: string;
    evidencePaths?: string[];
    isIncident?: boolean;
    incidentType?: Incident['incident_type'];
    incidentDescription?: string;
  }): { success: boolean; error?: string } {
    const data = this.load();
    const { bookingId, managerId, condition, notes, evidencePaths = [], isIncident, incidentType, incidentDescription } = params;

    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.status !== 'checked_out') return { success: false, error: 'Only checked-out bookings can be returned' };

    const nowIso = new Date().toISOString();
    b.status = isIncident ? 'incident_review' : 'completed';
    b.returned_by = managerId;
    b.returned_at = nowIso;
    b.updated_at = nowIso;

    // Return unit to available status
    if (b.unit_id) {
      const unit = data.resource_units.find((u) => u.id === b.unit_id);
      if (unit) {
        unit.unit_status = isIncident ? 'maintenance' : 'available';
        unit.condition = condition;
      }
    }

    // Condition report
    const report: ConditionReport = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      report_type: 'return',
      condition,
      notes,
      evidence_paths: evidencePaths,
      submitted_by: managerId,
      created_at: nowIso,
    };
    data.condition_reports.push(report);

    // If incident reported
    if (isIncident && incidentType && incidentDescription) {
      const inc: Incident = {
        id: crypto.randomUUID(),
        booking_id: bookingId,
        reported_by: managerId,
        incident_type: incidentType,
        description: incidentDescription,
        evidence_paths: evidencePaths,
        status: 'open',
        assigned_to: managerId,
        created_at: nowIso,
      };
      data.incidents.push(inc);
    }

    const resource = data.resources.find((r) => r.id === b.resource_id);

    this.addAuditLog({
      actor_id: managerId,
      institution_id: resource?.institution_id,
      entity_type: 'booking',
      entity_id: b.id,
      action: isIncident ? 'return_incident_review' : 'return_completed',
      metadata: { condition, notes, isIncident },
    });

    this.addNotification({
      user_id: b.borrower_id,
      event_type: isIncident ? 'incident_opened' : 'return_confirmed',
      title: isIncident ? 'Incident Review Opened' : 'Return Confirmed',
      message: isIncident
        ? `Equipment returned with condition notes. An incident review has been initiated.`
        : `Your return of ${resource?.name || 'equipment'} has been inspected and confirmed in good order.`,
      related_booking_id: b.id,
    });

    this.persist();
    return { success: true };
  }

  // --- Condition Reports ---
  getConditionReports(bookingId: string): ConditionReport[] {
    const data = this.load();
    return data.condition_reports
      .filter((cr) => cr.booking_id === bookingId)
      .map((cr) => ({
        ...cr,
        submitter: data.profiles.find((p) => p.id === cr.submitted_by),
      }));
  }

  // --- Incidents ---
  getIncidents(institutionId?: string): Incident[] {
    const data = this.load();
    let items = data.incidents;

    if (institutionId) {
      const instResourceIds = new Set(
        data.resources.filter((r) => r.institution_id === institutionId).map((r) => r.id)
      );
      const instBookingIds = new Set(
        data.bookings.filter((b) => instResourceIds.has(b.resource_id)).map((b) => b.id)
      );
      items = items.filter((inc) => instBookingIds.has(inc.booking_id));
    }

    return items.map((inc) => ({
      ...inc,
      reporter: data.profiles.find((p) => p.id === inc.reported_by),
      booking: data.bookings.find((b) => b.id === inc.booking_id),
    }));
  }

  resolveIncident(incidentId: string, managerId: string, notes: string): { success: boolean; error?: string } {
    const data = this.load();
    const inc = data.incidents.find((i) => i.id === incidentId);
    if (!inc) return { success: false, error: 'Incident not found' };

    inc.status = 'resolved';
    inc.resolution_notes = notes;
    inc.resolved_at = new Date().toISOString();

    const booking = data.bookings.find((b) => b.id === inc.booking_id);
    if (booking && booking.status === 'incident_review') {
      booking.status = 'completed';
    }

    this.addAuditLog({
      actor_id: managerId,
      entity_type: 'incident',
      entity_id: inc.id,
      action: 'resolved',
      metadata: { notes },
    });

    this.persist();
    return { success: true };
  }

  // --- Waitlist ---
  getWaitlist(resourceId?: string): WaitlistEntry[] {
    const data = this.load();
    let res = data.waitlist_entries;
    if (resourceId) res = res.filter((w) => w.resource_id === resourceId);
    return res.map((w) => ({
      ...w,
      resource: data.resources.find((r) => r.id === w.resource_id),
      user: data.profiles.find((p) => p.id === w.user_id),
    }));
  }

  addToWaitlist(params: { resourceId: string; userId: string; quantity: number; priorityReason?: string }): {
    success: boolean;
    error?: string;
    entry?: WaitlistEntry;
  } {
    const data = this.load();
    const { resourceId, userId, quantity, priorityReason } = params;

    const existing = data.waitlist_entries.find(
      (w) => w.resource_id === resourceId && w.user_id === userId && w.status === 'active'
    );
    if (existing) {
      return { success: false, error: 'You already have an active waitlist entry for this equipment' };
    }

    const currentActive = data.waitlist_entries.filter((w) => w.resource_id === resourceId && w.status === 'active');
    const queuePosition = currentActive.length + 1;

    const newEntry: WaitlistEntry = {
      id: crypto.randomUUID(),
      resource_id: resourceId,
      user_id: userId,
      quantity,
      status: 'active',
      queue_position: queuePosition,
      priority_reason: priorityReason,
      created_at: new Date().toISOString(),
    };

    data.waitlist_entries.push(newEntry);

    this.addAuditLog({
      actor_id: userId,
      entity_type: 'waitlist',
      entity_id: newEntry.id,
      action: 'joined',
      metadata: { queuePosition, quantity, priorityReason },
    });

    this.persist();
    return { success: true, entry: newEntry };
  }

  // --- Audit Logs ---
  getAuditLogs(institutionId?: string): AuditLog[] {
    const data = this.load();
    let res = data.audit_logs;
    if (institutionId) {
      res = res.filter((a) => a.institution_id === institutionId);
    }
    return res
      .slice()
      .reverse()
      .map((a) => ({
        ...a,
        actor: data.profiles.find((p) => p.id === a.actor_id),
        institution: a.institution_id ? data.institutions.find((i) => i.id === a.institution_id) : undefined,
      }));
  }

  private addAuditLog(entry: Omit<AuditLog, 'id' | 'created_at'>): void {
    const data = this.load();
    data.audit_logs.push({
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
  }

  // --- Return QR Code Generation & Verification ---
  generateReturnQr(bookingId: string, borrowerId?: string): { success: boolean; qrToken?: string; error?: string } {
    const data = this.load();
    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (borrowerId && b.borrower_id !== borrowerId) {
      return { success: false, error: 'Unauthorised' };
    }
    if (b.status !== 'checked_out') {
      return { success: false, error: `Return QR code can only be generated for active checked-out equipment (current status: ${b.status})` };
    }

    if (!b.return_qr_code) {
      b.return_qr_code = `IOT-RETURN:${b.id}:${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      b.updated_at = new Date().toISOString();
      this.persist();
    }

    return { success: true, qrToken: b.return_qr_code };
  }

  completeReturnWithQr(params: {
    bookingId: string;
    managerId: string;
    scannedReturnQr: string;
    condition: ConditionReport['condition'];
    notes: string;
    isIncident?: boolean;
    incidentType?: Incident['incident_type'];
    incidentDescription?: string;
  }): { success: boolean; error?: string } {
    const data = this.load();
    const { bookingId, managerId, scannedReturnQr, condition, notes, isIncident, incidentType, incidentDescription } = params;

    const b = data.bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };
    if (b.status !== 'checked_out') {
      return { success: false, error: `Booking cannot be returned in status: ${b.status}. Only checked-out equipment can be returned.` };
    }

    const scanned = (scannedReturnQr || '').trim();
    const stored = (b.return_qr_code || '').trim();

    // Verify the return QR code matches
    const isTokenMatch =
      (stored.length > 0 && (scanned === stored || scanned.includes(stored))) ||
      (scanned.startsWith('IOT-RETURN:') && scanned.includes(b.id)) ||
      (scanned.includes(b.id));

    if (!isTokenMatch) {
      return {
        success: false,
        error: 'Invalid Return QR Code token. Please scan the Return QR code presented by the borrower.',
      };
    }

    // Record return QR scan timestamp & manual verification
    const nowIso = new Date().toISOString();
    b.return_qr_scanned = true;
    b.return_qr_scanned_at = nowIso;
    b.return_verified_by = managerId;
    b.return_verified_at = nowIso;

    // Execute return and transition to completed
    return this.returnEquipment({
      bookingId,
      managerId,
      condition,
      notes: `[Return QR Scanned & Manually Verified by Lab Head] ${notes || 'Equipment inspected and accepted in good order.'}`,
      isIncident,
      incidentType,
      incidentDescription,
    });
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    const data = this.load();
    if (!data.notifications || data.notifications.length === 0) {
      data.notifications = getDefaultNotifications();
      this.persist();
    }
    const userNotifs = data.notifications.filter((n) => n.user_id === userId || n.user_id === 'all');
    if (userNotifs.length === 0) {
      const defaults = getDefaultNotifications().filter((n) => n.user_id === userId);
      if (defaults.length > 0) {
        data.notifications.push(...defaults);
        this.persist();
        return defaults.slice().reverse();
      }
      return data.notifications.slice(-3).reverse();
    }
    return userNotifs.slice().reverse();
  }

  getAllNotifications(): Notification[] {
    const data = this.load();
    if (!data.notifications || data.notifications.length === 0) {
      data.notifications = getDefaultNotifications();
      this.persist();
    }
    return data.notifications.slice().reverse();
  }

  markNotificationRead(notificationId: string, userId: string): void {
    const data = this.load();
    const notif = data.notifications.find((n) => n.id === notificationId && n.user_id === userId);
    if (notif) {
      notif.read_at = new Date().toISOString();
      this.persist();
    }
  }

  addNotification(entry: Omit<Notification, 'id' | 'created_at'>): void {
    const data = this.load();
    data.notifications.push({
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
    this.persist();
  }
}

// Singleton global instance
export const db = new Store();

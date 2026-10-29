import fs from 'fs';
import path from 'path';
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

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'iotogether.db.json');

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
        id: 'd0000001-0000-0000-0000-000000000001',
        institution_id: '11111111-1111-1111-1111-111111111111',
        name: 'Arduino Uno Rev3 Microcontroller Board',
        slug: 'arduino-uno-rev3',
        category: 'microcontrollers',
        description: 'Standard ATmega328P microcontroller board with 14 digital I/O pins, 6 analog inputs, 16 MHz quartz crystal, and USB connection. Ideal for prototyping sensors and actuators.',
        specifications: {
          microcontroller: 'ATmega328P',
          operating_voltage: '5V',
          clock_speed: '16 MHz',
          digital_io: 14,
          analog_in: 6,
          flash_memory: '32 KB',
        },
        image_url: 'https://images.unsplash.com/photo-1608562098869-2f6437d0c3be?auto=format&fit=crop&w=600&q=80',
        total_quantity: 5,
        daily_rate_paise: 0,
        deposit_paise: 0,
        currency: 'INR',
        condition: 'excellent',
        location_description: 'Cabinet A2, Shelf 1, NIT Electronics Lab',
        min_loan_duration: 1,
        max_loan_duration: 14,
        approval_required: true,
        training_required: false,
        eligibility_policy: 'verified_members_only',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000002',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000002-0000-0000-0000-000000000002',
        institution_id: '22222222-2222-2222-2222-222222222222',
        name: 'ESP-32 NodeMCU Wi-Fi & Dual-Mode Bluetooth Board',
        slug: 'esp32-nodemcu-wifi-ble',
        category: 'microcontrollers',
        description: 'Powerful dual-core 240MHz SoC with integrated 802.11b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR and BLE. Essential for connected IoT sensor nodes and edge computing.',
        specifications: {
          chip: 'ESP-WROOM-32',
          cores: 2,
          frequency: '240 MHz',
          wifi: '802.11 b/g/n',
          bluetooth: 'v4.2 BR/EDR & BLE',
          ram: '520 KB',
        },
        image_url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
        total_quantity: 3,
        daily_rate_paise: 0,
        deposit_paise: 0,
        currency: 'INR',
        condition: 'excellent',
        location_description: 'Drawer 4, Greenfield Makerspace Hub',
        min_loan_duration: 1,
        max_loan_duration: 7,
        approval_required: true,
        training_required: false,
        eligibility_policy: 'verified_members_only',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000003',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000003-0000-0000-0000-000000000003',
        institution_id: '11111111-1111-1111-1111-111111111111',
        name: 'DHT11 Temperature & Humidity Sensor Module',
        slug: 'dht11-temperature-humidity-sensor',
        category: 'sensors',
        description: 'Calibrated digital signal output temperature and humidity composite sensor. Features resistive-type humidity measurement component and NTC temperature measurement component.',
        specifications: {
          temp_range: '0-50 C (+/-2 C)',
          humidity_range: '20-90% RH (+/-5%)',
          sampling_rate: '1 Hz',
          voltage: '3.3V - 5V',
        },
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        total_quantity: 8,
        daily_rate_paise: 0,
        deposit_paise: 0,
        currency: 'INR',
        condition: 'good',
        location_description: 'Component Box S-14, NIT Electronics Lab',
        min_loan_duration: 1,
        max_loan_duration: 14,
        approval_required: false,
        training_required: false,
        eligibility_policy: 'public',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000002',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000004-0000-0000-0000-000000000004',
        institution_id: '11111111-1111-1111-1111-111111111111',
        name: 'Raspberry Pi 4 Model B (4GB RAM) Starter Kit',
        slug: 'raspberry-pi-4-model-b-4gb',
        category: 'single_board_computers',
        description: 'Quad-core 64-bit ARM Cortex-A72 at 1.5GHz, dual 4K micro-HDMI, Gigabit Ethernet, 2x USB 3.0, 2x USB 2.0. Supplied with 32GB microSD and official power supply.',
        specifications: {
          processor: 'Broadcom BCM2711 1.5GHz',
          ram: '4GB LPDDR4',
          connectivity: 'Dual-band Wi-Fi, BT 5.0, Gigabit Eth',
          display: '2x micro-HDMI 4K',
        },
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
        total_quantity: 2,
        daily_rate_paise: 5000, // INR 50.00/day
        deposit_paise: 200000, // INR 2,000.00 refundable deposit
        currency: 'INR',
        condition: 'excellent',
        location_description: 'Locker B-3, Embedded Systems Lab, NIT',
        min_loan_duration: 2,
        max_loan_duration: 10,
        approval_required: true,
        training_required: false,
        eligibility_policy: 'verified_members_only',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000002',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000005-0000-0000-0000-000000000005',
        institution_id: '11111111-1111-1111-1111-111111111111',
        name: 'Rigol DS1054Z 50MHz 4-Channel Digital Oscilloscope',
        slug: 'rigol-ds1054z-oscilloscope',
        category: 'test_equipment',
        description: 'Four-channel 50MHz digital storage oscilloscope with 1GSa/s real-time sampling rate, 24Mpts deep memory, and 30,000 wfms/s capture rate. Requires verified Oscilloscope training.',
        specifications: {
          channels: 4,
          bandwidth: '50 MHz',
          sampling_rate: '1 GSa/s',
          memory_depth: '24 Mpts',
          screen: '7-inch WVGA',
        },
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        total_quantity: 1,
        daily_rate_paise: 10000, // INR 100.00/day
        deposit_paise: 500000, // INR 5,000.00 refundable deposit
        currency: 'INR',
        condition: 'brand_new',
        location_description: 'Precision Bench 1, Test & Measurement Lab, NIT',
        min_loan_duration: 1,
        max_loan_duration: 3,
        approval_required: true,
        training_required: true,
        eligibility_policy: 'training_certified',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000002',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000006-0000-0000-0000-000000000006',
        institution_id: '33333333-3333-3333-3333-333333333333',
        name: '4WD Smart Robot Car Chassis Kit with L298N Driver',
        slug: '4wd-robotics-chassis-kit',
        category: 'robotics',
        description: 'Complete 4-wheel drive acrylic chassis kit with 4 DC gear motors, encoder wheels, battery holder, ultrasonic sensor mount, and L298N dual H-bridge motor driver module.',
        specifications: {
          motors: '4x DC TT gear motors 1:48',
          driver: 'L298N Dual H-Bridge',
          wheels: '65mm rubber grip tires',
          chassis: 'Double deck laser-cut acrylic',
        },
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
        total_quantity: 2,
        daily_rate_paise: 0,
        deposit_paise: 150000, // INR 1,500.00 refundable deposit
        currency: 'INR',
        condition: 'good',
        location_description: 'Robotics Shelf R3, Metro Makerspace',
        min_loan_duration: 2,
        max_loan_duration: 14,
        approval_required: true,
        training_required: false,
        eligibility_policy: 'public',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000002',
        created_at: isoNow,
        updated_at: isoNow,
      },
      {
        id: 'd0000007-0000-0000-0000-000000000007',
        institution_id: '22222222-2222-2222-2222-222222222222',
        name: 'Fluke 101 Pocket Digital Multimeter with Probes',
        slug: 'fluke-101-digital-multimeter',
        category: 'test_equipment',
        description: 'Compact basic true-RMS accurate digital multimeter measuring AC/DC voltage, resistance, capacitance, frequency, and continuity. CAT III 600V safety rated.',
        specifications: {
          ac_voltage: '600V',
          dc_voltage: '600V',
          resistance: '40 M-ohm',
          capacitance: '100 uF',
          safety_rating: 'CAT III 600V',
        },
        image_url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
        total_quantity: 2,
        daily_rate_paise: 0,
        deposit_paise: 50000, // INR 500.00 deposit
        currency: 'INR',
        condition: 'excellent',
        location_description: 'Cabinet M, Tool Station 3, Greenfield GEC',
        min_loan_duration: 1,
        max_loan_duration: 7,
        approval_required: true,
        training_required: false,
        eligibility_policy: 'verified_members_only',
        status: 'active',
        created_by: 'b0000000-0000-0000-0000-000000000003',
        created_at: isoNow,
        updated_at: isoNow,
      },
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
    notifications: [],
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
      console.error('Error persisting DB file:', err);
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

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    const data = this.load();
    return data.notifications.filter((n) => n.user_id === userId).slice().reverse();
  }

  markNotificationRead(notificationId: string, userId: string): void {
    const data = this.load();
    const notif = data.notifications.find((n) => n.id === notificationId && n.user_id === userId);
    if (notif) {
      notif.read_at = new Date().toISOString();
      this.persist();
    }
  }

  private addNotification(entry: Omit<Notification, 'id' | 'created_at'>): void {
    const data = this.load();
    data.notifications.push({
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
  }
}

// Singleton global instance
export const db = new Store();

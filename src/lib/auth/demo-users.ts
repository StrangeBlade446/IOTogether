export interface DemoUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  category: 'student' | 'manager' | 'admin';
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Aarav Sharma',
    email: 'student@iotogether.edu',
    roleLabel: 'Verified Student (NIT & GEC)',
    category: 'student',
    description: 'Enrolled student borrower with verified memberships at NIT and GEC. Has lab safety & oscilloscope certifications.',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Priya Patel',
    email: 'priya.student@iotogether.edu',
    roleLabel: 'Student (Metro Makerspace)',
    category: 'student',
    description: 'Student borrower at Metro Makerspace on waitlist for high-demand test equipment.',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Prof. Ananya Roy',
    email: 'manager.nit@iotogether.edu',
    roleLabel: 'Inventory Manager (Northstar NIT)',
    category: 'manager',
    description: 'Electronics Lab in-charge at NIT. Manages Arduino, RPi, DHT11, and Oscilloscope inventory.',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    name: 'Marcus Chen',
    email: 'manager.gec@iotogether.edu',
    roleLabel: 'Inventory Manager (Greenfield GEC)',
    category: 'manager',
    description: 'ECE Makerspace Lead at Greenfield. Manages ESP-32 and Fluke Multimeter inventory.',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Dr. Vikram Seth',
    email: 'admin@iotogether.edu',
    roleLabel: 'Platform Administrator',
    category: 'admin',
    description: 'Network-level administrator verifying institutional credentials and audit records.',
  },
];

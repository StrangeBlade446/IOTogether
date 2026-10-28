export interface DemoUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  category: 'student' | 'manager' | 'admin';
  platformType: 'sender' | 'receiver' | 'admin';
  post: string;
  idNumber: string;
  instituteName: string;
  description: string;
}

export const DEMO_USERS: DemoUser[] = [
  // --- RECEIVERS (Students & Teachers) ---
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Aarav Sharma',
    email: 'student@iotogether.edu',
    roleLabel: 'Receiver: Student (NIT)',
    category: 'student',
    platformType: 'receiver',
    post: 'B.Tech Electronics Student (Final Year)',
    idNumber: 'STU-NIT-2024-819',
    instituteName: 'Northstar Institute of Technology',
    description: 'Student borrower with verified Student ID and Lab Safety certification.',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Dr. Rajesh Kulkarni',
    email: 'rajesh.teacher@iotogether.edu',
    roleLabel: 'Receiver: Teacher / Project Guide',
    category: 'student',
    platformType: 'receiver',
    post: 'Assistant Professor & Robotics Mentor',
    idNumber: 'FAC-GEC-219',
    instituteName: 'Greenfield Engineering College',
    description: 'Faculty mentor borrowing advanced sensors and robotics chassis for capstone guidance.',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Priya Patel',
    email: 'priya.student@iotogether.edu',
    roleLabel: 'Receiver: Student (Metro Makerspace)',
    category: 'student',
    platformType: 'receiver',
    post: 'Embedded Systems Student',
    idNumber: 'STU-MMS-2024-402',
    instituteName: 'Metro Makerspace',
    description: 'Student borrower requesting IoT telemetry development boards.',
  },

  // --- SENDERS (Lab Heads / Resource Assigners) ---
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Prof. Ananya Roy',
    email: 'manager.nit@iotogether.edu',
    roleLabel: 'Sender: Lab Head (Northstar NIT)',
    category: 'manager',
    platformType: 'sender',
    post: 'Head of Electronics & Embedded Systems Lab',
    idNumber: 'FAC-NIT-104',
    instituteName: 'Northstar Institute of Technology',
    description: 'Lab Head at Northstar NIT. Reviews student/teacher ID cards, approves durations, and confirms handovers with QR.',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    name: 'Marcus Chen',
    email: 'manager.gec@iotogether.edu',
    roleLabel: 'Sender: Resource Assigner (Greenfield GEC)',
    category: 'manager',
    platformType: 'sender',
    post: 'Makerspace Lead & Equipment Assigner',
    idNumber: 'STAFF-GEC-082',
    instituteName: 'Greenfield Engineering College',
    description: 'Equipment assigner managing ESP32, Fluke Multimeters, and robotics inventory.',
  },

  // --- ADMIN ---
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Dr. Vikram Seth',
    email: 'admin@iotogether.edu',
    roleLabel: 'Platform Administrator',
    category: 'admin',
    platformType: 'admin',
    post: 'Network Platform Auditor',
    idNumber: 'ADMIN-IOT-001',
    instituteName: 'National Electronics Academic Consortium',
    description: 'Platform auditor verifying institutional credentials and audit records.',
  },
];

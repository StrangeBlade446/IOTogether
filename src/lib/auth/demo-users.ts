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
  // --- KEEPERS (One per institution: 2 Colleges, 1 School) ---
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Prof. Alistair Vance',
    email: 'keeper.apex@iotogether.edu',
    roleLabel: 'Keeper: Lab Head (Apex Institute of Technology)',
    category: 'manager',
    platformType: 'sender',
    post: 'Head of Embedded Systems & Robotics Lab',
    idNumber: 'FAC-APEX-101',
    instituteName: 'Apex Institute of Technology',
    description: 'Keeper at Apex Institute of Technology (College 1). Manages Arduino, RPi, and sensor test benches.',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    name: 'Dr. Elena Rostova',
    email: 'keeper.vanguard@iotogether.edu',
    roleLabel: 'Keeper: Makerspace Director (Vanguard Engineering College)',
    category: 'manager',
    platformType: 'sender',
    post: 'Makerspace Director & Equipment Custodian',
    idNumber: 'FAC-VEC-204',
    instituteName: 'Vanguard Engineering College',
    description: 'Keeper at Vanguard Engineering College (College 2). Manages ESP32, multimeters, and robotics kits.',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    name: 'Nathaniel Drake',
    email: 'keeper.horizon@iotogether.edu',
    roleLabel: 'Keeper: STEM Lab Head (Horizon STEM Academy)',
    category: 'manager',
    platformType: 'sender',
    post: 'Lead STEM Lab Instructor & Kit Custodian',
    idNumber: 'STAFF-HSA-042',
    instituteName: 'Horizon STEM Academy',
    description: 'Keeper at Horizon STEM Academy (School 1). Manages classroom robotics, breadboards, and beginner sensor modules.',
  },

  // --- SEEKERS (One per institution: 2 Colleges, 1 School) ---
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Rohan Verma',
    email: 'seeker.apex@iotogether.edu',
    roleLabel: 'Seeker: Student (Apex Institute of Technology)',
    category: 'student',
    platformType: 'receiver',
    post: 'B.Tech Electronics Student (Final Year)',
    idNumber: 'STU-APEX-2024-512',
    instituteName: 'Apex Institute of Technology',
    description: 'Seeker at Apex Institute of Technology (College 1). Borrowing microcontroller development kits for capstone prototype.',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    name: 'Meera Krishnan',
    email: 'seeker.vanguard@iotogether.edu',
    roleLabel: 'Seeker: Teacher / Project Guide (Vanguard Engineering College)',
    category: 'student',
    platformType: 'receiver',
    post: 'Assistant Professor & Research Mentor',
    idNumber: 'FAC-VEC-789',
    instituteName: 'Vanguard Engineering College',
    description: 'Seeker at Vanguard Engineering College (College 2). Borrowing advanced sensors and test benches for student research mentorship.',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Ananya Gupta',
    email: 'seeker.horizon@iotogether.edu',
    roleLabel: 'Seeker: High School Student (Horizon STEM Academy)',
    category: 'student',
    platformType: 'receiver',
    post: 'Senior STEM Student & Robotics Club Lead',
    idNumber: 'STU-HSA-2024-088',
    instituteName: 'Horizon STEM Academy',
    description: 'Seeker at Horizon STEM Academy (School 1). Borrowing sensor modules and breadboards for inter-school science fair project.',
  },

  // --- ADMIN ---
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Dr. Vikram Seth',
    email: 'admin@iotogether.edu',
    roleLabel: 'Consortium Platform Administrator',
    category: 'admin',
    platformType: 'admin',
    post: 'Consortium Network Auditor',
    idNumber: 'ADMIN-CONSORTIUM-001',
    instituteName: 'National Electronics Academic Consortium',
    description: 'Consortium network auditor verifying institutional credentials and audit records.',
  },
];

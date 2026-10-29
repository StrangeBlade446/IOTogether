# IOTogether — Multi-Institution Electronics Resource-Sharing Platform
**Tagline:** *Make a physical connection. Share Resources. Build Possibilities.*  
**Live Production Deployment:** [https://iotogether.vercel.app](https://iotogether.vercel.app)  
**GitHub Repository:** [https://github.com/StrangeBlade446/IOTogether](https://github.com/StrangeBlade446/IOTogether)  
**Master Implementation Plan:** [`MASTER_PLAN.md`](MASTER_PLAN.md)

---

## 👥 Team "The Omniscient"

| Member | Project Roles & Engineering Attribution |
| :--- | :--- |
| **Rudra Veer Singh** | **Concept & Ideation, Backend & Database Architecture** |
| **Daksh Pratap Singh** | **Concept & Ideation, Frontend Architecture & UX Engineering** |
| **Shivaksh Arya** | **3D WebGL Simulation, Verlet Physics Engine & Audio Synthesis** |
| **Suhel Khan** | **Security Protocols, QR Verification Engine & Cloud Deployment** |

---

## 1. Executive Summary & Problem Statement

Educational laboratories, engineering colleges, and makerspaces frequently invest in high-tier electronics development boards, sensors, and test equipment that sit underused in locked cabinets for months. Concurrently, student innovators and project teams face steep monetary barriers when purchasing single-use microcontrollers or lab-grade test equipment for semester projects.

**IOTogether** solves this imbalance by providing a secure, accountable, cross-institutional resource-sharing network. Institutions retain full ownership and approval authority over their inventory, while verified students gain fair, transparent, and affordable access.

---

## 2. Key Platform Features

- **Interactive 3D Single-Sided Cable Landing Page (`/`):**
  Physics-simulated 3D cable using Three.js with a 61-node PBD Verlet rope solver (120 Hz substeps), floor friction, dynamic tubular mesh, and procedural audio synthesis via the Web Audio API. Users physically drag and plug the cable into the **Keeper (01)** or **Seeker (02)** wall sockets with proximity snapping to enter the respective portals.
- **Role-Guarded Dual Portals:**
  - **Keeper Portal (`/sender`):** 3D FPP Desk with hovering holographic tiles, equipment cataloging, student/faculty ID photo inspection, Handover QR dispatch, and return condition grading.
  - **Seeker Portal (`/receiver`):** 3D Walkable Lab with the Scientific Chef droid, multi-campus catalog exploration, booking submissions with custom durations, and live return deadline countdown timers.
- **Manual Student & Staff Photo ID Review:**
  Lab Heads visually inspect uploaded institutional ID cards before accepting any booking, ensuring equipment is only issued to verified members.
- **Dynamic Handover QR Code with Auto-Redirect:**
  Approved bookings generate a time-limited Handover QR code encoding a direct checkout URL (`/receiver/bookings?claim=...&token=...`). Scanning with any camera or clicking the link automatically claims the equipment and activates the live countdown timer.
- **Synchronized Real-Time Countdown Timers:**
  Second-by-second countdown clock active on both the Seeker's dashboard and Keeper's active loan view, enforcing strict return discipline.
- **Double-Scan Return Verification with Keeper Bench Inspection:**
  Returning equipment requires dual verification: the borrower displays their unique **Return QR Code** (`IOT-RETURN:...`), which the Keeper scans at the bench. After completing a physical inspection checklist (power test, intact pins, undamaged parts), the Keeper submits **"Manual Verified"** to finalize the return and restock inventory.
- **Scientific Chef AI Project Recipe Engine (`/receiver/project-recipe`):**
  Integrated with Google Gemini API (`gemini-1.5-flash`) for dynamic hardware bills-of-materials generation, paired with a curated offline catalog of 25 verified electronics projects (Smart Agriculture, ESP32 Weather Station, LoRa Node, Obstacle Avoidance Rover, etc.).
- **Cross-Institutional Inventory Catalog (`/receiver/explore`):**
  36 Amazon-standard microcontrollers and common sensors distributed across 3 consortium institutions (Apex Institute of Technology, Quantum Polytechnic, and Horizon STEM Academy) with live stock counters.
- **Integer Paise Financial Security:**
  Zero floating-point arithmetic errors: all deposits and rental rates are computed in integer paise.
- **Append-Only Platform Audit Ledger (`/admin/audit`):**
  Immutable transaction timeline recording every reservation, manager approval, checkout handover, return, and incident resolution.

---

## 3. Technology Stack

- **Frontend:** Next.js 14.2.15 (App Router), React 18, TypeScript 5.6 (Strict Mode), Tailwind CSS, Lucide React
- **3D & Physics Engine:** Three.js 0.170.0, WebGL, custom PBD Verlet rope physics solver (61 nodes, 120 Hz substeps), Web Audio API synthesizer
- **Backend & Serverless Persistence:** Next.js Server Actions, atomic JSON store with transaction locks, Vercel Lambda `/tmp` compatibility with in-memory caching and bundled seed recovery
- **AI Integration:** Google Gemini API (`@google/genai` / `gemini-1.5-flash`) with 25 curated project recipes
- **Security & Authorization:** HMAC-signed session cookies, strict portal separation middleware, self-approval prevention
- **SEO & Production Delivery:** Server-side rendering (SSR), dynamic OpenGraph images, robots.txt, sitemap.xml, Schema.org microdata

---

## 4. Quickstart & Installation

### Prerequisites
- Node.js v18.17+ or v20+ or v22+
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/StrangeBlade446/IOTogether.git
cd IOTogether
npm install
```

### 2. Run Automated Test Suite
```bash
npm run test
```
*Executes all 15 automated unit and integration tests verifying seed data, paise pricing, atomic overlap blocking, lifecycle transitions, waitlist queuing, ID photo submission, and QR-confirmed checkout.*

### 3. Run End-to-End QR & Return Lifecycle Test
```bash
npx tsx scripts/test-handover-qr-flow.js
```
*Validates the complete 6-stage lifecycle: Photo ID approval &rarr; Handover QR generation &rarr; Auto-redirect claim &rarr; Live timer activation &rarr; Return QR double-scan verification &rarr; Keeper bench sign-off.*

### 4. Build for Production
```bash
npm run build
```
*Compiles all 42 static and dynamic routes cleanly with zero TypeScript errors.*

### 5. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Demonstration Accounts for Judges

Use the **Profile Switcher** in the navigation header or inside each portal to switch between personas instantly:

| Persona | Name | Role Context | Institution |
| :--- | :--- | :--- | :--- |
| **Seeker (Student - Primary)** | Rohan Verma | B.Tech Embedded Systems student with verified ID | Apex Institute of Technology |
| **Seeker (Student - Waitlist)** | Priya Patel | Student borrower on queue for high-demand hardware | Quantum Polytechnic |
| **Keeper (Lab Head - Apex)** | Prof. Alistair Vance | Head of Embedded Systems &amp; Robotics Laboratory | Apex Institute of Technology |
| **Keeper (Lab Head - Quantum)** | Dr. Elena Rostova | Makerspace Director &amp; Equipment Custodian | Quantum Polytechnic |
| **Platform Auditor** | Dr. Vikram Seth | Full oversight of consortium verifications &amp; audit trail | Consortium Network |

---

## 6. Implementation Architecture

For detailed architecture diagrams, mathematical physics specifications, and color systems, refer to:
👉 **[`MASTER_PLAN.md`](MASTER_PLAN.md)**

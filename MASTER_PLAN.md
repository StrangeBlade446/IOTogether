# IOTogether — Master Implementation Plan
**Tagline:** Share Resources. Build Possibilities.  
**Category:** Multi-Institution Electronics Inventory, Borrowing, and Resource-Sharing Network.

---

## 1. Design System & Guild Palette (5 Core Colors)
- **Background (`#141821` — 55%):** Deep nocturnal blueprint canvas + rotated 16:9 landscape artwork background (`/background.jpg`).
- **Secondary (`#263447` — 25%):** Cards, surfaces, navigation, side dock, and engraved borders.
- **Text (`#F1E7D0` — 15%):** High-contrast parchment text.
- **Primary (`#C49A55` — 4%):** Warm brass/forge gold for high-value actions, Keeper branding, and active states.
- **Accent (`#67C7D4` — 1%):** Cyan glow for Seeker actions, selective highlights, and interactive details.
- **Motion, 3D & Physics:** Three.js and React Three Fiber (`@react-three/fiber`), Cannon.js real-time physics engine (`@react-three/cannon`) for interactive colliding baubles, Framer Motion text effects (`TextMorph`, `TextRoll`, `AnimatedNumber`, `Dock`), paired with elegant serif headings and clean sans-serif controls.

---

## 2. Institutional Architecture: 2 Colleges & 1 School
All accounts and institutions are seeded, deterministic, and fictional:

### College 1: Apex Institute of Technology
- **Keeper (Hardware Custodian):** Prof. Alistair Vance (`keeper.apex@iotogether.edu`) — Head of Embedded Systems & Robotics Lab
- **Seeker (Student Borrower):** Rohan Verma (`seeker.apex@iotogether.edu`) — B.Tech Electronics Student (Final Year)

### College 2: Vanguard Engineering College
- **Keeper (Hardware Custodian):** Dr. Elena Rostova (`keeper.vanguard@iotogether.edu`) — Makerspace Director & Equipment Custodian
- **Seeker (Faculty/Mentor Borrower):** Meera Krishnan (`seeker.vanguard@iotogether.edu`) — Assistant Professor & Research Mentor

### School 1: Horizon STEM Academy
- **Keeper (Hardware Custodian):** Nathaniel Drake (`keeper.horizon@iotogether.edu`) — Lead STEM Lab Instructor & Kit Custodian
- **Seeker (Student Borrower):** Ananya Gupta (`seeker.horizon@iotogether.edu`) — Senior STEM Student & Robotics Club Lead

### Consortium Network Auditor
- **Platform Auditor:** Dr. Vikram Seth (`admin@iotogether.edu`) — Platform & Security Auditor

---

## 3. Core Functional Capabilities

### A. Three.js 3D Interactive Laboratory Landing Page (`/`)
- Built entirely in **Three.js (`@react-three/fiber`)** with 3D physical interactions:
  - **3D Room Environment:** 3D laboratory wall with metallic paneling, floor ground plane, and real dynamic shadows.
  - **Two 3D Bulbs on the Wall:**
    - **Keeper Bulb (Left):** 3D glass envelope with internal filament and brass fitting. When connected, activates real 3D point lights in gold (`#C49A55`) casting real dynamic shadows across the 3D room.
    - **Seeker Bulb (Right):** 3D plasma arc halogen bulb. When connected, illuminates with high-intensity cyan point lighting (`#67C7D4`).
  - **Two 3D Wall Sockets:**
    - **Keeper Socket (Left):** Metallic faceplate with beveled gold bezel and receptacle cavity.
    - **Seeker Socket (Right):** Cybernetic faceplate with cyan bezel and receptacle cavity.
  - **3D Movable Cable & Jack Plug:**
    - A physical 3D tubular cable (`CatmullRomCurve3` / `TubeGeometry`) lying on the 3D floor.
    - 3D metal jack plug with brass contact tip, rubber ribbed grip, and strain relief boot.
    - Real-time 3D raycast dragging: user picks up the plug from the floor and drags it freely in 3D space.
    - **3D Magnetic Snapping:** Approaching either wall socket snaps the plug into the 3D socket (`Math.PI / 2` rotation into the wall), completes the electrical circuit, triggers audio relay clicks, and smoothly navigates into `/sender` or `/receiver`.
  - **Direct 3D Click & Demo Tray:** Direct clicking on 3D sockets/bulbs automatically connects the plug, and a collapsible demo tray provides 1-click access to the 3 institutions (Apex, Vanguard, Horizon).

### B. Apple-Style Side Dock Navigation (`SideDock.tsx`)
- Displayed after login across all platform pages (`/receiver`, `/sender`, `/receiver/explore`, `/receiver/bookings`, `/sender/requests`, `/admin`, etc.).
- Features **cursor proximity magnification** and **interactive spring/glow enlargement**:
  - Scales up to **1.3×** with an outward glide (`x: 10px`).
  - Radial gold/cyan aura halo emerges behind the icon.
  - Floating metallic border tooltip labels (`DockLabel`).
  - Tactile spring press feedback (`scale: 0.9`).

### C. Keeper Portal (`/sender`)
- Registration & sign-in requiring Name, Designation/Post, ID Number, Institution Name, and Email.
- Equipment inventory listing with image upload/URL, specifications, category, quantities, and pricing.
- Request inspection view:
  - Displays submitted Student / Teacher Photo ID card.
  - Borrower loan duration approval in Days, Hours, and Minutes.
  - **"Manual Verified"** confirmation button for the Lab Head.
  - Generates a unique **Handover QR Code** on the Lab Head's screen.
  - Live synchronized return countdown timer.

### D. Seeker Portal (`/receiver`)
- Registration & sign-in for students and faculty.
- Multi-institutional hardware search & filtering.
- **AI-Powered Project Recipe Engine**: automatically builds bills of materials and validates live inventory across institutions.
- Booking submission requiring Student/Teacher Photo ID card and custom duration (Days, Hours, Minutes).
- Physical pickup handover: borrower scans the Lab Head's screen QR code to confirm release.
- Live active return deadline countdown timer.

---

## 4. Verification & Testing Status

- [x] **Test Suite (`npm run test`):** 15/15 passing tests across schema integrity, atomic concurrency, paise arithmetic, lifecycle states, photo ID verification, manual verified QR handover, and countdown timer synchronization.
- [x] **Production Build (`npm run build`):** Clean Next.js 14 App Router production build across all 37 routes with zero TypeScript errors.
- [x] **Git Repository:** Version-controlled with descriptive atomic commits (`d39a7fe`).

# 🐄 Pashu Care (Safe Cow) - Native Mobile Application

**Pashu Care** is a comprehensive Native Mobile Application designed specifically for smartphone devices (Android & iOS via Expo Go) with a dedicated Node.js Express Backend API. Built for citizen animal welfare, emergency SOS response, on-field RFID/QR cattle tagging, patrol enforcement, and municipal shelter coordination.

---

## 📱 Mobile-First Architecture

### 1. Frontend: React Native & Expo (JavaScript / JSX)
- **Framework:** Expo 57 with React Native & Expo Router
- **Language:** 100% Pure JavaScript (`.js` and `.jsx`)
- **Design:** Modern Mobile Native UI/UX with Emerald Green branding (`#10B981`), iOS/Android SafeArea, bottom tab navigation bar, card shadows, touch gestures, and bilingual support (हिंदी & English).
- **Core Mobile Tabs:**
  1. 🏠 **Home (`index.jsx`):** 24x7 Emergency Cattle SOS trigger, live statistics (registered cattle, seized livestock, municipal fund, missing notices), quick actions matrix, and disease outbreak warnings (LSD/FMD).
  2. 📷 **Scanner & Tag (`scanner.jsx`):** Real-time RFID/QR ear tag viewfinder simulator, instant tag lookup (#00, #TAG-101, #TAG-205), and new cattle registration form.
  3. 🚨 **Patrol & Violations (`patrol.jsx`):** On-field municipal squad enforcement, violation strike counter (Strike 1: ₹1,000, Strike 2: ₹3,000, Strike 3: Animal Seizure), SMS dispatch preview to owner, and fine resolution.
  4. 🏥 **Shelters & Care (`care.jsx`):** Directory of verified Gaushalas with live capacity bars, on-call veterinary doctors with specialization, and emergency animal ambulances with 1-tap direct calling (`tel:`).
  5. 👤 **Services & Admin (`more.jsx`):** Community Missing Cattle Noticeboard (with rewards), Cattle Adoption Portal, Stakeholder Role Switcher (Admin, Patrol, Tagging Agent, Gaushala Manager, Citizen), Warehouse Tag Stock Allocator, and Backend API Diagnostics.

### 2. Backend: Node.js & Express API (JavaScript)
- **Server:** Node.js Express Server (`backend/server.js`) listening on `http://0.0.0.0:3001`
- **Endpoints:**
  - `GET /api/health` - Live health check & diagnostics
  - `GET /api/state` - Comprehensive system data (cows, complaints, shelters, vets, alerts)
  - `POST /api/auth/login` & `/api/auth/register` - Phone + OTP authentication
  - `POST /api/cows` - Register new cattle & assign ear tag
  - `POST /api/complaints` - Issue violation ticket, strikes & fines with SMS dispatch
  - `PUT /api/complaints/:id/pay` - Record fine payment (60% Municipality, 40% PPP partner)
  - `POST /api/missing` - Report lost cattle with photo and reward
  - `POST /api/alerts` - Broadcast epidemic/disease outbreak notices
  - `POST /api/injured` - Emergency 1-tap SOS rescue dispatch
  - `POST /api/inventory/transfer` - Central warehouse RFID tag dispatch

---

## 🚀 Quick Start Guide

### 1. Run the Backend Server
In the root directory or inside `backend/`:
```bash
npm run backend
# OR for hot-reload dev mode:
npm run backend:dev
```
- **Backend URL:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/api/health`

### 2. Run the Mobile Application (Expo)
In the root directory:
```bash
npm run mobile
```
This starts the Expo development server:
- Press `a` to open in **Android Emulator / Device**
- Press `w` to open in **Web Preview**
- Scan the displayed QR Code with the **Expo Go** app on your physical Android or iPhone to run it natively on your phone!

---

## 📂 Project Directory Structure

```
Pashu Care/
├── backend/
│   ├── server.js               # Node.js Express Backend API
│   └── package.json            # Backend dependencies & scripts
│
├── temp-expo-app/              # Native Mobile App (Expo & React Native)
│   ├── app.json                # Expo mobile configuration & branding
│   ├── package.json            # Mobile dependencies (React Native, Expo, Icons)
│   └── src/
│       ├── app/
│       │   ├── _layout.jsx     # Root Stack & Context Provider
│       │   └── (tabs)/
│       │       ├── _layout.jsx # 5-Tab Bottom Mobile Navigation
│       │       ├── index.jsx   # Home / Dashboard & Emergency SOS
│       │       ├── scanner.jsx # Ear Tag Scanner & Cattle Lookup
│       │       ├── patrol.jsx  # Patrol Squad Violations & Fines
│       │       ├── care.jsx    # Gaushalas, Vets & Ambulances
│       │       └── more.jsx    # Missing Cattle, Adoption, Admin Hub
│       │
│       ├── components/
│       │   ├── Header.jsx              # Native Mobile Header with status & lang
│       │   ├── EmergencySOSModal.jsx   # 1-Tap SOS Dispatch modal
│       │   ├── CattleDetailModal.jsx   # Cattle Profile & Strike Gauge
│       │   ├── RegisterCowModal.jsx    # Tag New Cattle Form
│       │   ├── ReportStrayModal.jsx    # Stray Violation & Fine Generator
│       │   ├── ReportMissingModal.jsx  # Community Missing Notice Modal
│       │   └── AdoptionModal.jsx       # Cattle Adoption Application
│       │
│       ├── context/
│       │   └── AppContext.jsx          # Live State Provider & Backend Sync
│       │
│       ├── services/
│       │   └── api.js                  # Mobile API Client
│       │
│       └── constants/
│           ├── theme.js                # Mobile Design Tokens & Emerald Colors
│           └── translations.js         # Bilingual Dictionary (Hindi & English)
│
├── package.json                # Root shortcuts (npm run mobile, npm run backend)
└── README.md                   # Project documentation
```

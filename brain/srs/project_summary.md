# Product Requirement Specifications (SRS)

## System Overview
**"Safe Cow"** is a full-stack digital patrol & registration system focused on managing cattle resources, maintaining a ledger of municipal fines/seizures, and mobilizing patrol units across defined districts.

## Core Modules & Panels

### 1. Admin Dashboard
- Receives unparalleled access to system variables.
- Direct management over roles and task assignment.
- Can view overall macro revenue trends across Gaushalas and PPP (Public Private Partnerships) fines. 

### 2. Gaushala Manager Portal (गौशाला प्रबंधक)
- Responsible for space inventory and accepting tagged cattle into standard shelters.

### 3. Patrol Squad Unit (गश्ती दस्ता)
- Focuses on generating patrol violation records. Can issue strikes, leading to monetary fines or mandatory seizure orders against cattle owners with repeating offenses.

### 4. Tagging Agent (QR टैग)
- Issues primary ID generation for unaccounted livestock found wandering.

## Technological Architecture
- **Frontend Stack**: React, Vite, Zustand
- **Backend Stack**: Node.js, Express
- **Routing**: `react-router-dom`
- **Global Context Management**: Optmistic UI pattern using `Zustand` with async syncing to standard REST API targets.

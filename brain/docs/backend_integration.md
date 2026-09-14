# Backend Integration Guide

## Overview
This document serves as the historical record of the backend integration implemented to convert the generic static local state into a robust client-server architecture.

## Implementation Details

### 1. Backend API (`/backend/server.js`)
We established an independent Node.js + Express backend that provides CRUD operations replacing the Zustand mock arrays.
- **Port**: `3001`
- **Database**: Currently utilizing server local memory for rapid deployment.
- **Key Endpoints**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/users/assign-role`
  - `PUT /api/users/inventory`
  - `POST /api/cows`
  - `POST /api/complaints` (Also generates fine amounts logic)
  - `PUT /api/complaints/:id/pay`
  - `PUT /api/complaints/:id/dispute`

### 2. Frontend Connection (`/vite.config.js`)
A Vite proxy maps all HTTP requests starting with `/api` from port `5173` to port `3001`. This allows the React web app to fetch directly using paths like `fetch('/api/state')` without CORS exceptions.

### 3. State Management (`/src/store/appStore.js`)
The `Zustand` store was upgraded to an **Optimistic UI Pattern**.
- A custom `init()` asynchronous function fetches the full initial state from `/api/state` immediately upon Page Load.
- Actions (e.g., `assignRole`, `reportComplaint`) update the Javascript memory instantaneously while silently issuing `HTTP POST/PUT` fetch requests in the background. This ensures ZERO lag for users and guarantees full compatibility with existing un-modified `.jsx` components.

## Running the Application
To run both simultaneously as a developer:
1. **Terminal 1**: `npm run dev` (Root directory, loads the React web portal).
2. **Terminal 2**: `node server.js` (Within the `/backend` directory).

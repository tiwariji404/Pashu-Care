import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import {
  saveCowToFirebase,
  saveComplaintToFirebase,
  saveMissingReportToFirebase,
  saveDiseaseAlertToFirebase,
  saveAdoptionToFirebase,
  saveInjuredReportToFirebase,
  saveUserToFirebase,
  fetchStateFromFirebase,
  subscribeToFirebase
} from '../services/firebaseService';

// Default initial state fallback (ensures immediate UI responsiveness)
const initialSeeds = {
  users: [
    { phone: '1111111111', role: 'gaushala_manager', name: 'Raj Tiwari', location: 'Garhwa', activeHours: 8, inventory: { total: 100, remaining: 50, label: 'गौशाला क्षमता' } },
    { phone: '2222222222', role: 'patrol_squad', name: 'Bishal', location: 'HQ', activeHours: 12, inventory: { total: 50, remaining: 20, label: 'गश्ती कार्य' } },
    { phone: '3333333333', role: 'tagging_agent', name: 'XYZ', location: 'Field', activeHours: 6, inventory: { total: 200, remaining: 85, label: 'QR टैग' } }
  ],
  cows: [
    {
      qrId: "00",
      species: "Cow",
      breed: "Gir (Demo)",
      age: 5,
      health: "Good",
      vaccination: "2026-01-15",
      ownerName: "Ramesh Kumar",
      aadhar: "987654321012",
      phone: "9876543210", 
      address: "Kisan Dairy Farm, Main Road",
      photos: ["mock_photo_url"],
      registeredAt: new Date().toISOString(),
      strikes: 0,
      seized: false
    }
  ],
  complaints: [],
  revenue: { total: 0, municipality: 0, pppFirm: 0 },
  missingReports: [
    {
      id: 'm1',
      ownerName: 'Ramesh Singh',
      location: 'Garhwa',
      photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80',
      timestamp: new Date().toISOString(),
      reporterPhone: '9876543210'
    }
  ],
  gaushalas: [
    { id: 1, name: "Shri Krishna Gaushala", location: "Garhwa", phone: "9876543210", capacity: 150 },
    { id: 2, name: "Pashupati Nath Shelter", location: "Garhwa", phone: "8765432109", capacity: 80 },
    { id: 3, name: "Gau Mata Seva Ashram", location: "Ranchi", phone: "7654321098", capacity: 200 },
    { id: 4, name: "Brijbhoomi Gau-Kalyan", location: "Garhwa", phone: "9123456780", capacity: 300 },
    { id: 5, name: "Dayanand Gaushala", location: "Hazaribagh", phone: "8123456780", capacity: 120 }
  ],
  vets: [
    { id: 1, name: "Dr. Rajesh Kumar", specialization: "General Cattle Health", location: "Garhwa", phone: "9000100021", clinic: "Pashu Chikitsalaya, Main Road" },
    { id: 2, name: "Dr. Sunita Sharma", specialization: "Dairy Nutrition Expert", location: "Garhwa", phone: "9000100022", clinic: "Govt Vet Hospital, City Center" },
    { id: 3, name: "Dr. Amit Patel", specialization: "Emergency Care", location: "Ranchi", phone: "9000100023", clinic: "Ranchi Care" },
    { id: 4, name: "Dr. Vikas Singh", specialization: "Surgery & Trauma", location: "Garhwa", phone: "9000100024", clinic: "Kisan Vet Clinic" },
    { id: 5, name: "Dr. Anjali Pandey", specialization: "Obstetrics (Pregnancy Care)", location: "Garhwa", phone: "9000100025", clinic: "Pashu Care Center" },
    { id: 6, name: "Dr. Rohan Verma", specialization: "General Cattle Health", location: "Hazaribagh", phone: "9000100026", clinic: "Hazaribagh Vet Hospital" }
  ],
  diseaseAlerts: [
    { id: 'da1', disease: 'Lumpy Skin Disease (LSD)', location: 'Garhwa', date: '2026-08-10', reportedBy: 'Dr. Rajesh Kumar', description: 'Suspected outbreak in main dairy belt. Isolate affected cattle immediately and contact vet.' }
  ],
  ambulances: [
    { id: 1, name: "Shiv Shankar Transport", location: "Garhwa", phone: "9876000001", vehicle: "Bolero Pickup (Cattle Safe)" },
    { id: 2, name: "Raju Tractor Sewa", location: "Garhwa", phone: "9876000002", vehicle: "Tractor Trolley" },
    { id: 3, name: "City Vet Ambulance", location: "Ranchi", phone: "9800000000", vehicle: "Specialized Vet Van" },
    { id: 4, name: "Garhwa Animal Rescue Van", location: "Garhwa", phone: "9876000004", vehicle: "Hydraulic Vet Truck" },
    { id: 5, name: "Mukesh Transport", location: "Hazaribagh", phone: "9876000005", vehicle: "Tractor Trolley" }
  ],
  warehouseInventory: 50000,
  adoptions: [
    { id: 'ad1', type: 'Cow', breed: 'Sahiwal', age: 3, health: 'Healthy', photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80', description: 'Very calm. Rescued from highway.', status: 'available', requests: [] }
  ],
  notifications: [],
  tagRequests: [],
  injuredReports: [],
  fieldCamps: [
    { id: 'fc1', location: 'Ward 5, Garhwa', date: '2026-09-17', status: 'upcoming', type: 'Tagging Camp' }
  ],
  auditLogs: []
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: initialSeeds.users,
      cows: initialSeeds.cows,
      complaints: initialSeeds.complaints,
      revenue: initialSeeds.revenue,
      missingReports: initialSeeds.missingReports,
      gaushalas: initialSeeds.gaushalas,
      vets: initialSeeds.vets,
      diseaseAlerts: initialSeeds.diseaseAlerts,
      ambulances: initialSeeds.ambulances,
      warehouseInventory: initialSeeds.warehouseInventory,
      adoptions: initialSeeds.adoptions,
      notifications: initialSeeds.notifications,
      tagRequests: initialSeeds.tagRequests,
      injuredReports: initialSeeds.injuredReports,
      fieldCamps: initialSeeds.fieldCamps,
      auditLogs: initialSeeds.auditLogs,
      apiStatus: 'checking',

      // Initialize state from Express REST API backend and Firebase
      init: async () => {
        try {
          // 1. Fetch synchronized state from Node.js Express REST API
          const restRes = await api.getState();
          if (restRes.success && restRes.data) {
            const serverState = restRes.data;
            const formatCows = serverState.cows || [];
            const hasDemo = formatCows.some(c => c.qrId === '00');
            const demoCow = initialSeeds.cows[0];

            set({
              users: serverState.users || get().users,
              cows: hasDemo ? formatCows : [demoCow, ...formatCows],
              complaints: serverState.complaints || get().complaints,
              revenue: serverState.revenue || get().revenue,
              missingReports: serverState.missingReports || get().missingReports,
              gaushalas: serverState.gaushalas || get().gaushalas,
              vets: serverState.vets || get().vets,
              diseaseAlerts: serverState.diseaseAlerts || get().diseaseAlerts,
              ambulances: serverState.ambulances || get().ambulances,
              warehouseInventory: serverState.warehouseInventory ?? get().warehouseInventory,
              adoptions: serverState.adoptions || get().adoptions,
              notifications: serverState.notifications || get().notifications,
              tagRequests: serverState.tagRequests || get().tagRequests,
              injuredReports: serverState.injuredReports || get().injuredReports,
              fieldCamps: serverState.fieldCamps || get().fieldCamps,
              auditLogs: serverState.auditLogs || get().auditLogs,
              apiStatus: 'online'
            });
            console.log('[Pashu Care] Synced state from Express REST API backend.');
          } else {
            set({ apiStatus: 'offline' });
          }

          // 2. Fetch from Firebase Firestore if configured
          const fbState = await fetchStateFromFirebase();
          if (fbState) {
            if (fbState.cows && fbState.cows.length > 0) {
              set(s => ({ cows: [...fbState.cows, ...s.cows.filter(c => !fbState.cows.some(fc => fc.qrId === c.qrId))] }));
            }
            if (fbState.complaints && fbState.complaints.length > 0) {
              set({ complaints: fbState.complaints });
            }
            if (fbState.diseaseAlerts && fbState.diseaseAlerts.length > 0) {
              set({ diseaseAlerts: fbState.diseaseAlerts });
            }
          }

          // 3. Listen to real-time Firebase changes (if configured)
          subscribeToFirebase('cows', (updatedCows) => {
            if (updatedCows && updatedCows.length > 0) {
              set({ cows: updatedCows });
            }
          });
          subscribeToFirebase('complaints', (updatedComplaints) => {
            if (updatedComplaints) {
              set({ complaints: updatedComplaints });
            }
          });
          subscribeToFirebase('diseaseAlerts', (updatedAlerts) => {
            if (updatedAlerts) {
              set({ diseaseAlerts: updatedAlerts });
            }
          });
        } catch (e) {
          console.error('[Pashu Care Init Notice]:', e);
        }
      },

      allocateInventory: async (phone, amount) => {
        const numAmount = Number(amount);
        // Optimistic UI update
        set(state => {
          const users = state.users.map(u => 
            u.phone === phone 
              ? { ...u, inventory: { ...u.inventory, remaining: (u.inventory?.remaining || 0) + numAmount, total: (u.inventory?.total || 0) + numAmount } } 
              : u
          );
          const warehouseInventory = Math.max(0, state.warehouseInventory - numAmount);
          return { users, warehouseInventory };
        });

        // Express REST API backend call
        const userPhone = get().user?.phone || 'Admin';
        api.allocateInventory(phone, numAmount, userPhone).then(res => {
          if (res.success && res.data) {
            set({ warehouseInventory: res.data.warehouseInventory });
          }
        });

        const targetUser = get().users.find(u => u.phone === phone);
        if (targetUser) {
          saveUserToFirebase(targetUser);
        }
      },

      assignRole: (phone, name, role) => {
        let label = 'कार्य';
        if (role === 'gaushala_manager') label = 'गौशाला क्षमता';
        if (role === 'tagging_agent') label = 'QR टैग';
        if (role === 'patrol_squad') label = 'गश्ती कार्य';

        const activeHours = Math.floor(Math.random() * 9) + 4; // gen random shift hours

        set(state => {
          const existingUserIndex = state.users.findIndex(u => u.phone === phone);
          let updatedUsers = [...state.users];

          if (existingUserIndex >= 0) {
            updatedUsers[existingUserIndex] = { 
              ...updatedUsers[existingUserIndex], 
              role, 
              name, 
              activeHours: updatedUsers[existingUserIndex].activeHours || activeHours, 
              inventory: { total: 100, remaining: 100, label } 
            };
          } else {
            updatedUsers.push({ 
              phone, 
              role, 
              name, 
              location: 'Assigned by Admin', 
              activeHours, 
              inventory: { total: 100, remaining: 100, label } 
            });
          }
          return { users: updatedUsers };
        });

        // Dispatch to Node.js Express REST API & Firebase
        const adminPhone = get().user?.phone || 'Admin';
        api.assignRole(phone, name, role, adminPhone);
        const assignedUser = get().users.find(u => u.phone === phone);
        if (assignedUser) saveUserToFirebase(assignedUser);
      },

      updateUserInventory: (phone, total, remaining) => {
        set(state => {
          const users = state.users.map(u => 
            u.phone === phone ? { ...u, inventory: { ...u.inventory, total, remaining } } : u
          );
          const user = state.user?.phone === phone 
            ? { ...state.user, inventory: { ...state.user.inventory, total, remaining } } 
            : state.user;
          return { users, user };
        });

        // Express REST API backend call & Firebase sync
        api.updateInventory(phone, total, remaining);
        const user = get().users.find(u => u.phone === phone);
        if (user) saveUserToFirebase(user);
      },

      checkUser: (phone) => {
        if (phone === '9999999999') return true;
        return get().users.some(u => u.phone === phone);
      },

      registerAndLogin: (phone, name, location, otp) => {
        if (otp === '1234') {
          const newUser = { phone, role: 'user', name, location, inventory: {} };
          set(state => ({ users: [...state.users, newUser], user: newUser }));
          
          // Call Express REST API & Firebase
          api.register(phone, name, location, otp);
          saveUserToFirebase(newUser);
          return true;
        }
        return false;
      },

      login: (phone, otp) => {
        if (otp === '1234') {
          if (phone === '9999999999') {
            set({ user: { phone, role: 'admin', name: 'Admin', location: 'HQ' } });
            api.login(phone, otp);
            return true;
          }
          const existingUser = get().users.find(u => u.phone === phone);
          if (existingUser) {
            set({ user: existingUser });
            api.login(phone, otp);
            return true;
          } else {
            // Auto-register citizen
            const newUser = { phone, role: 'user', name: 'Citizen', location: 'Local', inventory: {} };
            set(state => ({ users: [...state.users, newUser], user: newUser }));
            api.register(phone, 'Citizen', 'Local', otp);
            saveUserToFirebase(newUser);
            return true;
          }
        }
        return false;
      },

      logout: () => set({ user: null }),

      registerCow: (cowData) => {
        const newCow = { ...cowData, strikes: 0, seized: false, registeredAt: new Date().toISOString() };
        set(state => ({ cows: [...state.cows, newCow] }));

        // Send to Express REST API & Firebase Cloud Firestore
        api.registerCow(newCow);
        saveCowToFirebase(newCow);
      },

      getCowByQrId: (qrId) => {
        return get().cows.find(c => c.qrId === qrId);
      },

      getComplaintsByQrId: (qrId) => {
        return get().complaints.filter(c => c.cowQrId === qrId);
      },

      reportComplaint: (complaintData) => {
        set((state) => {
          const cowIndex = state.cows.findIndex(c => c.qrId === complaintData.cowQrId);
          if (cowIndex === -1) return state;
          const cow = state.cows[cowIndex];
          if (cow.seized) return state;

          let newStrikes = cow.strikes || 0;
          let fine = 0;
          let seized = false;
          let type = 'alert';
          let status = 'alert_sent';
          let mapUrl = '';
          if (complaintData.location && complaintData.location.lat && complaintData.location.lng) {
            mapUrl = `https://maps.google.com/?q=${complaintData.location.lat},${complaintData.location.lng}`;
          }

          if (complaintData.issueFine) {
            newStrikes += 1;
            type = 'violation';
            if (newStrikes === 1) fine = 1000;
            else if (newStrikes === 2) fine = 3000;
            else if (newStrikes >= 3) seized = true;
            status = seized ? 'pending_seizure' : 'unpaid';
          }

          const newComplaint = {
            ...complaintData,
            mapUrl,
            type,
            strikeLevel: newStrikes,
            fine,
            status,
            id: complaintData.id || Date.now().toString()
          };
          const updatedCows = [...state.cows];

          if (complaintData.issueFine) {
            updatedCows[cowIndex] = { ...cow, strikes: newStrikes, seized };
          }

          // Call Express REST API & Firebase Firestore
          api.reportComplaint(newComplaint);
          saveComplaintToFirebase(newComplaint);
          if (complaintData.issueFine) {
            saveCowToFirebase(updatedCows[cowIndex]);
          }

          return { 
            complaints: [...state.complaints, newComplaint], 
            cows: updatedCows 
          };
        });
      },

      payChallan: (complaintId) => {
        set((state) => {
          const cmpList = [...state.complaints];
          const index = cmpList.findIndex(c => c.id === complaintId);
          if (index === -1) return state;
          const cmp = cmpList[index];
          if (cmp.status === 'unpaid') {
            cmp.status = 'paid';
            const newTotal = (state.revenue?.total || 0) + cmp.fine;
            const updatedRevenue = {
              total: newTotal,
              municipality: newTotal * 0.60,
              pppFirm: newTotal * 0.40
            };

            // Call Express REST API & Firebase
            api.payChallan(complaintId);
            saveComplaintToFirebase(cmp);

            return { complaints: cmpList, revenue: updatedRevenue };
          }
          return state;
        });
      },

      disputeChallan: (complaintId) => {
        set((state) => {
          const cmpList = [...state.complaints];
          const index = cmpList.findIndex(c => c.id === complaintId);
          if (index !== -1 && cmpList[index].status === 'unpaid') {
            cmpList[index].status = 'disputed';
            api.disputeChallan(complaintId);
            saveComplaintToFirebase(cmpList[index]);
          }
          return { complaints: cmpList };
        });
      },

      escalateIssue: async (complaintId, department) => {
        try {
          toast.success('Escalated to ' + department);
          const adminPhone = get().user?.phone || 'Admin';
          await api.escalateIssue(complaintId, department, adminPhone);
        } catch (e) {
          console.error(e);
        }
      },

      fetchAuditLogs: async () => {
        const res = await api.getAuditLogs();
        if (res.success && res.data) {
          set({ auditLogs: res.data });
        }
      },

      addMissingReport: (reportData) => {
        toast.error('MISSING ANIMAL REPORTED', { icon: '⚠️' });
        const newReport = {
          ...reportData,
          id: reportData.id || Date.now().toString(),
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          missingReports: [newReport, ...state.missingReports]
        }));

        // Call Express REST API & Firebase
        api.reportMissing(newReport);
        saveMissingReportToFirebase(newReport);
      },

      addDiseaseAlert: (alertData) => {
        toast.error('DISEASE OUTBREAK: ' + alertData.disease, { icon: '🚨' });
        const newAlert = {
          ...alertData,
          id: alertData.id || Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        };

        set((state) => ({
          diseaseAlerts: [newAlert, ...state.diseaseAlerts]
        }));

        // Call Express REST API & Firebase
        api.reportAlert(newAlert);
        saveDiseaseAlertToFirebase(newAlert);
      },
      
      reportInjuredAnimal: (reportData) => {
        toast.error('ANIMAL EMERGENCY', { icon: '🚑' });
        const newReport = {
          ...reportData,
          id: reportData.id || Date.now().toString(),
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          injuredReports: [newReport, ...state.injuredReports]
        }));

        // Call Express REST API & Firebase
        api.reportInjured(newReport);
        saveInjuredReportToFirebase(newReport);
      },

      addAdoptionListing: (listingData) => {
        const newListing = {
          ...listingData,
          id: listingData.id || Date.now().toString(),
          status: 'available',
          requests: []
        };

        set((state) => ({
          adoptions: [newListing, ...state.adoptions]
        }));

        // Call Express REST API & Firebase
        api.addAdoption(newListing);
        saveAdoptionToFirebase(newListing);
      },

      requestAdoption: (adoptionId, requestData) => {
        set((state) => {
          let updatedAdoptions = [...state.adoptions];
          const index = updatedAdoptions.findIndex(a => a.id === adoptionId);
          if (index !== -1) {
            const req = { ...requestData, id: Date.now().toString(), status: 'pending' };
            updatedAdoptions[index] = {
              ...updatedAdoptions[index],
              requests: [...(updatedAdoptions[index].requests || []), req]
            };
            api.requestAdoption(adoptionId, req);
            saveAdoptionToFirebase(updatedAdoptions[index]);
          }
          return { adoptions: updatedAdoptions };
        });
      },

      addNotification: (notifData) => {
        const newNotif = {
          ...notifData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications]
        }));

        api.sendNotification(newNotif);
      },

      requestTags: (phone, amount) => {
        const newReq = {
          phone,
          amount,
          id: Date.now().toString(),
          status: 'pending',
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          tagRequests: [newReq, ...state.tagRequests]
        }));

        api.requestTags(phone, amount);
      },

      approveTagRequest: (id) => {
        set((state) => ({
          tagRequests: state.tagRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r)
        }));

        api.approveTagRequest(id);
      }
    }),
    {
      name: 'pashu-care-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Fetch initial synchronized state on boot
useAppStore.getState().init();

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      cows: [],
      complaints: [],
      revenue: { total: 0, municipality: 0, pppFirm: 0 },
      missingReports: [],
      gaushalas: [],
      vets: [],
      diseaseAlerts: [],
      ambulances: [],
      warehouseInventory: 0,
      adoptions: [],
      notifications: [],
      tagRequests: [],
      injuredReports: [],
      fieldCamps: [],
      auditLogs: [],

      init: async () => {
        try {
          // get all tables
          const [usersRes, cowsRes, gaushalasRes, vetsRes, ambulancesRes, alertsRes] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('cows').select('*'),
            supabase.from('gaushalas').select('*'),
            supabase.from('vets').select('*'),
            supabase.from('ambulances').select('*'),
            supabase.from('alerts').select('*')
          ]);

          if (usersRes.data) {
             const formatUsers = usersRes.data.map(u => ({ ...u, activeHours: u.active_hours, inventory: { total: u.inventory_total, remaining: u.inventory_remaining, label: u.inventory_label } }));
             set({ users: formatUsers });
          }
          
          if (cowsRes.data) {
             const formatCows = cowsRes.data.map(c => ({ ...c, qrId: c.qr_id, ownerName: c.owner_name, registeredAt: c.registered_at }));
             // hardcode demo tag 00 if missing from db
             const hasDemo = formatCows.some(c => c.qrId === '00');
             const mockCow = { qrId: "00", species: "Cow", breed: "Gir (Demo)", age: 5, health: "Good", vaccination: "2026-01-15", ownerName: "Ramesh Kumar", aadhar: "987654321012", phone: "9876543210", address: "Kisan Dairy Farm, Main Road", photos: ["mock_photo_url"], registeredAt: new Date().toISOString(), strikes: 0, seized: false };
             set({ cows: hasDemo ? formatCows : [mockCow, ...formatCows] });
          }

          if (gaushalasRes.data) set({ gaushalas: gaushalasRes.data });
          if (vetsRes.data) set({ vets: vetsRes.data });
          if (ambulancesRes.data) set({ ambulances: ambulancesRes.data });
          
          if (alertsRes.data) {
             set({
                diseaseAlerts: alertsRes.data.filter(a => a.type === 'disease' || a.type === 'diseaseAlerts'),
                missingReports: alertsRes.data.filter(a => a.type === 'missing'),
                injuredReports: alertsRes.data.filter(a => a.type === 'sos' || a.type === 'escalation')
             });
          }
        } catch (e) {
          console.error('Supabase Init Failed:', e);
        }
      },

      allocateInventory: async (phone, amount) => {
         // Optimistic
         set(state => {
            const users = state.users.map(u => u.phone === phone ? { ...u, inventory: { ...u.inventory, remaining: u.inventory.remaining + Number(amount) } } : u);
            return { users };
         });
         const user = get().users.find(u => u.phone === phone);
         if(user) {
            await supabase.from('users').update({ inventory_remaining: user.inventory.remaining }).eq('phone', phone);
         }
      },

      assignRole: (phone, name, role) => {
        set(state => {
          const existingUserIndex = state.users.findIndex(u => u.phone === phone);
          let updatedUsers = [...state.users];
          let label = '?????';
          if (role === 'gaushala_manager') label = '?????? ??????';
          if (role === 'tagging_agent') label = 'QR ???';
          if (role === 'patrol_squad') label = '????? ?????';

          const activeHours = Math.floor(Math.random() * 9) + 4; // gen random hours
          if (existingUserIndex >= 0) {
            updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], role, name, activeHours, inventory: { total: 100, remaining: 100, label } };
            supabase.from('users').update({ role, name, active_hours: activeHours, inventory_total: 100, inventory_remaining: 100, inventory_label: label }).eq('phone', phone).then();
          } else {
            updatedUsers.push({ phone, role, name, location: 'Assigned by Admin', activeHours, inventory: { total: 100, remaining: 100, label } });
            supabase.from('users').insert({ phone, role, name, location: 'Assigned by Admin', active_hours: activeHours, inventory_total: 100, inventory_remaining: 100, inventory_label: label }).then();
          }
          return { users: updatedUsers };
        });
      },

      updateUserInventory: (phone, total, remaining) => {
        set(state => {
          const users = state.users.map(u => u.phone === phone ? { ...u, inventory: { ...u.inventory, total, remaining } } : u);
          const user = state.user?.phone === phone ? { ...state.user, inventory: { ...state.user.inventory, total, remaining } } : state.user;
          supabase.from('users').update({ inventory_total: total, inventory_remaining: remaining }).eq('phone', phone).then();
          return { users, user };
        });
      },

      checkUser: (phone) => {
        if (phone === '9999999999') return true;
        return get().users.some(u => u.phone === phone);
      },

      registerAndLogin: (phone, name, location, otp) => {
        if (otp === '1234') {
          const newUser = { phone, role: 'user', name, location, inventory: {} };
          set(state => ({ users: [...state.users, newUser], user: newUser }));
          supabase.from('users').insert({ phone, name, location, role: 'user' }).then();
          return true;
        }
        return false;
      },

      login: (phone, otp) => {
        if (otp === '1234') {
          if (phone === '9999999999') {
            set({ user: { phone, role: 'admin', name: 'Admin', location: 'HQ' } });
            return true;
          }
          const existingUser = get().users.find(u => u.phone === phone);
          if (existingUser) {
            set({ user: existingUser });
            return true;
          } else {
            // Auto-register citizen
            const newUser = { phone, role: 'user', name: 'Citizen', location: 'Local', inventory: {} };
            set(state => ({ users: [...state.users, newUser], user: newUser }));
            supabase.from('users').insert({ phone, name: 'Citizen', location: 'Local', role: 'user' }).then();
            return true;
          }
        }
        return false;
      },

      logout: () => set({ user: null }),

      registerCow: (cowData) => {
        set((state) => {
          supabase.from('cows').insert({ 
            qr_id: cowData.qrId, breed: cowData.breed, age: cowData.age, health: cowData.health, 
            vaccination: cowData.vaccination, owner_name: cowData.ownerName, phone: cowData.phone, address: cowData.address 
          }).then();
          return { cows: [...state.cows, { ...cowData, strikes: 0, seized: false }] };
        });
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

          let newStrikes = cow.strikes;
          let fine = 0;
          let seized = false;
          let type = 'alert';
          let status = 'alert_sent';
          let mapUrl = '';
          if (complaintData.location) mapUrl = "https://maps.google.com/?q= + complaintData.location.lat + , + complaintData.location.lng + ";

          if (complaintData.issueFine) {
            newStrikes += 1;
            type = 'violation';
            if (newStrikes === 1) fine = 1000;
            else if (newStrikes === 2) fine = 3000;
            else if (newStrikes >= 3) seized = true;
            status = seized ? 'pending_seizure' : 'unpaid';
          }

          const newComplaint = { ...complaintData, mapUrl, type, strikeLevel: newStrikes, fine, status, id: Date.now().toString() };
          const updatedCows = [...state.cows];
          
          if (complaintData.issueFine) {
            updatedCows[cowIndex] = { ...cow, strikes: newStrikes, seized };
            supabase.from('cows').update({ strikes: newStrikes, seized }).eq('qr_id', cow.qrId).then();
          }

          supabase.from('alerts').insert({ type: 'sos', description: complaintData.reason, location: mapUrl }).then();

          return { complaints: [...state.complaints, newComplaint], cows: updatedCows };
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
            const newTotal = state.revenue.total + cmp.fine;
            return { complaints: cmpList, revenue: { total: newTotal, municipality: newTotal * 0.60, pppFirm: newTotal * 0.40 } };
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
          }
          return { complaints: cmpList };
        });
      },

      escalateIssue: async (complaintId, department) => {
        const state = get();
        try {
           toast.success('Escalated to ' + department);
           supabase.from('alerts').insert({ type: 'escalation', description: 'Escalated to ' + department, location: 'HQ' }).then();
        } catch(e) {
          console.error(e);
        }
      },

      fetchAuditLogs: async () => {}, // Not strictly mapped yet, ignoring to keep it light

      addMissingReport: (reportData) => {
        toast.error('MISSING ANIMAL REPORTED', { icon: '⚠️' });
        set((state) => {
          supabase.from('alerts').insert({ type: 'missing', description: 'Animal Missing', location: reportData.location }).then();
          return { missingReports: [ { ...reportData, id: Date.now().toString(), timestamp: new Date().toISOString() }, ...state.missingReports ] };
        });
      },

      addDiseaseAlert: (alertData) => {
        toast.error('DISEASE OUTBREAK: ' + alertData.disease, { icon: '🚨' });
        set((state) => {
          supabase.from('alerts').insert({ type: 'disease', description: alertData.disease, location: alertData.location }).then();
          return { diseaseAlerts: [ { ...alertData, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }, ...state.diseaseAlerts ] };
        });
      },
      
      reportInjuredAnimal: (reportData) => {
        toast.error('ANIMAL EMERGENCY', { icon: '🚑' });
        set((state) => {
          supabase.from('alerts').insert({ type: 'sos', description: reportData.description || 'Injured', location: reportData.location }).then();
          return { injuredReports: [ { ...reportData, id: Date.now().toString(), timestamp: new Date().toISOString() }, ...state.injuredReports ] };
        });
      },

      addAdoptionListing: (listingData) => {
        set((state) => {
          return { adoptions: [ { ...listingData, id: Date.now().toString(), status: 'available', requests: [] }, ...state.adoptions ] };
        });
      },

      requestAdoption: (adoptionId, requestData) => {
        set((state) => {
          let updatedAdoptions = [...state.adoptions];
          const index = updatedAdoptions.findIndex(a => a.id === adoptionId);
          if (index !== -1) {
            updatedAdoptions[index] = {
              ...updatedAdoptions[index],
              requests: [ ...updatedAdoptions[index].requests, { ...requestData, id: Date.now().toString(), status: 'pending' } ]
            };
          }
          return { adoptions: updatedAdoptions };
        });
      },

      addNotification: (notifData) => {
        set((state) => {
          return { notifications: [ { ...notifData, id: Date.now().toString(), timestamp: new Date().toISOString(), read: false }, ...state.notifications ] };
        });
      },

      requestTags: (phone, amount) => {
        set((state) => {
          const newReq = { phone, amount, id: Date.now().toString(), status: 'pending', timestamp: new Date().toISOString() };
          return { tagRequests: [ newReq, ...state.tagRequests ] };
        });
      },

      approveTagRequest: (id) => {
        set((state) => {
          return { tagRequests: state.tagRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r) };
        });
      }
    }),
    {
      name: 'pashu-care-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// fetch init state
useAppStore.getState().init();

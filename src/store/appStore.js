import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  init: async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        set({ ...data });
      }
    } catch (e) {
      console.error('API Init Failed:', e);
    }
  },

  allocateInventory: async (phone, amount) => {
    try {
      const res = await fetch('/api/inventory/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: Number(amount) })
      });
      if (res.ok) {
        const data = await res.json();
        set(state => {
          const users = state.users.map(u => 
            u.phone === phone ? { ...u, inventory: data.inventory } : u
          );
          return { users, warehouseInventory: data.warehouseInventory };
        });
      }
    } catch (e) {
      console.error('Inventory Transfer Failed:', e);
    }
  },

  assignRole: (phone, name, role) => {
    set(state => {
      const existingUserIndex = state.users.findIndex(u => u.phone === phone);
      let updatedUsers = [...state.users];
      let label = 'कार्य';
      if(role === 'gaushala_manager') label = 'गौशाला क्षमता';
      if(role === 'tagging_agent') label = 'QR टैग';
      if(role === 'patrol_squad') label = 'गश्ती कार्य';

      if (existingUserIndex >= 0) {
        updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], role, name, inventory: { total: 100, remaining: 100, label } };
      } else {
        updatedUsers.push({ phone, role, name, location: 'Assigned by Admin', inventory: { total: 100, remaining: 100, label } });
      }

      // Fire and forget API call
      fetch('/api/users/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, role })
      }).catch(console.error);

      return { users: updatedUsers };
    });
  },

  updateUserInventory: (phone, total, remaining) => {
    set(state => {
      const users = state.users.map(u => 
        u.phone === phone ? { ...u, inventory: { ...u.inventory, total, remaining } } : u
      );
      const user = state.user?.phone === phone ? { ...state.user, inventory: { ...state.user.inventory, total, remaining } } : state.user;
      
      fetch('/api/users/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, total, remaining })
      }).catch(console.error);

      return { users, user };
    });
  },

  checkUser: (phone) => {
    if (phone === '9999999999') return true;
    return get().users.some(u => u.phone === phone);
  },

  registerAndLogin: (phone, name, location, otp) => {
    if (otp === '1234') {
      const newUser = { phone, role: 'user', name, location };
      set(state => ({
        users: [...state.users, newUser],
        user: newUser
      }));

      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, location, otp })
      }).catch(console.error);

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
      }
    }
    return false;
  },

  logout: () => set({ user: null }),

  registerCow: (cowData) => {
    set((state) => {
      fetch('/api/cows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cowData)
      }).catch(console.error);
      
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
      if (complaintData.location) {
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
        id: Date.now().toString()
      };

      const updatedCows = [...state.cows];
      if (complaintData.issueFine) {
        updatedCows[cowIndex] = { ...cow, strikes: newStrikes, seized };
      }

      fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      }).catch(console.error);

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
        
        const newTotal = state.revenue.total + cmp.fine;
        
        fetch(`/api/complaints/${complaintId}/pay`, { method: 'PUT' }).catch(console.error);

        return {
          complaints: cmpList,
          revenue: {
            total: newTotal,
            municipality: newTotal * 0.60,
            pppFirm: newTotal * 0.40
          }
        };
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
        fetch(`/api/complaints/${complaintId}/dispute`, { method: 'PUT' }).catch(console.error);
      }
      return { complaints: cmpList };
    });
  },

  addMissingReport: (reportData) => {
    set((state) => {
      fetch('/api/missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      }).catch(console.error);

      return {
        missingReports: [
          { ...reportData, id: Date.now().toString(), timestamp: new Date().toISOString() },
          ...state.missingReports
        ]
      };
    });
  },

  addDiseaseAlert: (alertData) => {
    set((state) => {
      fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      }).catch(console.error);

      return {
        diseaseAlerts: [
          { ...alertData, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] },
          ...state.diseaseAlerts
        ]
      };
    });
  },

  addAdoptionListing: (listingData) => {
    set((state) => {
      fetch('/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData)
      }).catch(console.error);

      return {
        adoptions: [
          { ...listingData, id: Date.now().toString(), status: 'available', requests: [] },
          ...state.adoptions
        ]
      };
    });
  },

  requestAdoption: (adoptionId, requestData) => {
    set((state) => {
      let updatedAdoptions = [...state.adoptions];
      const index = updatedAdoptions.findIndex(a => a.id === adoptionId);
      if (index !== -1) {
        updatedAdoptions[index] = {
          ...updatedAdoptions[index],
          requests: [
            ...updatedAdoptions[index].requests,
            { ...requestData, id: Date.now().toString(), status: 'pending' }
          ]
        };
      }

      fetch('/api/adoptions/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adoptionId, requestData })
      }).catch(console.error);

      return { adoptions: updatedAdoptions };
    });
  }
    }),
    {
      name: 'pashu-care-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Initialize store with fetching backend state once
useAppStore.getState().init();

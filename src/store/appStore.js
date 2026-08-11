import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  user: null, // { phone, role: 'admin' | 'user', name, location }
  users: [], // Array of registered users
  cows: [], 
  complaints: [], // violations ledger
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
  
  // Mock Gaushalas data
  gaushalas: [
    { id: 1, name: "Shri Krishna Gaushala", location: "Garhwa", phone: "9876543210", capacity: 150 },
    { id: 2, name: "Pashupati Nath Shelter", location: "Garhwa", phone: "8765432109", capacity: 80 },
    { id: 3, name: "Gau Mata Seva Ashram", location: "Ranchi", phone: "7654321098", capacity: 200 },
    { id: 4, name: "Brijbhoomi Gau-Kalyan", location: "Garhwa", phone: "9123456780", capacity: 300 },
    { id: 5, name: "Dayanand Gaushala", location: "Hazaribagh", phone: "8123456780", capacity: 120 }
  ],

  // Mock Vets data
  vets: [
    { id: 1, name: "Dr. Rajesh Kumar", specialization: "General Cattle Health", location: "Garhwa", phone: "9000100021", clinic: "Pashu Chikitsalaya, Main Road" },
    { id: 2, name: "Dr. Sunita Sharma", specialization: "Dairy Nutrition Expert", location: "Garhwa", phone: "9000100022", clinic: "Govt Vet Hospital, City Center" },
    { id: 3, name: "Dr. Amit Patel", specialization: "Emergency Care", location: "Ranchi", phone: "9000100023", clinic: "Ranchi Care" },
    { id: 4, name: "Dr. Vikas Singh", specialization: "Surgery & Trauma", location: "Garhwa", phone: "9000100024", clinic: "Kisan Vet Clinic" },
    { id: 5, name: "Dr. Anjali Pandey", specialization: "Obstetrics (Pregnancy Care)", location: "Garhwa", phone: "9000100025", clinic: "Safe Cow Care Center" },
    { id: 6, name: "Dr. Rohan Verma", specialization: "General Cattle Health", location: "Hazaribagh", phone: "9000100026", clinic: "Hazaribagh Vet Hospital" }
  ],

  // Mock Disease Alerts
  diseaseAlerts: [
    { id: 'da1', disease: 'Lumpy Skin Disease (LSD)', location: 'Garhwa', date: '2026-08-10', reportedBy: 'Dr. Rajesh Kumar', description: 'Suspected outbreak in main dairy belt. Isolate affected cattle immediately and contact vet.' }
  ],

  // Mock Ambulances
  ambulances: [
    { id: 1, name: "Shiv Shankar Transport", location: "Garhwa", phone: "9876000001", vehicle: "Bolero Pickup (Cattle Safe)" },
    { id: 2, name: "Raju Tractor Sewa", location: "Garhwa", phone: "9876000002", vehicle: "Tractor Trolley" },
    { id: 3, name: "City Vet Ambulance", location: "Ranchi", phone: "9800000000", vehicle: "Specialized Vet Van" },
    { id: 4, name: "Garhwa Animal Rescue Van", location: "Garhwa", phone: "9876000004", vehicle: "Hydraulic Vet Truck" },
    { id: 5, name: "Mukesh Transport", location: "Hazaribagh", phone: "9876000005", vehicle: "Tractor Trolley" }
  ],

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
    set((state) => ({
      cows: [...state.cows, { ...cowData, strikes: 0, seized: false }],
    }));
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
      if (cow.seized) return state; // Can't report if already seized

      const newStrikes = cow.strikes + 1;
      let fine = 0;
      let seized = false;

      if (newStrikes === 1) fine = 1000;
      else if (newStrikes === 2) fine = 3000;
      else if (newStrikes >= 3) {
        seized = true;
      }

      const newComplaint = {
        ...complaintData,
        strikeLevel: newStrikes,
        fine,
        status: seized ? 'pending_seizure' : 'unpaid',
        id: Date.now().toString()
      };

      const updatedCows = [...state.cows];
      updatedCows[cowIndex] = { ...cow, strikes: newStrikes, seized };

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
      }
      return { complaints: cmpList };
    });
  },

  addMissingReport: (reportData) => {
    set((state) => ({
      missingReports: [
        { ...reportData, id: Date.now().toString(), timestamp: new Date().toISOString() },
        ...state.missingReports
      ]
    }));
  },

  addDiseaseAlert: (alertData) => {
    set((state) => ({
      diseaseAlerts: [
        { ...alertData, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] },
        ...state.diseaseAlerts
      ]
    }));
  }
}));

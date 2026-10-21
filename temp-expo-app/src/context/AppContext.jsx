import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Translations } from '../constants/translations';

const DEFAULT_COWS = [
  {
    qrId: '00',
    species: 'Cow',
    breed: 'Gir (Registered Demo)',
    age: 5,
    health: 'Good / स्वस्थ',
    vaccination: '2026-01-15',
    ownerName: 'Ramesh Kumar (किसान)',
    aadhar: '987654321012',
    phone: '9876543210',
    address: 'Kisan Dairy Farm, Main Road, Garhwa',
    photos: ['https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80'],
    registeredAt: new Date().toISOString(),
    strikes: 1,
    seized: false,
  },
  {
    qrId: 'TAG-101',
    species: 'Cow',
    breed: 'Sahiwal',
    age: 4,
    health: 'Healthy / सामान्य',
    vaccination: '2026-02-10',
    ownerName: 'Sunil Mahto',
    aadhar: '453218769012',
    phone: '9876543211',
    address: 'Ward 4, Govindpur',
    photos: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&q=80'],
    registeredAt: new Date().toISOString(),
    strikes: 0,
    seized: false,
  },
  {
    qrId: 'TAG-205',
    species: 'Cow',
    breed: 'Tharparkar',
    age: 6,
    health: 'Injured Leg / उपचार जारी',
    vaccination: '2025-11-20',
    ownerName: 'Brijesh Yadav',
    aadhar: '887766554433',
    phone: '9876543212',
    address: 'Brij Dairy, Bypass Road',
    photos: ['https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500&q=80'],
    registeredAt: new Date().toISOString(),
    strikes: 2,
    seized: false,
  }
];

const DEFAULT_GAUSHALAS = [
  { id: 1, name: 'श्री कृष्ण गौशाला (Shri Krishna Gaushala)', location: 'Garhwa Road', phone: '9876543210', capacity: 150, currentOccupancy: 112 },
  { id: 2, name: 'पशुपति नाथ आश्रय (Pashupati Nath Shelter)', location: 'Sector 3, Garhwa', phone: '8765432109', capacity: 80, currentOccupancy: 65 },
  { id: 3, name: 'गौ माता सेवा आश्रम (Gau Mata Seva Ashram)', location: 'Ranchi Highway', phone: '7654321098', capacity: 200, currentOccupancy: 140 },
  { id: 4, name: 'बृजभूमि गौ-कल्याण केंद्र', location: 'Station Road', phone: '9123456780', capacity: 300, currentOccupancy: 210 },
  { id: 5, name: 'दयानंद गौ सेवा समिति', location: 'Hazaribagh Road', phone: '8123456780', capacity: 120, currentOccupancy: 95 },
];

const DEFAULT_VETS = [
  { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'General Cattle Health & Surgery', location: 'Garhwa Central', phone: '9000100021', clinic: 'Pashu Chikitsalaya, Main Road' },
  { id: 2, name: 'Dr. Sunita Sharma', specialization: 'Dairy Nutrition & Epidemics', location: 'Govt Vet Center', phone: '9000100022', clinic: 'Govt Animal Hospital, City Center' },
  { id: 3, name: 'Dr. Amit Patel', specialization: 'Emergency Trauma Care', location: 'Emergency Squad', phone: '9000100023', clinic: 'Ranchi Urgent Vet Care' },
  { id: 4, name: 'Dr. Anjali Pandey', specialization: 'Obstetrics (Cattle Pregnancy)', location: 'Ward 5', phone: '9000100025', clinic: 'Kalyan Pashu Care' },
];

const DEFAULT_AMBULANCES = [
  { id: 1, name: 'Shiv Shankar Transport (पशु एम्बुलेंस)', location: 'Garhwa Chowk', phone: '9876000001', vehicle: 'Bolero Pickup (Cattle Safe Railing)' },
  { id: 2, name: 'Garhwa Municipal Vet Rescue Van', location: 'HQ Garage', phone: '9876000004', vehicle: 'Hydraulic Lift Vet Truck' },
  { id: 3, name: 'Raju Tractor Trolley Sewa', location: 'Rural Outskirts', phone: '9876000002', vehicle: 'Tractor Trolley with Straw Bedding' },
  { id: 4, name: 'City 24/7 Mobile Vet Clinic', location: 'Ranchi Road', phone: '9800000000', vehicle: 'Intensive Animal Care Van' },
];

const DEFAULT_ALERTS = [
  {
    id: 'da1',
    disease: 'Lumpy Skin Disease (LSD) / गांठदार त्वचा रोग',
    location: 'Garhwa Dairy Zone',
    date: '2026-08-10',
    reportedBy: 'Dr. Rajesh Kumar',
    description: 'दूध उत्पादक क्षेत्र में संक्रमण की आशंका। प्रभावित पशुओं को तुरंत अलग रखें और पशु चिकित्सालय सूचित करें।',
  },
  {
    id: 'da2',
    disease: 'Foot and Mouth Disease (FMD) / खुरपका-मुंहपका',
    location: 'Bypass Cattle Market',
    date: '2026-09-02',
    reportedBy: 'Dr. Sunita Sharma',
    description: 'नियमित रिंग टीकाकरण अभियान प्रारंभ। खुरों की पोटेशियम परमैंगनेट घोल से सफाई सुनिश्चित करें।',
  }
];

const DEFAULT_MISSING = [
  {
    id: 'm1',
    ownerName: 'Ramesh Singh (पशुपालक)',
    location: 'Garhwa Station Road',
    photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80',
    timestamp: '2 घंटे पहले',
    reporterPhone: '9876543210',
    description: 'लाल रंग की गिर नस्ल की गाय, गले में नीला पट्टा व पीला कान टैग #00 लगा है।',
    reward: '₹2,000 इनाम',
  },
  {
    id: 'm2',
    ownerName: 'Manoj Tiwari',
    location: 'Ward 2, Shiv Mandir Chowk',
    photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&q=80',
    timestamp: 'कल शाम',
    reporterPhone: '9123456789',
    description: 'सफेद साहीवाल बछिया, दाहिने सींग पर लाल निशान।',
    reward: '₹1,500 इनाम',
  }
];

const DEFAULT_ADOPTIONS = [
  {
    id: 'ad1',
    type: 'Cow',
    breed: 'Sahiwal (साहीवाल)',
    age: 3,
    health: 'Healthy & Vaccinated',
    photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80',
    description: 'हाईवे से रेस्क्यू की गई शांत स्वभाव की साहीवाल गाय। सेवाभावी परिवार के लिए उपलब्ध।',
    status: 'available',
    requests: [],
  },
  {
    id: 'ad2',
    type: 'Calf',
    breed: 'Gir (गिर बछड़ा)',
    age: 1,
    health: 'Active & Playful',
    photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&q=80',
    description: 'स्वस्थ छोटा गिर बछड़ा, गौशाला में देखभाल में है। गोद लेने हेतु आवेदन करें।',
    status: 'available',
    requests: [],
  }
];

const DEFAULT_COMPLAINTS = [
  {
    id: 'cmp_1',
    cowQrId: '00',
    timestamp: new Date().toISOString(),
    reporterPhone: '2222222222',
    reason: 'मुख्य सड़क पर यातायात अवरोध (Traffic Obstruction)',
    animalState: 'Wandering Stray',
    landmark: 'Clock Tower Chowk, Garhwa',
    type: 'violation',
    strikeLevel: 1,
    fine: 1000,
    status: 'unpaid',
  }
];

const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    phone: '9999999999',
    role: 'admin',
    name: 'Municipal Admin',
    location: 'Nagar Nigam HQ',
    inventory: { total: 500, remaining: 340, label: 'QR टैग' },
    activeHours: 8,
  });

  const [language, setLanguage] = useState('hi');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [cows, setCows] = useState(DEFAULT_COWS);
  const [complaints, setComplaints] = useState(DEFAULT_COMPLAINTS);
  const [gaushalas, setGaushalas] = useState(DEFAULT_GAUSHALAS);
  const [vets, setVets] = useState(DEFAULT_VETS);
  const [ambulances, setAmbulances] = useState(DEFAULT_AMBULANCES);
  const [diseaseAlerts, setDiseaseAlerts] = useState(DEFAULT_ALERTS);
  const [missingReports, setMissingReports] = useState(DEFAULT_MISSING);
  const [adoptions, setAdoptions] = useState(DEFAULT_ADOPTIONS);
  const [warehouseInventory, setWarehouseInventory] = useState(50000);
  const [revenue, setRevenue] = useState({ total: 1000, municipality: 600, pppFirm: 400 });

  const t = (key) => {
    return Translations[language]?.[key] || Translations.en?.[key] || String(key);
  };

  const refreshState = async () => {
    try {
      const health = await api.checkHealth();
      if (health?.status === 'online') {
        setIsBackendOnline(true);
        const state = await api.getState();
        if (state) {
          if (state.cows?.length) setCows(state.cows);
          if (state.complaints) setComplaints(state.complaints);
          if (state.gaushalas?.length) setGaushalas(state.gaushalas);
          if (state.vets?.length) setVets(state.vets);
          if (state.ambulances?.length) setAmbulances(state.ambulances);
          if (state.diseaseAlerts?.length) setDiseaseAlerts(state.diseaseAlerts);
          if (state.missingReports?.length) setMissingReports(state.missingReports);
          if (state.adoptions?.length) setAdoptions(state.adoptions);
          if (state.revenue) setRevenue(state.revenue);
          if (state.warehouseInventory !== undefined) setWarehouseInventory(state.warehouseInventory);
        }
      } else {
        setIsBackendOnline(false);
      }
    } catch (_) {
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 15000);
    return () => clearInterval(interval);
  }, []);

  const registerCow = async (newCowData) => {
    const fullCow = {
      qrId: newCowData.qrId || `TAG-${Date.now().toString().slice(-4)}`,
      species: newCowData.species || 'Cow',
      breed: newCowData.breed || 'Desi Indigenous',
      age: Number(newCowData.age) || 3,
      health: newCowData.health || 'Healthy / स्वस्थ',
      vaccination: newCowData.vaccination || new Date().toISOString().split('T')[0],
      ownerName: newCowData.ownerName || 'Pashupalak',
      aadhar: newCowData.aadhar || '000000000000',
      phone: newCowData.phone || user.phone,
      address: newCowData.address || 'Local Dairy',
      photos: newCowData.photos || ['https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80'],
      registeredAt: new Date().toISOString(),
      strikes: 0,
      seized: false,
    };

    setCows(prev => [fullCow, ...prev]);
    try {
      await api.registerCow(fullCow);
    } catch (_) {}
    return true;
  };

  const reportComplaint = async (data) => {
    const cow = cows.find(c => c.qrId === data.cowQrId);
    const newStrikes = (cow?.strikes || 0) + (data.issueFine ? 1 : 0);
    const isSeized = newStrikes >= 3;
    let fine = 0;
    if (data.issueFine) {
      if (newStrikes === 1) fine = 1000;
      else if (newStrikes === 2) fine = 3000;
      else if (newStrikes >= 3) fine = 5000;
    }

    const newComplaint = {
      id: `cmp_${Date.now()}`,
      cowQrId: data.cowQrId,
      location: data.location,
      timestamp: new Date().toISOString(),
      reporterPhone: user.phone,
      reason: data.reason || 'Road Traffic Violation / आवारा विचरण',
      photo: data.photo,
      animalState: data.animalState || 'Roaming on road',
      landmark: data.landmark || 'Main Road',
      type: data.issueFine ? 'violation' : 'alert',
      strikeLevel: newStrikes,
      fine,
      status: isSeized ? 'pending_seizure' : (data.issueFine ? 'unpaid' : 'alert_sent'),
    };

    setComplaints(prev => [newComplaint, ...prev]);
    if (data.issueFine && cow) {
      setCows(prev => prev.map(c => c.qrId === cow.qrId ? { ...c, strikes: newStrikes, seized: isSeized } : c));
    }

    try {
      await api.createComplaint({ ...newComplaint, issueFine: data.issueFine });
    } catch (_) {}
    return true;
  };

  const payComplaint = async (id) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updatedRevenue = revenue.total + c.fine;
        setRevenue({
          total: updatedRevenue,
          municipality: Math.round(updatedRevenue * 0.60),
          pppFirm: Math.round(updatedRevenue * 0.40),
        });
        return { ...c, status: 'paid' };
      }
      return c;
    }));

    try {
      await api.payComplaint(id);
    } catch (_) {}
    return true;
  };

  const reportMissing = async (data) => {
    const newReport = {
      id: `m_${Date.now()}`,
      ownerName: data.ownerName || user.name,
      location: data.location || user.location,
      photo: data.photo || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80',
      timestamp: 'अभी-अभी (Just now)',
      reporterPhone: data.reporterPhone || user.phone,
      description: data.description,
      reward: data.reward || '₹1,000 इनाम',
    };
    setMissingReports(prev => [newReport, ...prev]);
    try {
      await api.reportMissing(newReport);
    } catch (_) {}
    return true;
  };

  const reportDiseaseAlert = async (data) => {
    const newAlert = {
      id: `da_${Date.now()}`,
      disease: data.disease,
      location: data.location || user.location,
      date: new Date().toISOString().split('T')[0],
      reportedBy: data.reportedBy || user.name,
      description: data.description,
    };
    setDiseaseAlerts(prev => [newAlert, ...prev]);
    try {
      await api.reportDiseaseAlert(newAlert);
    } catch (_) {}
    return true;
  };

  const triggerSOS = async (data) => {
    const reportData = {
      id: `sos_${Date.now()}`,
      type: data.type || 'injured',
      description: data.description || 'Emergency Cattle Assistance Required',
      location: data.location || 'Current GPS Location',
      reporterPhone: user.phone,
      timestamp: new Date().toISOString(),
      status: 'dispatched_vet',
    };
    try {
      await api.reportInjuredSOS(reportData);
    } catch (_) {}
    return true;
  };

  const requestAdoption = async (id, contact) => {
    setAdoptions(prev => prev.map(a => a.id === id ? { ...a, status: 'requested' } : a));
    try {
      await api.requestAdoption(id, contact);
    } catch (_) {}
    return true;
  };

  const switchUserRole = (newRole) => {
    let name = 'Citizen User';
    let location = 'Garhwa Ward 1';
    let inventory = { total: 0, remaining: 0, label: 'टैग' };

    if (newRole === 'admin') {
      name = 'Municipal Commissioner';
      location = 'Nagar Nigam HQ';
      inventory = { total: 1000, remaining: 820, label: 'QR टैग स्टॉक' };
    } else if (newRole === 'patrol_squad') {
      name = 'Bishal (गश्ती प्रभारी)';
      location = 'Main City Squad';
      inventory = { total: 50, remaining: 28, label: 'गश्ती कार्य' };
    } else if (newRole === 'tagging_agent') {
      name = 'Sunil (टैगिंग एजेंट)';
      location = 'Field Ward 5';
      inventory = { total: 150, remaining: 74, label: 'QR टैग' };
    } else if (newRole === 'gaushala_manager') {
      name = 'Raj Tiwari (गौशाला प्रबंधक)';
      location = 'Shri Krishna Gaushala';
      inventory = { total: 150, remaining: 38, label: 'उपलब्ध बेड' };
    }

    setUser({
      phone: newRole === 'admin' ? '9999999999' : '9876543210',
      role: newRole,
      name,
      location,
      inventory,
      activeHours: 8,
    });
  };

  const allocateInventory = async (phone, amount) => {
    setWarehouseInventory(prev => Math.max(0, prev - amount));
    try {
      await api.allocateInventory(phone, amount, user.phone);
    } catch (_) {}
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage,
        t,
        isBackendOnline,
        cows,
        complaints,
        gaushalas,
        vets,
        ambulances,
        diseaseAlerts,
        missingReports,
        adoptions,
        warehouseInventory,
        revenue,
        refreshState,
        registerCow,
        reportComplaint,
        payComplaint,
        reportMissing,
        reportDiseaseAlert,
        triggerSOS,
        requestAdoption,
        switchUserRole,
        allocateInventory,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};

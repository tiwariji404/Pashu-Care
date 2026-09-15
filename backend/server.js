const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// IN-MEMORY DATA STORE
let state = {
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
  notifications: []
};

// API: GET FULL STATE (For simple initial load)
app.get('/api/state', (req, res) => {
  res.json({
    users: state.users,
    cows: state.cows,
    complaints: state.complaints,
    revenue: state.revenue,
    missingReports: state.missingReports,
    gaushalas: state.gaushalas,
    vets: state.vets,
    diseaseAlerts: state.diseaseAlerts,
    ambulances: state.ambulances,
    warehouseInventory: state.warehouseInventory,
    adoptions: state.adoptions,
    notifications: state.notifications
  });
});

// API: TRANSFER INVENTORY
app.post('/api/inventory/transfer', (req, res) => {
  const { phone, amount } = req.body;
  const user = state.users.find(u => u.phone === phone);
  
  if (user && user.inventory) {
    user.inventory.total += amount;
    user.inventory.remaining += amount;
    state.warehouseInventory -= amount;
    res.json({ success: true, inventory: user.inventory, warehouseInventory: state.warehouseInventory });
  } else {
    res.status(404).json({ error: 'User not found or no inventory' });
  }
});

// API: AUTHENTICATION
app.post('/api/auth/login', (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '1234') {
    if (phone === '9999999999') {
      return res.json({ success: true, user: { phone, role: 'admin', name: 'Admin', location: 'HQ' } });
    }
    const existingUser = state.users.find(u => u.phone === phone);
    if (existingUser) {
      return res.json({ success: true, user: existingUser });
    }
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/auth/register', (req, res) => {
  const { phone, name, location, otp } = req.body;
  if (otp === '1234') {
    const newUser = { phone, role: 'user', name, location };
    state.users.push(newUser);
    return res.json({ success: true, user: newUser });
  }
  res.status(401).json({ success: false, message: 'Invalid OTP' });
});

app.get('/api/auth/check/:phone', (req, res) => {
  const { phone } = req.params;
  if (phone === '9999999999') return res.json({ exists: true });
  const exists = state.users.some(u => u.phone === phone);
  res.json({ exists });
});

// API: USERS
app.post('/api/users/assign-role', (req, res) => {
  const { phone, name, role } = req.body;
  
  let label = 'कार्य';
  if(role === 'gaushala_manager') label = 'गौशाला क्षमता';
  if(role === 'tagging_agent') label = 'QR टैग';
  if(role === 'patrol_squad') label = 'गश्ती कार्य';

  const existingUserIndex = state.users.findIndex(u => u.phone === phone);
  const activeHours = Math.floor(Math.random() * 9) + 4; // Mock 4-12 hours
  if (existingUserIndex >= 0) {
    state.users[existingUserIndex] = { ...state.users[existingUserIndex], role, name, activeHours: state.users[existingUserIndex].activeHours || activeHours, inventory: { total: 100, remaining: 100, label } };
  } else {
    state.users.push({ phone, role, name, location: 'Assigned by Admin', activeHours, inventory: { total: 100, remaining: 100, label } });
  }
  res.json({ success: true, users: state.users });
});

app.put('/api/users/inventory', (req, res) => {
  const { phone, total, remaining } = req.body;
  state.users = state.users.map(u => 
    u.phone === phone ? { ...u, inventory: { ...u.inventory, total, remaining } } : u
  );
  res.json({ success: true, users: state.users });
});

// API: COWS
app.post('/api/cows', (req, res) => {
  const cowData = req.body;
  state.cows.push({ ...cowData, strikes: 0, seized: false });
  res.json({ success: true, cows: state.cows });
});

// API: COMPLAINTS
app.post('/api/complaints', (req, res) => {
  const { cowQrId, location, timestamp, reporterPhone, reason, photo, animalState, landmark, issueFine } = req.body;
  const cowIndex = state.cows.findIndex(c => c.qrId === cowQrId);
  if (cowIndex === -1) return res.status(404).json({ error: 'Animal not found' });

  const cow = state.cows[cowIndex];
  if (cow.seized) return res.status(400).json({ error: 'Animal already seized' });

  let mapUrl = '';
  if (location && location.lat && location.lng) {
    mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  }

  // MOCK SMS LOGIC
  console.log(`\n[SMS MOCK] Dispatching to Owner (${cow.ownerName}): "Your animal (${cow.breed}) was reported by a patrol squad. Location: ${mapUrl}"\n`);

  let newStrikes = cow.strikes;
  let fine = 0;
  let seized = false;
  let type = 'alert';
  let status = 'alert_sent';

  if (issueFine) {
    newStrikes += 1;
    type = 'violation';
    if (newStrikes === 1) fine = 1000;
    else if (newStrikes === 2) fine = 3000;
    else if (newStrikes >= 3) seized = true;
    status = seized ? 'pending_seizure' : 'unpaid';
  }

  const newComplaint = {
    cowQrId,
    location,
    timestamp,
    reporterPhone,
    reason,
    photo,
    animalState,
    landmark,
    mapUrl,
    type,
    strikeLevel: newStrikes,
    fine,
    status,
    id: req.body.id || Date.now().toString()
  };

  if (issueFine) {
    state.cows[cowIndex] = { ...cow, strikes: newStrikes, seized };
  }
  
  state.complaints.push(newComplaint);

  res.json({ success: true, complaints: state.complaints, cows: state.cows });
});

app.put('/api/complaints/:id/pay', (req, res) => {
  const complaintId = req.params.id;
  const index = state.complaints.findIndex(c => c.id === complaintId);
  if (index !== -1 && state.complaints[index].status === 'unpaid') {
    const cmp = state.complaints[index];
    cmp.status = 'paid';
    const newTotal = state.revenue.total + cmp.fine;
    state.revenue = {
      total: newTotal,
      municipality: newTotal * 0.60,
      pppFirm: newTotal * 0.40
    };
    return res.json({ success: true, complaints: state.complaints, revenue: state.revenue });
  }
  res.status(400).json({ error: 'Unable to pay' });
});

app.put('/api/complaints/:id/dispute', (req, res) => {
  const complaintId = req.params.id;
  const index = state.complaints.findIndex(c => c.id === complaintId);
  if (index !== -1 && state.complaints[index].status === 'unpaid') {
    state.complaints[index].status = 'disputed';
    return res.json({ success: true, complaints: state.complaints });
  }
  res.status(400).json({ error: 'Unable to dispute' });
});

// API: MISSING REPORTS
app.post('/api/missing', (req, res) => {
  const reportData = req.body;
  const newReport = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...reportData };
  state.missingReports.unshift(newReport);
  res.json({ success: true, missingReports: state.missingReports });
});

// API: DISEASE ALERTS
app.post('/api/alerts', (req, res) => {
  const alertData = req.body;
  const newAlert = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...alertData };
  state.diseaseAlerts.unshift(newAlert);
  res.json({ success: true, diseaseAlerts: state.diseaseAlerts });
});

// API: ADOPTIONS
app.post('/api/adoptions', (req, res) => {
  const listingData = req.body;
  const newListing = { id: Date.now().toString(), status: 'available', requests: [], ...listingData };
  state.adoptions.unshift(newListing);
  res.json({ success: true, adoptions: state.adoptions });
});

app.post('/api/adoptions/request', (req, res) => {
  const { adoptionId, requestData } = req.body;
  const index = state.adoptions.findIndex(a => a.id === adoptionId);
  if (index !== -1) {
    state.adoptions[index].requests.push({ id: Date.now().toString(), status: 'pending', ...requestData });
    res.json({ success: true, adoptions: state.adoptions });
  } else {
    res.status(404).json({ error: 'Listing not found' });
  }
});

// API: NOTIFICATIONS
app.post('/api/notifications', (req, res) => {
  const notifData = req.body;
  const newNotif = { id: Date.now().toString(), timestamp: new Date().toISOString(), read: false, ...notifData };
  state.notifications.unshift(newNotif);
  res.json({ success: true, notifications: state.notifications });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend API serving on http://localhost:${PORT}`);
});

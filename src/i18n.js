import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation strings
const resources = {
  en: {
    translation: {
      "app_title": "Pashu Care",
      "admin_badge": "Admin",
      "citizen": "Citizen",
      "hq": "HQ",
      "vet_doctor": "Veterinarian",
      "cow_ambulance": "Cow Ambulance",
      "gaushalas": "Gaushalas",
      "missing_report": "Missing Report",
      "animal_knowledge": "Animal Hub",
      "disease_alerts": "Disease Alerts",
      "ppp_revenue_split": "PPP Revenue Split",
      "total_fine_collection": "Total Fine Collection",
      "municipality": "Municipality",
      "private_firm": "Private Firm",
      "seizure_orders": "Seizure Orders (3rd Strike)",
      "owner": "Owner",
      "view_details": "View Details",
      "worker_progress": "Worker Progress",
      "no_workers_found": "No workers found.",
      "assign_roles": "Assign Specific Roles",
      "phone_number": "Phone Number",
      "name": "Name",
      "select_role": "Select Role",
      "gaushala_manager": "Gaushala Manager",
      "patrol_squad": "Patrolling Squad",
      "tagging_agent": "QR Tagging Agent",
      "admin": "Administrator",
      "assign_role_btn": "Assign Role",
      "scan_rfid": "Scan RFID / QR Tag",
      "scan_desc": "Scan an unregistered tag to start the Registration process.",
      "global_ledger": "Global Ledger",
      "no_recent_patrol": "No recent patrol violations reported yet.",
      "strike_violation": "Strike {{strikeLevel}} Violation",
      "cow_id": "Cow ID",
      "fine": "Fine",
      "loc": "Loc",
      "time": "Time",
      "login_title": "Login to Pashu Care",
      "enter_phone": "Enter Phone Number",
      "login_btn": "Login / Register",
      "alert_invalid_phone": "Please enter a valid 10-digit phone number.",
      "alert_role_assigned": "Role {{role}} assigned to {{name}} ({{phone}}) successfully!",
      "logout": "Logout"
    }
  },
  hi: {
    translation: {
      "app_title": "सुरक्षित गाय",
      "admin_badge": "एडमिन",
      "citizen": "नागरिक",
      "hq": "मुख्यालय",
      "vet_doctor": "पशु चिकित्सक",
      "cow_ambulance": "पशु एम्बुलेंस",
      "gaushalas": "गौशालाएं",
      "missing_report": "गुमशुदा रिपोर्ट",
      "animal_knowledge": "पशु ज्ञान (हब)",
      "disease_alerts": "महामारी अलर्ट",
      "ppp_revenue_split": "राजस्व वितरण (PPP)",
      "total_fine_collection": "कुल जुर्माना संकलन",
      "municipality": "नगर पालिका",
      "private_firm": "निजी कंपनी",
      "seizure_orders": "जब्ती आदेश (तीसरी चेतावनी)",
      "owner": "मालिक",
      "view_details": "विवरण देखें",
      "worker_progress": "कार्यकर्ताओं की प्रगति",
      "no_workers_found": "कोई कार्यकर्ता नहीं मिला।",
      "assign_roles": "भूमिका (Role) सौंपें",
      "phone_number": "फोन नंबर",
      "name": "नाम",
      "select_role": "भूमिका चुनें",
      "gaushala_manager": "गौशाला प्रबंधक",
      "patrol_squad": "गश्ती दस्ता",
      "tagging_agent": "टैगिंग एजेंट",
      "admin": "प्रशासक",
      "assign_role_btn": "भूमिका सौंपें",
      "scan_rfid": "RFID / QR टैग स्कैन करें",
      "scan_desc": "पंजीकरण प्रक्रिया शुरू करने के लिए अपंजीकृत टैग स्कैन करें।",
      "global_ledger": "ग्लोबल लेज़र",
      "no_recent_patrol": "हाल ही में कोई गश्ती उल्लंघन दर्ज नहीं किया गया।",
      "strike_violation": "चेतावनी {{strikeLevel}} उल्लंघन",
      "cow_id": "गाय की आईडी",
      "fine": "जुर्माना",
      "loc": "स्थान",
      "time": "समय",
      "login_title": "सेफ काऊ में प्रवेश करें",
      "enter_phone": "फ़ोन नंबर दर्ज करें",
      "login_btn": "लॉगिन / पंजीकरण करें",
      "alert_invalid_phone": "कृपया 10-अंकों का वैध फ़ोन नंबर दर्ज करें।",
      "alert_role_assigned": "भूमिका {{role}} को {{name}} ({{phone}}) को सफलतापूर्वक सौंप दी गई है!",
      "logout": "लॉगआउट"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en",
    
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

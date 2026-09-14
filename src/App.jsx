import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import LanguageSwitcher from './components/LanguageSwitcher';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScannerPage from './pages/ScannerPage';
import CowDetails from './pages/CowDetails';
import AgentRegistration from './pages/AgentRegistration';
import MissingZone from './pages/MissingZone';
import GaushalaList from './pages/GaushalaList';
import VetList from './pages/VetList';
import KnowledgeHub from './pages/KnowledgeHub';
import DiseaseAlerts from './pages/DiseaseAlerts';
import AmbulanceList from './pages/AmbulanceList';
import UserProfile from './pages/UserProfile';
import WorkerProfile from './pages/WorkerProfile';
import AgentList from './pages/AgentList';
import AdoptionPortal from './pages/AdoptionPortal';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useAppStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <LanguageSwitcher />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
          <Route path="/cow/:qrId" element={<ProtectedRoute><CowDetails /></ProtectedRoute>} />
          <Route path="/register/:qrId" element={<ProtectedRoute><AgentRegistration /></ProtectedRoute>} />
          <Route path="/missing" element={<ProtectedRoute><MissingZone /></ProtectedRoute>} />
          <Route path="/gaushalas" element={<ProtectedRoute><GaushalaList /></ProtectedRoute>} />
          <Route path="/vets" element={<ProtectedRoute><VetList /></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><KnowledgeHub /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><DiseaseAlerts /></ProtectedRoute>} />
          <Route path="/ambulance" element={<ProtectedRoute><AmbulanceList /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/worker/:phone" element={<ProtectedRoute><WorkerProfile /></ProtectedRoute>} />
          <Route path="/adoption" element={<ProtectedRoute><AdoptionPortal /></ProtectedRoute>} />
          <Route path="/admin/agents/:role" element={<ProtectedRoute><AgentList /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

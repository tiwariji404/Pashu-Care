import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, MapPin, Phone, LogOut, FileText, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout, missingReports, notifications } = useAppStore();
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userReports = missingReports.filter(r => r.reporterPhone === user.phone).length;

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          My Profile
        </h1>
      </div>
      
      <div className="content">
        <div className="card" style={{ textAlign: 'center', paddingTop: '2.5rem', paddingBottom: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--surface-color) 0%, #f0fdf4 100%)', border: '1px solid #bbf7d0' }}>
          <UserCircle size={80} color="var(--primary-color)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{user.name}</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {user.location} &nbsp;|&nbsp; 
            <Phone size={16} /> {user.phone}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span className="badge">{user.role === 'admin' ? 'Official Admin' : 'Verified Citizen'}</span>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Account Activity</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
             <FileText size={24} color="#3b82f6" />
             <h2 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.75rem' }}>{userReports}</h2>
             <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 500 }}>Filed Reports</span>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
             <CheckCircle size={24} color="var(--primary-color)" />
             <h2 style={{ margin: 0, color: '#166534', fontSize: '1.75rem' }}>Active</h2>
             <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 500 }}>Account Status</span>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Important Notifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {notifications?.filter(n => n.targetPhone === user.phone).length === 0 ? (
            <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>You have no new notifications.</p>
          ) : (
            notifications?.filter(n => n.targetPhone === user.phone).map((notif, idx) => (
              <div key={idx} className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{notif.type.toUpperCase()} ALERT</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(notif.timestamp).toLocaleString()}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{notif.message}</p>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={handleLogout} 
          className="btn btn-outline" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={20} /> Secure Logout
        </button>
      </div>
    </>
  );
}

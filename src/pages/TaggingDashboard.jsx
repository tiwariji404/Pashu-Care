import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { QrCode, PlusCircle, Activity, Box } from 'lucide-react';
import WorkerInventory from '../components/WorkerInventory';

export default function TaggingDashboard() {
  const { user, cows } = useAppStore();
  const navigate = useNavigate();

  const myTagsToday = cows.length; // Simplified

  return (
    <>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QrCode color="var(--primary-color)" size={28} />
          <h1 style={{ margin: 0 }}>QR Tagging Agent</h1>
        </div>
      </div>
      
      <div className="content">
        <div 
          onClick={() => navigate('/profile')}
          style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{user?.name}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Agent @ {user?.location || 'HQ'}</p>
          </div>
          <Activity size={36} color="var(--primary-color)" />
        </div>

        <WorkerInventory />

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/scan')}
          style={{ padding: '1.5rem', width: '100%', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <PlusCircle size={24} /> Register New Cattle (Scan Tag)
        </button>

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> Recent Registrations</h3>
        
        {cows.length === 0 ? (
          <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No registrations yet.
          </p>
        ) : (
          cows.slice(0, 3).map((c, i) => (
            <div key={i} className="card" style={{ marginBottom: '0.75rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{c.breed} (ID: {c.qrId.substring(0, 8)}...)</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Owner: {c.ownerName}</span>
              </div>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)' }}>Success</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { QrCode, PlusCircle, Activity, Box } from 'lucide-react';
import WorkerInventory from '../components/WorkerInventory';

export default function TaggingDashboard() {
  const { user, cows } = useAppStore();
  const navigate = useNavigate();

  // For demo, we assume all cows in state were tagged by this agent
  const myCows = cows;
  const myTagsToday = myCows.length;

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

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> All Tagging Details (History)</h3>
        
        {myCows.length === 0 ? (
          <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No cattle tags registered yet. Start scanning to build your history!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myCows.map((c, i) => (
              <div key={i} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--primary-color)' }}>UID: {c.qrId}</strong>
                  <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-hover)' }}>Registered</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <p style={{ margin: 0 }}><strong>Breed:</strong> {c.breed}</p>
                  <p style={{ margin: 0 }}><strong>Owner:</strong> {c.ownerName}</p>
                  <p style={{ margin: 0 }}><strong>Phone:</strong> {c.ownerPhone || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Loc:</strong> {c.location ? `${c.location.lat?.toFixed(3)}, ${c.location.lng?.toFixed(3)}` : 'HQ'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

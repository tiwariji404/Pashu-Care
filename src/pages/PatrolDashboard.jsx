import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Shield, Map, AlertTriangle, Crosshair, Search } from 'lucide-react';
import WorkerInventory from '../components/WorkerInventory';
import EmergencySOS from '../components/EmergencySOS';

export default function PatrolDashboard() {
  const { user, complaints } = useAppStore();
  const navigate = useNavigate();

  const myReports = complaints.filter(c => c.reporterPhone === user?.phone || true); // Assuming all for demo
  const myViolationsLogged = myReports.length;
  const pendingSeizures = complaints.filter(c => c.status === 'pending_seizure').length;

  return (
    <>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield color="var(--primary-color)" size={28} />
          <h1 style={{ margin: 0 }}>Patrolling Squad</h1>
        </div>
      </div>
      
      <div className="content">
        <div 
          onClick={() => navigate('/profile')}
          style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{user?.name}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Squad Leader @ {user?.location || 'HQ'}</p>
          </div>
          <span className="badge" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>On Duty</span>
        </div>

        <WorkerInventory />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--primary-color)' }}>
             <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{myViolationsLogged}</h3>
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Violations Logged</p>
           </div>
           <div className="card" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--danger-color)' }}>
             <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--danger-color)' }}>{pendingSeizures}</h3>
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Seizure Targets</p>
           </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/scan')}
          style={{ padding: '1.5rem', width: '100%', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem', backgroundColor: '#0f172a' }}
        >
          <Crosshair size={24} /> Log Stray Violation (Scan Tag)
        </button>

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Map size={20} /> Field Actions</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }} onClick={() => navigate('/missing')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Search size={20} /> Active Missing Reports</span>
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }} onClick={() => navigate('/ambulance')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><AlertTriangle size={20} /> Call Transport/Rescue</span>
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <EmergencySOS />
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} /> My Recent Reports
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myReports.length === 0 ? (
            <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No reports filed yet.</p>
          ) : (
            myReports.map((c, i) => (
              <div key={i} className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong>Cow Tag: {c.cowQrId}</strong>
                  <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-hover)' }}>{c.status.toUpperCase()}</span>
                </div>
                <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>Note: {c.reason}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(c.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

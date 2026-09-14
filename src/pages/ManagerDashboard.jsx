import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Home, Users, CheckCircle, TrendingUp, Download, Package, HeartHandshake } from 'lucide-react';
import WorkerInventory from '../components/WorkerInventory';

export default function ManagerDashboard() {
  const { user, cows } = useAppStore();
  const navigate = useNavigate();

  // Simple stats for demonstration
  const totalCattle = cows.length;
  // Let's pretend some cows are assigned to this manager's location
  const myFacilityCows = cows.filter(c => c.healthStatus === 'Healthy' || true).length; // demo logic

  return (
    <>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/src/assets/pashu care.png" alt="Pashu Care" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <h1 style={{ margin: 0 }}>Gaushala Manager</h1>
        </div>
      </div>
      
      <div className="content">
        <div 
          onClick={() => navigate('/profile')}
          style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>Welcome, {user?.name}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manager @ {user?.location || 'HQ'}</p>
          </div>
          <Home size={36} color="var(--primary-color)" />
        </div>

        <WorkerInventory />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
             <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{myFacilityCows}</h3>
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Cattle Housed</p>
           </div>
           <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
             <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#eab308' }}>15</h3>
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admissions Today</p>
           </div>
        </div>

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Management Actions</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }} onClick={() => navigate('/scan')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Download size={20} /> Intake / Scan Cattle</span>
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }} onClick={() => navigate('/vets')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users size={20} /> Call Vet / Specialist</span>
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }} onClick={() => navigate('/ambulance')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Package size={20} /> Feed Inventory</span>
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginTop: '0.5rem' }} onClick={() => navigate('/adoption')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><HeartHandshake size={20} /> Adoption Portal</span>
          </button>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><TrendingUp size={20} /> Monthly Progress</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Capacity Utilization</p>
          <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '75%', backgroundColor: 'var(--primary-color)', height: '100%' }}></div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>75% Full (150/200)</p>
        </div>
      </div>
    </>
  );
}

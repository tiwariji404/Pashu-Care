import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, User, Phone, MapPin, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export default function WorkerProfile() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const { users, cows, complaints, missingReports } = useAppStore();

  const worker = users.find(u => u.phone === phone);

  if (!worker) {
    return (
      <div className="content">
         <p>Worker not found.</p>
         <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const roleNames = {
    gaushala_manager: 'Gaushala Manager',
    patrol_squad: 'Patrolling Squad',
    tagging_agent: 'Tagging Agent'
  };

  const inv = worker.inventory || { total: 0, remaining: 0, label: 'Task' };
  const used = inv.total - inv.remaining;
  const progressPercent = inv.total > 0 ? (used / inv.total) * 100 : 0;

  // Filter tasks based on worker role for advanced details
  let recentActivities = [];
  if (worker.role === 'tagging_agent') {
    // Cows tagged 
    // In our mock DB, we don't have "taggedBy", but we can pretend to map it if we really wanted to. 
    // To keep it simple, we'll just show the latest 3 overall or a mock list. 
    recentActivities = cows.slice(0, 3).map(cow => ({ type: 'Registration', text: `Tagged ${cow.breed}`, detail: `UID: ${cow.qrId.substring(0,6)}...` }));
  } else if (worker.role === 'patrol_squad') {
    recentActivities = complaints.filter(c => c.type === 'violation').slice(0, 3).map(c => ({ type: 'E-Challan', text: `Issued Fine ₹${c.fine}`, detail: `UID: ${c.cowQrId.substring(0,6)}...` }));
  }

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} color="var(--primary-color)" />
          <h1 style={{ margin: 0 }}>Agent Profile</h1>
        </div>
      </div>

      <div className="content">
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--primary-color)' }}>
           <User size={64} color="var(--primary-color)" style={{ margin: '0 auto 1rem auto' }} />
           <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>{worker.name}</h2>
           <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{roleNames[worker.role] || worker.role}</p>

           <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.85rem' }}>
             <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}><Phone size={14} /> {worker.phone}</span>
             <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}><MapPin size={14} /> {worker.location || 'Field'}</span>
           </div>
        </div>

        <h3 style={{ margin: '2rem 0 1rem 0' }}>{worker.name}'s Progress</h3>
        <div className="card">
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
             <strong>{inv.label}</strong>
             <span style={{ fontSize: '0.875rem' }}>{progressPercent.toFixed(1)}% Completed</span>
           </div>
           <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
             {inv.label}: {used} / {inv.total} (शेष: {inv.remaining})
           </div>
           <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
             <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
           </div>
        </div>

        {recentActivities.length > 0 && (
          <>
            <h3 style={{ margin: '2rem 0 1rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><FileText size={20}/> Recent System Activity</h3>
            {recentActivities.map((act, i) => (
              <div key={i} className="card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{act.text}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.detail}</span>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)' }}>{act.type}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

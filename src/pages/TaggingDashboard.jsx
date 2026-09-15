import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { QrCode, PlusCircle, Activity, Box, MapPin, AlertTriangle, WifiOff, Clock } from 'lucide-react';
import WorkerInventory from '../components/WorkerInventory';
import EmergencySOS from '../components/EmergencySOS';

export default function TaggingDashboard() {
  const { user, cows, tagRequests, fieldCamps, requestTags, addDiseaseAlert } = useAppStore();
  const navigate = useNavigate();
  const [tagReqAmount, setTagReqAmount] = useState('');
  const [sosDesc, setSosDesc] = useState('');

  const myCows = cows;
  
  const myRequests = tagRequests.filter(r => r.phone === user?.phone);
  const myCamps = fieldCamps || [];
  
  const handleTagRequest = (e) => {
    e.preventDefault();
    if (tagReqAmount > 0) {
      requestTags(user.phone, tagReqAmount);
      setTagReqAmount('');
      alert('Tag request sent to Admin!');
    }
  };

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.75rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <WifiOff size={14}/> 0 Pending Syncs
            </span>
          </div>
        </div>

        <WorkerInventory />

        {/* Tag Request Section */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', borderColor: '#3b82f6' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={18} color="#2563eb" /> Request Tags from Admin
          </h3>
          <form onSubmit={handleTagRequest} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Qty (e.g. 50)" 
              value={tagReqAmount} 
              onChange={e => setTagReqAmount(e.target.value)}
              required
              min="1"
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Request</button>
          </form>
          {myRequests.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Recent: {myRequests[0].amount} tags - <strong style={{ color: myRequests[0].status === 'approved' ? '#10b981' : '#eab308' }}>{myRequests[0].status.toUpperCase()}</strong>
            </div>
          )}
        </div>

        {/* SOS Emergency Reporting */}
        <EmergencySOS />

        {/* Field Camp Scheduler */}
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}><MapPin size={18} /> Upcoming Tagging Camps</h3>
        <div style={{ marginBottom: '1.5rem', display: 'grid', gap: '0.5rem' }}>
          {myCamps.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No upcoming camps scheduled.</p>}
          {myCamps.map((camp, i) => (
             <div key={i} className="card" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <strong style={{ display: 'block', fontSize: '0.9rem' }}>{camp.location}</strong>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={12}/> {new Date(camp.date).toLocaleDateString()}</span>
                </div>
                <span className="badge" style={{ backgroundColor: '#ebf8ff', color: '#3182ce' }}>{camp.status}</span>
             </div>
          ))}
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/scan')}
          style={{ padding: '1.5rem', width: '100%', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <PlusCircle size={24} /> Register New Cattle
        </button>

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}><Activity size={18} /> Recent Tagging History</h3>
        
        {myCows.length === 0 ? (
          <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No cattle tags registered yet.
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

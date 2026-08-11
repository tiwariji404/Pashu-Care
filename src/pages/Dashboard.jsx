import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ScanLine, ShieldCheck, AlertCircle, TrendingUp, Ban, MapPin, AlertTriangle, Stethoscope, BookOpen, Activity, Ambulance, UserCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, complaints, revenue, cows } = useAppStore();
  const navigate = useNavigate();
  
  const seizedCows = cows.filter(c => c.seized);

  return (
    <>
      <div className="header">
        <h1><ShieldCheck /> Safe Cow</h1>
        {user?.role === 'admin' && <span className="badge" style={{ marginLeft: '0.5rem' }}>Admin</span>}
      </div>
      
      <div className="content">
        <div 
          onClick={() => navigate('/profile')} 
          style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{user?.name || 'Citizen'}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {user?.location || 'HQ'}</p>
          </div>
          <UserCircle size={36} color="var(--primary-color)" />
        </div>

        {/* Quick Actions Navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <button 
             onClick={() => navigate('/vets')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #3b82f6', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#2563eb', cursor: 'pointer', textAlign: 'center' }}>
             <Stethoscope size={28} />
             <strong style={{ fontSize: '0.9rem' }}>पशु चिकित्सक</strong>
           </button>
           <button 
             onClick={() => navigate('/ambulance')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #0d9488', borderRadius: '12px', backgroundColor: 'rgba(13, 148, 136, 0.05)', color: '#0d9488', cursor: 'pointer', textAlign: 'center' }}>
             <Ambulance size={28} />
             <strong style={{ fontSize: '0.9rem' }}>पशु एम्बुलेंस</strong>
           </button>
           <button 
             onClick={() => navigate('/gaushalas')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--primary-color)', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: 'var(--primary-hover)', cursor: 'pointer', textAlign: 'center' }}>
             <MapPin size={28} />
             <strong style={{ fontSize: '0.9rem' }}>गौशालाएं</strong>
           </button>
           <button 
             onClick={() => navigate('/missing')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--danger-hover)', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger-hover)', cursor: 'pointer', textAlign: 'center' }}>
             <AlertTriangle size={28} />
             <strong style={{ fontSize: '0.9rem' }}>गुमशुदा रिपोर्ट</strong>
           </button>
           <button 
             onClick={() => navigate('/knowledge')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #eab308', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.05)', color: '#ca8a04', cursor: 'pointer', textAlign: 'center' }}>
             <BookOpen size={28} />
             <strong style={{ fontSize: '0.9rem' }}>पशु ज्ञान</strong>
           </button>
           <button 
             onClick={() => navigate('/alerts')} 
             style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #9333ea', borderRadius: '12px', backgroundColor: 'rgba(147, 51, 234, 0.05)', color: '#9333ea', cursor: 'pointer', textAlign: 'center' }}>
             <Activity size={28} />
             <strong style={{ fontSize: '0.9rem' }}>महामारी अलर्ट</strong>
           </button>
        </div>

        {user?.role === 'admin' && (
          <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderColor: 'var(--primary-hover)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'white' }}>
              <TrendingUp size={20} /> PPP Revenue Split
            </h3>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'white' }}>₹{revenue.total.toLocaleString()}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Total Fine Collection</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Municipality (60%)</p>
                <strong>₹{revenue.municipality.toLocaleString()}</strong>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Private Firm (40%)</p>
                <strong>₹{revenue.pppFirm.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'admin' && seizedCows.length > 0 && (
          <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger-color)' }}>
              <Ban size={20} /> Seizure Orders (3rd Strike)
            </h3>
            {seizedCows.map((c, i) => (
              <div key={i} style={{ marginBottom: i !== seizedCows.length - 1 ? '1rem' : 0, paddingBottom: i !== seizedCows.length - 1 ? '1rem' : 0, borderBottom: i !== seizedCows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <strong>ID: {c.qrId}</strong> ({c.breed})
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>Owner: {c.ownerName}</p>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }} onClick={() => navigate(`/cow/${c.qrId}`)}>View Details</button>
              </div>
            ))}
          </div>
        )}

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/scan')}
          style={{ padding: '2rem', height: 'auto', fontSize: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0f172a' }}
        >
          <ScanLine size={48} />
          Scan RFID / QR Tag
        </button>
        
        {user?.role === 'admin' && (
           <p style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
             Scan an unregistered tag to start the Registration process.
           </p>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={20} color="var(--text-primary)" /> Global Ledger
          </h3>
          
          {complaints.length === 0 ? (
            <p className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              No recent patrol violations reported yet.
            </p>
          ) : (
            complaints.map((c, i) => (
              <div key={i} className="card" style={{ borderLeft: `4px solid ${c.status === 'pending_seizure' ? 'var(--danger-color)' : 'var(--primary-color)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong>Strike {c.strikeLevel} Violation</strong>
                  <span className="badge" style={{ backgroundColor: c.status === 'paid' ? 'var(--bg-color)' : 'rgba(239, 68, 68, 0.1)', color: c.status === 'paid' ? 'var(--text-secondary)' : 'var(--danger-color)' }}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>Cow ID: {c.cowQrId}</p>
                {c.fine > 0 && <p style={{ margin: '0', fontSize: '0.875rem', fontWeight: 600 }}>Fine: ₹{c.fine}</p>}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Loc: {c.location.lat.toFixed(4)}, {c.location.lng.toFixed(4)}
                  <br />Time: {new Date(c.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import { ScanLine, ShieldCheck, AlertCircle, TrendingUp, Ban, MapPin, AlertTriangle, Stethoscope, BookOpen, Activity, Ambulance, UserCircle, UserPlus, Users, Package, HeartHandshake } from 'lucide-react';
import ManagerDashboard from './ManagerDashboard';
import PatrolDashboard from './PatrolDashboard';
import TaggingDashboard from './TaggingDashboard';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, users, complaints, revenue, cows, missingReports, assignRole, warehouseInventory, allocateInventory } = useAppStore();
  const navigate = useNavigate();
  
  const seizedCows = cows.filter(c => c.seized);
  const myAnimals = cows.filter(c => c.phone === user?.phone);

  const [assignPhone, setAssignPhone] = React.useState('');
  const [assignName, setAssignName] = React.useState('');
  const [assignRoleType, setAssignRoleType] = React.useState('gaushala_manager');

  const [rfidAgent, setRfidAgent] = React.useState('');
  const [rfidAmount, setRfidAmount] = React.useState('');

  const handleAllocate = (e) => {
    e.preventDefault();
    if(rfidAgent && rfidAmount > 0) {
      allocateInventory(rfidAgent, rfidAmount);
      alert(`${rfidAmount} tags dispatched successfully!`);
      setRfidAmount('');
    }
  };

  const handleAssignRole = (e) => {
    e.preventDefault();
    if(assignPhone.length === 10 && assignName.trim()) {
      assignRole(assignPhone, assignName, assignRoleType);
      alert(`Role ${assignRoleType} assigned to ${assignName} (${assignPhone}) successfully!`);
      setAssignPhone('');
      setAssignName('');
    } else {
      alert('Please enter valid 10-digit phone and name.');
    }
  };

  if (user?.role === 'gaushala_manager') return <ManagerDashboard />;
  if (user?.role === 'patrol_squad') return <PatrolDashboard />;
  if (user?.role === 'tagging_agent') return <TaggingDashboard />;

  return (
    <>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/src/assets/pashu care.png" alt="Pashu Care" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <h1 style={{ margin: 0 }}>{t('app_title')}</h1>
        </div>
        {user?.role === 'admin' && <span className="badge" style={{ marginLeft: '0.5rem' }}>{t('admin_badge')}</span>}
      </div>
      
      <div className="content">
        <div 
          onClick={() => navigate('/profile')} 
          style={{ marginBottom: '1.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{user?.name || t('citizen')}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {user?.location || t('hq')}</p>
          </div>
          <UserCircle size={36} color="var(--primary-color)" />
        </div>

        {/* Quick Actions Navigation for Citizens */}
        {user?.role !== 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
             <button 
               onClick={() => navigate('/vets')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #3b82f6', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#2563eb', cursor: 'pointer', textAlign: 'center' }}>
               <Stethoscope size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('vet_doctor')}</strong>
             </button>
             <button 
               onClick={() => navigate('/ambulance')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #0d9488', borderRadius: '12px', backgroundColor: 'rgba(13, 148, 136, 0.05)', color: '#0d9488', cursor: 'pointer', textAlign: 'center' }}>
               <Ambulance size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('cow_ambulance')}</strong>
             </button>
             <button 
               onClick={() => navigate('/gaushalas')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--primary-color)', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: 'var(--primary-hover)', cursor: 'pointer', textAlign: 'center' }}>
               <MapPin size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('gaushalas')}</strong>
             </button>
             <button 
               onClick={() => navigate('/missing')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--danger-hover)', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger-hover)', cursor: 'pointer', textAlign: 'center' }}>
               <AlertTriangle size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('missing_report')}</strong>
             </button>
             <button 
               onClick={() => navigate('/knowledge')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #eab308', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.05)', color: '#ca8a04', cursor: 'pointer', textAlign: 'center' }}>
               <BookOpen size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('animal_knowledge')}</strong>
             </button>
             <button 
               onClick={() => navigate('/alerts')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #9333ea', borderRadius: '12px', backgroundColor: 'rgba(147, 51, 234, 0.05)', color: '#9333ea', cursor: 'pointer', textAlign: 'center' }}>
               <Activity size={28} />
               <strong style={{ fontSize: '0.9rem' }}>{t('disease_alerts')}</strong>
             </button>
             <button 
               onClick={() => navigate('/adoption')} 
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #f43f5e', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.05)', color: '#e11d48', cursor: 'pointer', textAlign: 'center', gridColumn: 'span 2' }}>
               <HeartHandshake size={28} />
               <strong style={{ fontSize: '0.9rem' }}>Adoption & Fostering</strong>
             </button>
          </div>
        )}



        {user?.role === 'admin' && seizedCows.length > 0 && (
          <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger-color)' }}>
              <Ban size={20} /> {t('seizure_orders')}
            </h3>
            {seizedCows.map((c, i) => (
              <div key={i} style={{ marginBottom: i !== seizedCows.length - 1 ? '1rem' : 0, paddingBottom: i !== seizedCows.length - 1 ? '1rem' : 0, borderBottom: i !== seizedCows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <strong>ID: {c.qrId}</strong> ({c.breed})
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{t('owner')}: {c.ownerName}</p>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }} onClick={() => navigate(`/cow/${c.qrId}`)}>{t('view_details')}</button>
              </div>
            ))}
          </div>
        )}

        {user?.role === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
             <div className="card" onClick={() => navigate('/admin/agents/tagging_agent')} style={{ cursor: 'pointer', padding: '1.5rem 1rem', textAlign: 'center', borderColor: '#3b82f6', backgroundColor: '#eff6ff', transition: 'transform 0.2s' }}>
               <h3 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#2563eb' }}>{users.filter(u => u.role === 'tagging_agent').length}</h3>
               <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e3a8a' }}>Tagging Agents</p>
               <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#3b82f6' }}>View All Agents &rarr;</p>
             </div>
             
             <div className="card" onClick={() => navigate('/admin/agents/patrol_squad')} style={{ cursor: 'pointer', padding: '1.5rem 1rem', textAlign: 'center', borderColor: 'var(--danger-hover)', backgroundColor: '#fef2f2', transition: 'transform 0.2s' }}>
               <h3 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: 'var(--danger-hover)' }}>{users.filter(u => u.role === 'patrol_squad').length}</h3>
               <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#7f1d1d' }}>Patrolling Squads</p>
               <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--danger-hover)' }}>View All Squads &rarr;</p>
             </div>
             
             <div className="card" onClick={() => navigate('/admin/agents/gaushala_manager')} style={{ cursor: 'pointer', padding: '1.5rem 1rem', textAlign: 'center', borderColor: 'var(--primary-color)', backgroundColor: '#ecfdf5', transition: 'transform 0.2s' }}>
               <h3 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: 'var(--primary-hover)' }}>{users.filter(u => u.role === 'gaushala_manager').length}</h3>
               <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#064e3b' }}>Gaushala Managers</p>
               <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--primary-color)' }}>View All Managers &rarr;</p>
             </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '2rem', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                <Package size={20} /> RFID Supply & Dispatch
              </span>
              <span className="badge" style={{ backgroundColor: '#64748b', color: 'white', fontSize: '0.8rem' }}>
                Govt Stock: {warehouseInventory?.toLocaleString() || 50000} Tags
              </span>
            </h3>
            <form onSubmit={handleAllocate}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#334155' }}>Select Tagging Agent</label>
                <select 
                  className="form-control" 
                  value={rfidAgent}
                  onChange={e => setRfidAgent(e.target.value)}
                  style={{ backgroundColor: 'white', borderColor: '#cbd5e1' }}
                  required
                >
                  <option value="">-- Choose Active Field Agent --</option>
                  {users.filter(u => u.role === 'tagging_agent').map(a => (
                    <option key={a.phone} value={a.phone}>{a.name} ({a.phone})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#334155' }}>Tag Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 50"
                  value={rfidAmount}
                  onChange={e => setRfidAmount(e.target.value)}
                  style={{ backgroundColor: 'white', borderColor: '#cbd5e1' }}
                  required
                  min="1"
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#475569', color: 'white', border: 'none' }}>Dispatch Tags</button>
            </form>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <UserPlus size={20} color="var(--primary-color)" /> Assign Specific Roles
            </h3>
            <form onSubmit={handleAssignRole}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="10-digit number"
                  value={assignPhone}
                  onChange={e => setAssignPhone(e.target.value.replace(/\D/g, '').substring(0,10))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Employee Name"
                  value={assignName}
                  onChange={e => setAssignName(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Select Role</label>
                <select 
                  className="form-control" 
                  value={assignRoleType}
                  onChange={e => setAssignRoleType(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-color)' }}
                >
                  <option value="gaushala_manager">Gaushala Manager</option>
                  <option value="patrol_squad">Patrolling Squad</option>
                  <option value="tagging_agent">QR Tagging Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Assign Role</button>
            </form>
          </div>
        )}

        {user?.role !== 'admin' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
               <img src="/src/assets/safe cow.png" alt="Cow" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
               My Animals
            </h3>
            {myAnimals.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {myAnimals.map((animal, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate(`/cow/${animal.qrId}`)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--primary-color)', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: 'var(--primary-hover)', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <img src="/src/assets/safe cow.png" alt="Cow" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    <strong style={{ fontSize: '0.9rem' }}>{animal.breed || animal.species}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {animal.qrId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No animals registered under this number.
              </div>
            )}
          </div>
        )}

        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/scan')}
          style={{ padding: '2rem', height: 'auto', fontSize: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0f172a' }}
        >
          <ScanLine size={48} />
          {t('scan_rfid')}
        </button>
        
        {user?.role === 'admin' && (
           <p style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
             {t('scan_desc')}
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

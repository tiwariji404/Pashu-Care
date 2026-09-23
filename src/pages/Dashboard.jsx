import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import { ScanLine, ShieldCheck, AlertCircle, TrendingUp, Ban, MapPin, AlertTriangle, Stethoscope, BookOpen, Activity, Ambulance, UserCircle, UserPlus, Users, Package, HeartHandshake, FileText, Map, ShieldAlert, FileSignature } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ManagerDashboard from './ManagerDashboard';
import PatrolDashboard from './PatrolDashboard';
import TaggingDashboard from './TaggingDashboard';
import EmergencySOS from '../components/EmergencySOS';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, users, complaints, revenue, cows, missingReports, assignRole, warehouseInventory, allocateInventory, tagRequests, approveTagRequest, diseaseAlerts } = useAppStore();
  const navigate = useNavigate();

  const seizedCows = cows.filter(c => c.seized);
  const myAnimals = cows.filter(c => c.phone === user?.phone && c.qrId !== '00');

  const myAnimalComplaints = complaints.filter(c => myAnimals.some(a => a.qrId === c.cowQrId) && (c.status === 'unpaid' || c.status === 'alert_sent' || c.status === 'pending_seizure'));

  const [assignPhone, setAssignPhone] = React.useState('');
  const [assignName, setAssignName] = React.useState('');
  const [assignRoleType, setAssignRoleType] = React.useState('gaushala_manager');

  const [rfidAgent, setRfidAgent] = React.useState('');
  const [rfidAmount, setRfidAmount] = React.useState('');

  const handleAllocate = (e) => {
    e.preventDefault();
    if (rfidAgent && rfidAmount > 0) {
      allocateInventory(rfidAgent, rfidAmount);
      alert(`${rfidAmount} tags dispatched successfully!`);
      setRfidAmount('');
    }
  };

  const handleAssignRole = (e) => {
    e.preventDefault();
    if (assignPhone.length === 10 && assignName.trim()) {
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

        {/* Owner Alert Banner */}
        {myAnimalComplaints.length > 0 && (
          <div className="card" style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderColor: 'var(--danger-hover)', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0', color: 'white' }}>
              <AlertTriangle size={24} /> {t('alert_urgent')}
            </h3>
            {myAnimalComplaints.map((c, i) => (
              <div key={i} style={{ marginBottom: i !== myAnimalComplaints.length - 1 ? '1rem' : 0, paddingBottom: i !== myAnimalComplaints.length - 1 ? '1rem' : 0, borderBottom: i !== myAnimalComplaints.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
                <strong style={{ color: 'white' }}>ID: {c.cowQrId}</strong> {t('alert_roaming')}
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>{t('alert_reason')}{c.reason || 'Wandering / Nuisance'}</p>
                <button className="btn btn-outline" style={{ marginTop: '0.75rem', borderColor: 'rgba(255,255,255,0.5)', color: 'white', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => navigate(`/cow/${c.cowQrId}`)}>{t('alert_view_details')}</button>
              </div>
            ))}
          </div>
        )}

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
              <FileText size={28} />
              <strong style={{ fontSize: '0.9rem' }}>{t('reports') || 'Reports'}</strong>
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
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #f43f5e', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.05)', color: '#e11d48', cursor: 'pointer', textAlign: 'center' }}>
              <HeartHandshake size={28} />
              <strong style={{ fontSize: '0.9rem' }}>{t('adoption_fostering')}</strong>
            </button>
            <button
              onClick={() => navigate('/my-animals')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid #10b981', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: '#059669', cursor: 'pointer', textAlign: 'center' }}>
              <Package size={28} />
              <strong style={{ fontSize: '0.9rem' }}>{t('my_animals')}</strong>
            </button>
          </div>
        )}

        {user?.role !== 'admin' && (
          <EmergencySOS />
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
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e3a8a' }}>{t('tagging_agents')}</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#3b82f6' }}>{t('view_all_agents')} &rarr;</p>
            </div>

            <div className="card" onClick={() => navigate('/admin/agents/patrol_squad')} style={{ cursor: 'pointer', padding: '1.5rem 1rem', textAlign: 'center', borderColor: 'var(--danger-hover)', backgroundColor: '#fef2f2', transition: 'transform 0.2s' }}>
              <h3 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: 'var(--danger-hover)' }}>{users.filter(u => u.role === 'patrol_squad').length}</h3>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#7f1d1d' }}>{t('patrolling_squads')}</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--danger-hover)' }}>{t('view_all_squads')} &rarr;</p>
            </div>

            <div className="card" onClick={() => navigate('/admin/agents/gaushala_manager')} style={{ cursor: 'pointer', padding: '1.5rem 1rem', textAlign: 'center', borderColor: 'var(--primary-color)', backgroundColor: '#ecfdf5', transition: 'transform 0.2s' }}>
              <h3 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: 'var(--primary-hover)' }}>{users.filter(u => u.role === 'gaushala_manager').length}</h3>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#064e3b' }}>{t('gaushala_managers')}</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--primary-color)' }}>{t('view_all_managers')} &rarr;</p>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => navigate('/admin/heatmap')}
              style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fdf4ff', border: '1px solid #d946ef', borderRadius: '8px', color: '#a21caf', cursor: 'pointer' }}
            >
              <Map size={32} />
              <strong style={{ fontSize: '0.9rem' }}>Heatmap Alerts</strong>
            </button>

            <button 
              onClick={() => navigate('/admin/escalations')}
              style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px', color: '#b91c1c', cursor: 'pointer' }}
            >
              <ShieldAlert size={32} />
              <strong style={{ fontSize: '0.9rem' }}>Gov Escalations</strong>
            </button>

            <button 
              onClick={() => navigate('/admin/audit')}
              style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}
            >
              <FileSignature size={32} />
              <strong style={{ fontSize: '0.9rem' }}>Audit Logs</strong>
            </button>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '2rem', borderColor: '#cbd5e1' }}>
            <h3 style={{ marginBottom: '1rem' }}>Staff Distribution</h3>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Tagging', count: users.filter(u => u.role === 'tagging_agent').length },
                  { name: 'Patrol', count: users.filter(u => u.role === 'patrol_squad').length },
                  { name: 'Manager', count: users.filter(u => u.role === 'gaushala_manager').length }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}


        {user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <UserPlus size={20} color="var(--primary-color)" /> {t('assign_roles')}
            </h3>
            <form onSubmit={handleAssignRole}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem' }}>{t('phone_number')}</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder={t('phone_number')}
                  value={assignPhone}
                  onChange={e => setAssignPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem' }}>{t('name')}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('emp_name_placeholder')}
                  value={assignName}
                  onChange={e => setAssignName(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>{t('select_role')}</label>
                <select
                  className="form-control"
                  value={assignRoleType}
                  onChange={e => setAssignRoleType(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-color)' }}
                >
                  <option value="gaushala_manager">{t('gaushala_manager')}</option>
                  <option value="patrol_squad">{t('patrolling_squads')}</option>
                  <option value="tagging_agent">{t('tagging_agents')}</option>
                  <option value="admin">{t('admin')}</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>{t('assign_role_btn')}</button>
            </form>
          </div>
        )}

        {user?.role !== 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/scan')}
            style={{ padding: '2rem', height: 'auto', fontSize: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0f172a' }}
          >
            <ScanLine size={48} />
            {t('scan_rfid')}
          </button>
        )}




      </div>
    </>
  );
}

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Users, Clock } from 'lucide-react';

export default function AgentList() {
  const { role } = useParams();
  const navigate = useNavigate();
  const users = useAppStore(state => state.users);

  const roleDetails = {
    tagging_agent: { title: 'Tagging Agents', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)' },
    patrol_squad: { title: 'Patrolling Squads', color: 'var(--danger-color)', bg: 'rgba(239, 68, 68, 0.05)' },
    gaushala_manager: { title: 'Gaushala Managers', color: 'var(--primary-color)', bg: 'rgba(16, 185, 129, 0.05)' }
  };

  const details = roleDetails[role] || { title: 'Agents', color: 'var(--text-primary)', bg: 'var(--surface-color)' };
  
  const agents = users.filter(u => u.role === role);

  return (
    <>
      <div className="header" style={{ borderBottom: `2px solid ${details.color}`, backgroundColor: details.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: details.color }} />
          <h1 style={{ margin: 0, color: details.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} /> {details.title}
          </h1>
        </div>
      </div>

      <div className="content">
        <p style={{ marginTop: '0', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Total Assigned: <strong>{agents.length}</strong>
        </p>

        <div className="responsive-grid">
          {agents.map(worker => {
            const inv = worker.inventory || { total: 0, remaining: 0, label: 'Task' };
            const used = inv.total - inv.remaining;
            const progressPercent = inv.total > 0 ? (used / inv.total) * 100 : 0;
            return (
              <div 
                key={worker.phone} 
                onClick={() => navigate('/worker/' + worker.phone)} 
                style={{ cursor: 'pointer', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: `1px solid ${details.color}`, borderLeft: `6px solid ${details.color}`, transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{worker.name}</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{worker.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{inv.label}: {used} / {inv.total} (शेष: {inv.remaining})</span>
                  <span><Clock size={14} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}/>{worker.activeHours || 0} / 24 hrs active</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: details.color }}></div>
                </div>
              </div>
            );
          })}
          
          {agents.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              No {details.title.toLowerCase()} are currently assigned to the system.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

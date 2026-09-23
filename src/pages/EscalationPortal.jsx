import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function EscalationPortal() {
  const navigate = useNavigate();
  const { complaints, injuredReports, missingReports, escalateIssue } = useAppStore();
  
  // Aggregate unresolved high priority items
  const pendingSmuggling = complaints.filter(c => c.reason?.toLowerCase().includes('smuggl') && !c.status.startsWith('escalated'));
  const pendingInjured = injuredReports.filter(c => !c.status.startsWith('escalated') && c.status === 'pending_rescue');
  const pendingMissing = missingReports.filter(c => c.status === 'missing' && !c.status.startsWith('escalated'));

  const pendingCount = pendingSmuggling.length + pendingInjured.length + pendingMissing.length;

  return (
    <>
      <div className="header" style={{ borderBottom: 'none', backgroundColor: '#fef2f2' }}>
        <h1 style={{ color: '#991b1b' }}>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{ cursor: 'pointer', marginRight: '0.5rem' }} color="#991b1b" />
          <ShieldAlert style={{ verticalAlign: 'middle' }} /> Inter-Departmental Escalation
        </h1>
      </div>
      
      <div className="content">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Forward critical issues (Animal Smuggling, Hit & Run, Extreme Cruelty) to external Gov departments like Local Police or Municipal Corp.
        </p>

        <h3 style={{ marginBottom: '1rem' }}>Pending Escalations ({pendingCount})</h3>

        {pendingCount === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>
             No pending critical issues.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Smuggling Issues */}
            {pendingSmuggling.map(issue => (
              <EscalationCard key={issue.id} issue={{...issue, title: 'Suspected Smuggling', desc: issue.reason}} onEscalate={escalateIssue} />
            ))}

            {/* Injured Issues */}
            {pendingInjured.map(issue => (
              <EscalationCard key={issue.id} issue={{...issue, title: 'Critically Injured', desc: issue.description}} onEscalate={escalateIssue} />
            ))}

            {/* Missing Issues */}
            {pendingMissing.map(issue => (
              <EscalationCard key={issue.id} issue={{...issue, title: 'Missing Animal', desc: issue.description}} onEscalate={escalateIssue} />
            ))}

          </div>
        )}
      </div>
    </>
  );
}

const EscalationCard = ({ issue, onEscalate }) => {
  const [clicked, setClicked] = useState(false);

  const forwardTo = (dept) => {
    setClicked(true);
    // Mock SMS/Email dispatch
    alert(`[SYSTEM] Sent SMS to ${dept} API regarding tracking ID: ${issue.id}`);
    onEscalate(issue.id, dept);
  };

  if (clicked) return null;

  return (
    <div className="card" style={{ borderLeft: '4px solid #b91c1c' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', color: '#7f1d1d' }}>{issue.title}</strong>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Loc: {issue.location} | ID: {issue.id}</span>
          </div>
       </div>
       <p style={{ fontSize: '0.9rem', margin: '0.75rem 0' }}>{issue.desc}</p>
       
       <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn btn-outline" style={{ flex: 1, borderColor: '#1e40af', color: '#1e40af', fontSize: '0.85rem' }} onClick={() => forwardTo('Police Dept')}>
            <Send size={14} style={{ verticalAlign: 'middle' }}/> Forward to Police
          </button>
          <button className="btn btn-outline" style={{ flex: 1, borderColor: '#047857', color: '#047857', fontSize: '0.85rem' }} onClick={() => forwardTo('Municipal Corp')}>
            <Send size={14} style={{ verticalAlign: 'middle' }}/> Forward to Municipal
          </button>
       </div>
    </div>
  );
};

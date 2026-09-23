import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSignature, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function AuditLogs() {
  const navigate = useNavigate();
  const { auditLogs, fetchAuditLogs } = useAppStore();

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{ cursor: 'pointer', marginRight: '0.5rem' }} color="var(--text-primary)" />
          <FileSignature style={{ verticalAlign: 'middle' }} color="var(--primary-color)" /> Security Audit Logs
        </h1>
      </div>
      
      <div className="content">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Permanent record of all major administrative actions (Role assignments, inventory distribution, issue escalations).
        </p>

        {auditLogs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No audit records found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>Admin / User</th>
                  <th style={{ padding: '1rem' }}>Action Code</th>
                  <th style={{ padding: '1rem' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{log.userPhone}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

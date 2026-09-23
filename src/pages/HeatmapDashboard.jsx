import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function HeatmapDashboard() {
  const navigate = useNavigate();
  const { diseaseAlerts, injuredReports } = useAppStore();

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{ cursor: 'pointer', marginRight: '0.5rem' }} color="var(--text-primary)" />
          Crime & Disease Heatmap
        </h1>
      </div>
      <div className="content">
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--danger-hover)', color: 'white', borderColor: 'var(--danger-color)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} /> Advanced AI Mapping
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
            Clusters of disease and recurring accident zones are mapped for preemptive action.
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* We emulate a heatmap using a wide Google Map. */}
          <iframe 
            style={{ border: 0, width: '100%', height: '500px', display: 'block' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=Garhwa,Jharkhand&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Active High-Priority Zones</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {diseaseAlerts.map(alert => (
            <div key={alert.id} className="card" style={{ borderLeft: '4px solid #9333ea' }}>
              <strong>{alert.location}</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>{alert.disease}</p>
            </div>
          ))}
          {injuredReports.map(report => (
            <div key={report.id} className="card" style={{ borderLeft: '4px solid #eab308' }}>
              <strong>{report.location}</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Accident / Escaped Animal: {report.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

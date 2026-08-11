import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, MapPin, PhoneCall } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function VetList() {
  const navigate = useNavigate();
  const { user, vets } = useAppStore();
  
  const userLocation = user?.location || '';
  const nearby = vets ? vets.filter(v => v.location.toLowerCase() === userLocation.toLowerCase()) : [];

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          Pashu Chikitsak (Vets)
        </h1>
      </div>
      <div className="content">
        <p>Showing doctors in: <strong>{userLocation || 'Location Not Set'}</strong></p>
        
        {nearby.length > 0 ? (
          nearby.map(vet => (
            <div key={vet.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{vet.name}</h3>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>
                    <Stethoscope size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {vet.specialization}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <MapPin size={16} /> {vet.clinic}
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <a href={`tel:${vet.phone}`} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', color: '#2563eb', borderColor: 'rgba(59, 130, 246, 0.3)', textDecoration: 'none' }}>
                  <PhoneCall size={18} /> Call {vet.phone}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No registered vets near your location right now.</p>
          </div>
        )}
      </div>
    </>
  );
}

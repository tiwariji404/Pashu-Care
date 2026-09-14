import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function GaushalaList() {
  const navigate = useNavigate();
  const { user, gaushalas } = useAppStore();
  
  const userLocation = user?.location || '';
  const nearby = gaushalas ? gaushalas.filter(g => g.location.toLowerCase() === userLocation.toLowerCase()) : [];

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          Nearby Gaushalas
        </h1>
      </div>
      <div className="content">
        <p>Location Filter: <strong>{userLocation || 'Not Set'}</strong></p>
        
        {nearby.length > 0 ? (
          <div className="responsive-grid">
            {nearby.map(g => (
              <div key={g.id} className="card" style={{ marginBottom: '1rem', borderTop: '4px solid var(--primary-color)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{g.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <MapPin size={16} /> {g.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <Phone size={16} /> <a href={`tel:${g.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>{g.phone}</a>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem' }}>Capacity: <strong>{g.capacity}</strong> Cows</div>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.8rem' }}>Donate / Adopt</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No gaushalas mapped near your location.</p>
          </div>
        )}
      </div>
    </>
  );
}

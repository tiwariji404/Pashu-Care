import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, PhoneCall, Ambulance } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function AmbulanceList() {
  const navigate = useNavigate();
  const { user, ambulances } = useAppStore();
  
  const userLocation = user?.location || '';
  const nearby = ambulances ? ambulances.filter(a => a.location.toLowerCase() === userLocation.toLowerCase()) : [];

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          पशु एम्बुलेंस (Transport)
        </h1>
      </div>
      <div className="content">
        <p>Showing transport services in: <strong>{userLocation || 'Location Not Set'}</strong></p>
        
        {nearby.length > 0 ? (
          nearby.map(vehicle => (
            <div key={vehicle.id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{vehicle.name}</h3>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#10b981', fontWeight: 500 }}>
                    <Truck size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {vehicle.vehicle}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <MapPin size={16} /> Base: {vehicle.location}
              </div>
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <a href={`tel:${vehicle.phone}`} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', textDecoration: 'none' }}>
                  <PhoneCall size={18} /> Call {vehicle.phone}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <Ambulance size={48} color="var(--primary-color)" style={{ margin: '0 auto', opacity: 0.5 }} />
            <p style={{ margin: '1rem 0 0 0', color: 'var(--text-secondary)' }}>No transport vehicles registered in your area yet.</p>
          </div>
        )}
      </div>
    </>
  );
}

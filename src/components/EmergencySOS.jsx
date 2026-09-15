import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AlertTriangle } from 'lucide-react';

export default function EmergencySOS() {
  const { user, addDiseaseAlert, reportInjuredAnimal } = useAppStore();
  const [sosType, setSosType] = useState('disease');
  const [sosDesc, setSosDesc] = useState('');

  const handleSosSubmit = (e) => {
    e.preventDefault();
    if (sosDesc.trim()) {
      if (sosType === 'disease') {
        addDiseaseAlert({
          disease: 'Emergency Medical SOS (Disease)',
          location: user?.location || 'Field',
          reportedBy: user?.name || 'Citizen',
          description: sosDesc
        });
        alert('Disease SOS Reported! It will appear in Disease Alerts.');
      } else {
        reportInjuredAnimal({
          location: user?.location || 'Field',
          reportedBy: user?.name || 'Citizen',
          reporterPhone: user?.phone || 'Unknown',
          description: sosDesc,
          status: 'pending_rescue'
        });
        alert('Injured Animal SOS Reported! Gaushala Managers have been notified.');
      }
      setSosDesc('');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertTriangle size={18} /> Emergency / Sick Animal SOS
      </h3>
      <form onSubmit={handleSosSubmit}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <select 
             className="form-control" 
             value={sosType} 
             onChange={(e) => setSosType(e.target.value)}
             style={{ flex: 1, backgroundColor: 'white', borderColor: '#fca5a5' }}
          >
             <option value="disease">Disease Outbreak (महामारी)</option>
             <option value="injured">Injured Animal (घायल पशु)</option>
          </select>
        </div>
        <textarea 
          className="form-control" 
          placeholder="Describe animal and condition..." 
          value={sosDesc}
          onChange={e => setSosDesc(e.target.value)}
          required
          rows="2"
          style={{ marginBottom: '0.5rem', backgroundColor: 'white', borderColor: '#fca5a5' }}
        />
        <button type="submit" className="btn" style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem' }}>
          Broadcast Emergency
        </button>
      </form>
    </div>
  );
}

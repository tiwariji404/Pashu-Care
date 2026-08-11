import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, AlertOctagon, X, Search } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function DiseaseAlerts() {
  const navigate = useNavigate();
  const { user, diseaseAlerts, addDiseaseAlert } = useAppStore();
  const [isReporting, setIsReporting] = useState(false);
  const [formData, setFormData] = useState({ disease: '', description: '' });

  const userLocation = user?.location || 'Garhwa';
  const localAlerts = diseaseAlerts.filter(a => a.location.toLowerCase() === userLocation.toLowerCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    addDiseaseAlert({
      disease: formData.disease,
      description: formData.description,
      location: userLocation,
      reportedBy: user?.name || 'Citizen'
    });
    setIsReporting(false);
    setFormData({ disease: '', description: '' });
  };

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          महामारी अलर्ट (Disease SOS)
        </h1>
      </div>
      <div className="content">
        {!isReporting ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0 }}>Location: <strong>{userLocation}</strong></p>
              <button className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '20px' }} onClick={() => setIsReporting(true)}>
                + Report Alert
              </button>
            </div>

            {localAlerts.length > 0 ? (
              localAlerts.map(alert => (
                <div key={alert.id} className="card" style={{ borderColor: 'var(--danger-hover)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <AlertOctagon size={24} color="var(--danger-color)" style={{ marginTop: '0.25rem' }} />
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--danger-hover)' }}>{alert.disease}</h3>
                      <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{alert.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>Reported By: {alert.reportedBy}</span>
                        <span>{alert.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Activity size={48} color="var(--primary-color)" style={{ margin: '0 auto', opacity: 0.5 }} />
                <p style={{ margin: '1rem 0 0 0', color: 'var(--text-secondary)' }}>आपके क्षेत्र में कोई महामारी अलर्ट नहीं है। (No active alerts)</p>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>Report Disease Outbreak</h2>
              <X size={20} onClick={() => setIsReporting(false)} style={{cursor:'pointer', color:'var(--text-secondary)'}} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Disease Name (बीमारी का नाम)</label>
                <input required type="text" className="form-control" placeholder="e.g. Lumpy Skin Disease" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Details / Symptoms (लक्षण)</label>
                <textarea required className="form-control" rows="3" placeholder="Describe the symptoms closely..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-danger">Broadcast Alert</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

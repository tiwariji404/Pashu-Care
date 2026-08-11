import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertTriangle, MapPin, Camera, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function MissingZone() {
  const navigate = useNavigate();
  const { user, missingReports, addMissingReport } = useAppStore();
  const [tab, setTab] = useState('all'); // 'all' or 'my'
  
  const [isReporting, setIsReporting] = useState(false);
  const [reportForm, setReportForm] = useState({ cowName: '', description: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const userLocation = user?.location || 'Garhwa';
  
  const areaReports = missingReports.filter(r => r.location.toLowerCase() === userLocation.toLowerCase());
  const myReports = missingReports.filter(r => r.reporterPhone === user?.phone);
  
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoPreview) {
      alert("Please upload a photo of the missing cow.");
      return;
    }
    
    addMissingReport({
      ownerName: user?.name || 'Citizen',
      location: userLocation,
      reporterPhone: user?.phone,
      photo: photoPreview,
      status: 'missing',
      description: reportForm.description
    });
    
    setIsReporting(false);
    setPhotoPreview(null);
    setReportForm({ cowName: '', description: '' });
    setTab('my');
  };

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          <AlertTriangle color="#ef4444" /> Missing Report
        </h1>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--surface-color)', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setTab('all')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'all' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'all' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'all' ? 600 : 400 }}
        >
          Area Reports
        </div>
        <div 
          onClick={() => setTab('my')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'my' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'my' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'my' ? 600 : 400 }}
        >
          My Reports
        </div>
      </div>

      <div className="content">
        {!isReporting ? (
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Location: <strong>{userLocation}</strong></p>
              <button className="btn btn-danger" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '20px' }} onClick={() => setIsReporting(true)}>
                <PlusCircle size={16} /> File Report
              </button>
            </div>
            
            {tab === 'all' && (
              <div>
                {areaReports.length > 0 ? areaReports.map(r => (
                  <ReportCard key={r.id} report={r} />
                )) : <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>No missing reports in your area.</p>}
              </div>
            )}
            
            {tab === 'my' && (
              <div>
                {myReports.length > 0 ? myReports.map(r => (
                  <ReportCard key={r.id} report={r} />
                )) : <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>You haven't filed any missing reports.</p>}
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>Report Missing Cattle</h2>
              <X size={20} onClick={() => setIsReporting(false)} style={{cursor:'pointer', color:'var(--text-secondary)'}} />
            </div>
            
            <form onSubmit={handleSubmit}>
               <div className="form-group">
                  <label>Upload Photo</label>
                  <label htmlFor="missing-camera" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', padding: '2rem 1rem', cursor: 'pointer', borderStyle: 'dashed' }}>
                    <Camera size={24} color="var(--text-secondary)" /> Tap to Select / Capture Photo
                  </label>
                  <input id="missing-camera" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoCapture} />
                  {photoPreview && (
                    <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', marginTop: '1rem', borderRadius: '8px' }} />
                  )}
               </div>
               <div className="form-group">
                 <label>Identification / Description (Optional)</label>
                 <textarea className="form-control" rows="3" placeholder="Any specific mark, breed, or color..." value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})}></textarea>
               </div>
               
               <button type="submit" className="btn btn-danger" style={{marginTop: '1rem'}}>
                 Publish Alert
               </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

const ReportCard = ({ report }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ position: 'relative' }}>
      <img src={report.photo} alt="Missing Cow" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
         <span className="badge" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}>MISSING</span>
      </div>
    </div>
    <div style={{ padding: '1rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Owner: {report.ownerName}</h3>
      {report.description && <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>"{report.description}"</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}><MapPin size={12} /> {report.location}</span>
        <a href={`tel:${report.reporterPhone}`} className="btn-outline" style={{ textDecoration: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex' }}>Contact Owner</a>
      </div>
    </div>
  </div>
);

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertTriangle, MapPin, Camera, X, AlertCircle, FileText } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from 'react-i18next';

export default function MissingZone() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, missingReports, addMissingReport, complaints } = useAppStore();
  const [tab, setTab] = useState('all'); // 'all' or 'my'
  
  const [isReporting, setIsReporting] = useState(false);
  const [reportForm, setReportForm] = useState({ cowName: '', description: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const userLocation = user?.location || 'Garhwa';
  
  const areaReports = missingReports.filter(r => r.location.toLowerCase() === userLocation.toLowerCase() && r.status === 'spotted');
  const missingAnimalReports = missingReports.filter(r => r.status === 'missing');
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
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} color="var(--text-primary)" /> 
          <FileText color="var(--primary-color)" /> {t('reports') || 'Reports'}
        </h1>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--surface-color)', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setTab('all')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'all' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'all' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'all' ? 600 : 400 }}
        >
          {t('area_reports') || 'Area Reports'}
        </div>
        <div 
          onClick={() => setTab('missing')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'missing' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'missing' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'missing' ? 600 : 400 }}
        >
          {t('missing') || 'Missing'}
        </div>
        <div 
          onClick={() => setTab('my')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'my' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'my' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'my' ? 600 : 400 }}
        >
          {t('my_reports') || 'My Reports'}
        </div>
      </div>

      <div className="content">
        {!isReporting ? (
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>{t('location') || 'Location'}: <strong>{userLocation}</strong></p>
              <button className="btn btn-danger" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '20px' }} onClick={() => setIsReporting(true)}>
                <PlusCircle size={16} /> {t('file_report') || 'File Report'}
              </button>
            </div>
            
            {tab === 'all' && (
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MapPin size={20} color="#eab308" /> {t('spotted_animals_area') || 'Spotted Animals in Area'}
                </h3>
                <div className="responsive-grid">
                  {areaReports.length > 0 ? areaReports.map(r => (
                    <ReportCard key={r.id} report={r} />
                  )) : <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>{t('no_spotted_reports') || 'No spotted animal reports in your area.'}</p>}
                </div>
              </div>
            )}

            {tab === 'missing' && (
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertCircle size={20} color="var(--danger-color)" /> {t('missing_animals') || 'Missing Animals'}
                </h3>
                <div className="responsive-grid">
                  {missingAnimalReports.length > 0 ? missingAnimalReports.map(r => (
                    <ReportCard key={r.id} report={r} />
                  )) : <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>{t('no_missing_reports') || 'No missing animal reports in your area.'}</p>}
                </div>
              </div>
            )}
            
            {tab === 'my' && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>{t('my_submitted_reports') || 'My Submitted Reports'}</h3>
                <div className="responsive-grid">
                  {myReports.length > 0 ? myReports.map(r => (
                    <ReportCard key={r.id} report={r} />
                  )) : <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>{t('no_submitted_reports') || 'You haven\'t submitted any reports.'}</p>}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ margin: 0, color: 'var(--danger-color)' }}>{t('report_missing_stray') || 'Report Missing / Stray Animal'}</h2>
              <X size={24} onClick={() => setIsReporting(false)} style={{cursor:'pointer'}} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('animal_description') || 'Animal Description (Color, Breed, Marks)'}</label>
                <textarea className="form-control" rows="3" required value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})}></textarea>
              </div>
              
              <div className="form-group">
                <label>{t('upload_photo') || 'Upload Photo'}</label>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius)', padding: '2rem', textAlign: 'center', position: 'relative' }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                  ) : (
                    <>
                      <Camera size={32} color="var(--text-secondary)" style={{ margin: '0 auto 0.5rem' }} />
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('take_photo') || 'Take Photo / Select from Gallery'}</p>
                    </>
                  )}
                  <input type="file" accept="image/*" capture="environment" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} onChange={handlePhotoCapture} />
                </div>
              </div>

              <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>{t('submit_report') || 'Submit Report'}</button>
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
      <img src={report.photo} alt="Missing/Found Cow" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
         <span className="badge" style={{ backgroundColor: report.status === 'spotted' ? 'var(--primary-color)' : 'var(--danger-color)', color: 'white' }}>
           {report.status === 'spotted' ? 'SPOTTED' : 'MISSING'}
         </span>
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

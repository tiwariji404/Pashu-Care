import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle, PhoneCall, CheckCircle, Ban, FileText, Camera, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function CowDetails() {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const getCowByQrId = useAppStore(state => state.getCowByQrId);
  const user = useAppStore(state => state.user);
  
  const reportComplaint = useAppStore(state => state.reportComplaint);
  const getComplaintsByQrId = useAppStore(state => state.getComplaintsByQrId);
  const payChallan = useAppStore(state => state.payChallan);
  const disputeChallan = useAppStore(state => state.disputeChallan);

  const cow = getCowByQrId(qrId);
  const complaints = getComplaintsByQrId(qrId);
  
  const [complaintStatus, setComplaintStatus] = useState('');
  const [isFilingComplaint, setIsFilingComplaint] = useState(false);
  const [reason, setReason] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  if (!cow) {
    return (
      <div className="content">
        <p>No records found for Tag: {qrId}</p>
        <button className="btn btn-outline" onClick={() => navigate('/scan')}>Go Back</button>
      </div>
    );
  }

  const submitComplaint = (e) => {
    e.preventDefault();
    if (!reason) {
      alert("Please provide a reason.");
      return;
    }

    setComplaintStatus('locating');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const complaintData = {
            cowQrId: qrId,
            location: { lat, lng },
            timestamp: new Date().toISOString(),
            reporterPhone: user?.phone,
            reason: reason,
            photo: photoPreview
          };

          reportComplaint(complaintData);
          setComplaintStatus('reported');
          setIsFilingComplaint(false);
          setReason('');
          setPhotoPreview(null);
          
          setTimeout(() => setComplaintStatus(''), 3000); // Clear success msg
        },
        (err) => {
          setComplaintStatus('');
          alert("Failed to get location. Provide GPS permissions to report.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setComplaintStatus('');
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} color="var(--text-primary)" />
          Cow Profile
        </h1>
        {cow.seized ? (
           <span className="badge" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}>SEIZED</span>
        ) : (
           <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>Verified</span>
        )}
      </div>

      <div className="content">
        {cow.seized && (
           <div className="card" style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderColor: 'var(--danger-hover)' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'white' }}>
               <Ban size={24} /> PERMANENT FORFEITURE
             </h3>
             <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
               This cow has hit 3 violations. Legal ownership rights have been terminated. The cattle is confiscated strictly under UP Gaushala Act, 1964 and moved to a Govt Gaushala.
             </p>
           </div>
        )}

        <div className="card" style={{ display: 'flex', gap: '1rem', opacity: cow.seized ? 0.6 : 1 }}>
          <img 
            src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80" 
            alt="Cow Profile" 
            style={{ width: '100px', height: '100px', borderRadius: 'var(--border-radius)', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{cow.breed} {cow.species}</h2>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Age: {cow.age} yrs | Health: {cow.health}</p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>UID: <strong>{qrId}</strong></p>
            <p style={{ margin: 0, fontSize: '0.875rem', marginTop: '0.25rem' }}>Strikes Logged: <strong>{cow.strikes}/3</strong></p>
          </div>
        </div>

        {!cow.seized && (
          <div className="card">
            <h2 className="card-title">Patrol Action</h2>
            {complaintStatus === 'reported' ? (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-hover)', borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 0.5rem auto' }} />
                <strong>Violation Sent to Pashu Vibhag</strong>
                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>E-Challan generated automatically.</p>
              </div>
            ) : isFilingComplaint ? (
              <form onSubmit={submitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>File Complaint Form</h3>
                  <X size={20} color="var(--text-secondary)" onClick={() => setIsFilingComplaint(false)} style={{ cursor: 'pointer' }} />
                </div>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Capture Evidence</label>
                  <label htmlFor="camera-upload" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}>
                    <Camera size={20} /> Take Photo
                  </label>
                  <input 
                    id="camera-upload" 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    style={{ display: 'none' }} 
                    onChange={handlePhotoCapture} 
                  />
                  {photoPreview && (
                    <img src={photoPreview} alt="Evidence Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '4px' }} />
                  )}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Reason for Complaint</label>
                  <textarea 
                    className="form-control" 
                    placeholder="e.g. Cow straying on highway, traffic block"
                    rows="3"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="btn btn-danger" 
                  disabled={complaintStatus === 'locating'}
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <AlertCircle size={20} />
                  {complaintStatus === 'locating' ? 'Submitting...' : 'Submit to Pashu Vibhag'}
                </button>
              </form>
            ) : (
              <button 
                className="btn btn-danger" 
                onClick={() => setIsFilingComplaint(true)}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                <AlertCircle size={20} />
                Report Stray / Violation
              </button>
            )}
          </div>
        )}

        {complaints.length > 0 && (
          <div className="card" style={{ borderColor: 'var(--danger-color)' }}>
             <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <FileText size={20} /> Digital E-Challans
             </h2>
             {complaints.map((c, i) => (
               <div key={i} style={{ borderBottom: i !== complaints.length -1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '1rem', marginBottom: '1rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ color: 'var(--danger-color)' }}>Strike {c.strikeLevel} Fine</strong>
                    <span className="badge" style={{ 
                      backgroundColor: c.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : c.status === 'disputed' ? '#fef3c7' : 'rgba(239, 68, 68, 0.1)', 
                      color: c.status === 'paid' ? 'var(--primary-hover)' : c.status === 'disputed' ? '#d97706' : 'var(--danger-hover)' 
                    }}>
                      {c.status.toUpperCase()}
                    </span>
                 </div>
                 {c.fine > 0 && <h3 style={{ margin: '0.25rem 0' }}>₹{c.fine}</h3>}
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                   {new Date(c.timestamp).toLocaleString()}
                 </p>
                 
                 {c.status === 'unpaid' && (
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <button className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => payChallan(c.id)}>Mock Pay via UPI</button>
                     <button className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => disputeChallan(c.id)}>Dispute to SDM</button>
                   </div>
                 )}
               </div>
             ))}
          </div>
        )}

        <div className="card" style={{ opacity: cow.seized ? 0.6 : 1 }}>
          <h2 className="card-title">Owner Details</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Name</span>
              <strong>{cow.ownerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aadhar</span>
              <strong>XXXX-XXXX-{cow.aadhar.substring(cow.aadhar.length - 4) || '1234'}</strong>
            </div>
            {!cow.seized && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Contact</span>
                <a href={`tel:${cow.phone}`} className="btn-outline" style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '4px', textDecoration: 'none', gap: '0.25rem', alignItems: 'center', fontSize: '0.875rem' }}>
                  <PhoneCall size={14} /> Call
                </a>
              </div>
            )}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Dairy Address</span>
              <p style={{ fontSize: '0.875rem', margin: 0, padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
                {cow.address}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

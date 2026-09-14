import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function AgentRegistration() {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const registerCow = useAppStore(state => state.registerCow);

  const [formData, setFormData] = useState({
    species: 'Cow',
    breed: '',
    age: '',
    health: 'Good',
    vaccination: '',
    ownerName: '',
    aadhar: '',
    phone: '',
    address: ''
  });

  const [location, setLocation] = useState(null);
  const [photosUploaded, setPhotosUploaded] = useState(0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => alert("Failed to get location. Provide browser permissions.")
      );
    }
  };

  const handlePhotoUpload = () => {
    if (photosUploaded < 4) {
      setPhotosUploaded(prev => prev + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please capture GPS location of the dairy.");
      return;
    }
    if (photosUploaded < 4) {
      alert("Please upload at least 4 photos of the animal.");
      return;
    }

    const cowData = {
      ...formData,
      qrId,
      location,
      photos: Array(photosUploaded).fill('mock_photo_url'),
      registeredAt: new Date().toISOString()
    };

    registerCow(cowData);
    navigate(`/cow/${qrId}`); // Navigate to Details page to confirm
  };

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} color="var(--text-primary)" />
          New Registration
        </h1>
      </div>

      <div className="content">
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Initializing New Tag Allocation</p>
            <h2 style={{ margin: '0.25rem 0 0 0', letterSpacing: '1px' }}>UID: <span style={{ color: 'var(--primary-color)' }}>{qrId}</span></h2>
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%' }}>
            <CheckCircle size={28} color="var(--primary-color)" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ borderTop: '4px solid var(--primary-color)' }}>
            <h2 className="card-title">Cattle Details</h2>
            <div className="form-group">
              <label>Species</label>
              <select name="species" className="form-control" onChange={handleInputChange} value={formData.species}>
                <option value="Cow">Cow</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Bull">Bull</option>
                <option value="Dog">Dog</option>
              </select>
            </div>
            <div className="form-group">
              <label>Breed</label>
              <input name="breed" required className="form-control" onChange={handleInputChange} placeholder="e.g., Sahiwal, Gir" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Age (Years)</label>
                <input name="age" type="number" required className="form-control" onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Health</label>
                <select name="health" className="form-control" onChange={handleInputChange} value={formData.health}>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Last Vaccination Date</label>
              <input name="vaccination" type="date" required className="form-control" onChange={handleInputChange} />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Photos (4 Required)</h2>
            <p style={{ fontSize: '0.8rem' }}>Front, Back, Left Profile, Right Profile</p>
            <div className="photo-grid">
              {[0,1,2,3].map(i => (
                <div 
                  key={i}
                  className="photo-upload" 
                  onClick={handlePhotoUpload}
                  style={i < photosUploaded ? { backgroundImage: 'url(https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80)', border: 'none', backgroundColor: '#e2e8f0'} : {}}
                >
                  {i >= photosUploaded && (
                    <>
                      <Camera size={24} />
                      <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Tap</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Owner Details</h2>
            <div className="form-group">
              <label>Owner Name</label>
              <input name="ownerName" required className="form-control" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input name="aadhar" type="text" maxLength={12} required className="form-control" onChange={handleInputChange} placeholder="12-digit Aadhar" />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input name="phone" type="tel" maxLength={10} required className="form-control" onChange={handleInputChange} placeholder="10-digit Mobile" />
            </div>
            <div className="form-group">
              <label>Dairy/Farm Address</label>
              <textarea name="address" required className="form-control" onChange={handleInputChange}></textarea>
            </div>
            
            <button 
              type="button" 
              className={`btn ${location ? 'btn-outline' : 'btn-primary'}`} 
              onClick={captureLocation}
            >
              {location ? <><CheckCircle size={18} color="var(--primary-color)" /> GPS Captured</> : <><MapPin size={18} /> Capture Dairy Geo-Fence (GPS)</>}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
            Link Tag & Complete Registration
          </button>
          <div style={{ height: '2rem' }}></div>
        </form>
      </div>
    </>
  );
}

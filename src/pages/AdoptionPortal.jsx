import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, PlusCircle, X, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from 'react-i18next';

export default function AdoptionPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, adoptions, addAdoptionListing, requestAdoption } = useAppStore();
  const [tab, setTab] = useState('available'); // 'available' or 'my_requests'
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ type: 'Cow', breed: '', age: '', health: 'Healthy', description: '' });
  
  const [showApplyModal, setShowApplyModal] = useState(null); // stores adoption ID
  const [applyForm, setApplyForm] = useState({ reason: '' });
  
  const availableListings = adoptions.filter(a => a.status === 'available');
  
  // Find requests made by current user
  const myRequests = adoptions.reduce((acc, curr) => {
    const userReq = curr.requests.find(r => r.phone === user?.phone);
    if (userReq) {
      acc.push({ ...curr, myRequestStatus: userReq.status });
    }
    return acc;
  }, []);

  // Find listings created by the current user
  const myListings = adoptions.filter(a => a.managerPhone === user?.phone);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.breed || !addForm.age) return;
    
    addAdoptionListing({
      ...addForm,
      photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80', // Dummy photo for now
      managerPhone: user?.phone,
      location: user?.location || 'HQ'
    });
    setShowAddForm(false);
    setAddForm({ type: 'Cow', breed: '', age: '', health: 'Healthy', description: '' });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (applyForm.reason.trim()) {
      requestAdoption(showApplyModal, {
        name: user?.name,
        phone: user?.phone,
        reason: applyForm.reason
      });
      setShowApplyModal(null);
      setApplyForm({ reason: '' });
      setTab('my_requests');
    }
  };

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} /> 
          <HeartHandshake color="var(--primary-color)" /> {t('adoption_fostering') || 'Adoption & Fostering'}
        </h1>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--surface-color)', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setTab('available')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'available' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'available' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'available' ? 600 : 400 }}
        >
          {t('available_animals') || 'Available Animals'}
        </div>
        <div 
          onClick={() => setTab('my_requests')}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'my_requests' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'my_requests' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'my_requests' ? 600 : 400 }}
        >
          {t('my_applications') || 'My Applications'}
        </div>
      </div>

      <div className="content">
        {tab === 'my_requests' && !showAddForm && (
          <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setShowAddForm(true)}>
            <PlusCircle size={20} /> {t('put_up_for_adoption') || 'Put Animal up for Adoption'}
          </button>
        )}

        {showAddForm && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>{t('add_animal_adoption') || 'Add Animal for Adoption'}</h2>
              <X size={20} onClick={() => setShowAddForm(false)} style={{cursor:'pointer', color:'var(--text-secondary)'}} />
            </div>
            
            <form onSubmit={handleAddSubmit}>
               <div className="form-group">
                 <label>{t('animal_type') || 'Animal Type'}</label>
                 <select className="form-control" value={addForm.type} onChange={e => setAddForm({...addForm, type: e.target.value})}>
                   <option>Cow</option>
                   <option>Calf</option>
                   <option>Ox / Bull</option>
                   <option>Dog (Stray)</option>
                   <option>Cat</option>
                 </select>
               </div>
               <div className="form-group">
                 <label>{t('breed') || 'Breed'}</label>
                 <input type="text" className="form-control" placeholder="e.g. Sahiwal, Desi" value={addForm.breed} onChange={e => setAddForm({...addForm, breed: e.target.value})} required />
               </div>
               <div className="form-group">
                 <label>{t('approx_age') || 'Approx Age (Years)'}</label>
                 <input type="number" className="form-control" placeholder="e.g. 2" value={addForm.age} onChange={e => setAddForm({...addForm, age: e.target.value})} required />
               </div>
               <div className="form-group">
                 <label>{t('description_notes') || 'Brief Description & Behavioral Notes'}</label>
                 <textarea className="form-control" rows="3" placeholder="Friendly, good for fostering..." value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} required></textarea>
               </div>
               <button type="submit" className="btn btn-primary" style={{marginTop: '0.5rem', width: '100%'}}>
                 {t('publish_listing') || 'Publish Listing'}
               </button>
            </form>
          </div>
        )}

        {tab === 'available' && !showAddForm && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {availableListings.length > 0 ? availableListings.map(animal => (
              <div key={animal.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={animal.photo} alt={animal.type} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{animal.breed} {animal.type}</h3>
                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-hover)' }}>{animal.health}</span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Age: {animal.age} yrs | Loc: {animal.location || 'Shelter'}</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>"{animal.description}"</p>
                  
                  {user?.role === 'user' ? (
                     <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setShowApplyModal(animal.id)}>
                       <HeartHandshake size={18} /> {t('apply_to_adopt') || 'Apply to Adopt / Foster'}
                     </button>
                  ) : (
                     <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{t('citizens_can_adopt') || 'Citizens can adopt this animal.'}</p>
                  )}
                </div>
              </div>
            )) : (
              <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>{t('no_animals_available') || 'No animals are currently available for adoption.'}</p>
            )}
          </div>
        )}

        {tab === 'my_requests' && !showAddForm && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            
            {/* My Requests to Adopt */}
            <div>
              <h3 style={{ marginBottom: '1rem' }}>{t('animals_i_want_to_adopt') || 'Animals I Want to Adopt'}</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myRequests.length > 0 ? myRequests.map(animal => (
                  <div key={animal.id} className="card" style={{ borderLeft: animal.myRequestStatus === 'pending' ? '4px solid #f59e0b' : '4px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{animal.breed} {animal.type}</h3>
                      <span className="badge" style={{ backgroundColor: animal.myRequestStatus === 'pending' ? '#fef3c7' : 'rgba(16, 185, 129, 0.1)', color: animal.myRequestStatus === 'pending' ? '#d97706' : 'var(--primary-hover)' }}>
                        {animal.myRequestStatus.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('application_sent_verification') || 'Application sent for verification.'}</p>
                    {animal.myRequestStatus === 'pending' && <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{t('wait_for_shelter_manager') || 'Wait for the Shelter Manager to call you on'} {user?.phone}.</p>}
                  </div>
                )) : (
                  <p style={{textAlign:'center', marginTop:'1rem', color:'var(--text-secondary)'}}>{t('no_adoption_requests') || 'You haven\'t made any adoption requests yet.'}</p>
                )}
              </div>
            </div>

            {/* My Adoption Listings */}
            <div>
              <h3 style={{ marginBottom: '1rem' }}>{t('animals_i_put_for_adoption') || 'Animals I Put Up for Adoption'}</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myListings.length > 0 ? myListings.map(animal => (
                  <div key={animal.id} className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{animal.breed} {animal.type}</h3>
                      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-hover)' }}>
                        {animal.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{animal.description}</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{t('will_be_contacted') || 'You will be contacted if someone applies.'}</p>
                  </div>
                )) : (
                  <p style={{textAlign:'center', marginTop:'1rem', color:'var(--text-secondary)'}}>{t('no_adoption_listings') || 'You haven\'t listed any animals for adoption.'}</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}>
              {t('submit_application') || 'Submit Application'}
              <X size={20} color="var(--text-secondary)" onClick={() => setShowApplyModal(null)} style={{cursor:'pointer'}} />
            </h3>
            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label>{t('why_adopt') || 'Why do you want to adopt/foster?'}</label>
                <textarea className="form-control" rows="4" placeholder="I have a large farm and can provide a loving home..." value={applyForm.reason} onChange={e => setApplyForm({reason: e.target.value})} required></textarea>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('adoption_agreement') || 'By applying, you agree to a background check and regular vet checkups.'}</p>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t('send_request') || 'Send Request'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

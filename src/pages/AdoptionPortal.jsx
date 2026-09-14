import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, PlusCircle, X, HandHeart, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function AdoptionPortal() {
  const navigate = useNavigate();
  const { user, adoptions, addAdoptionListing, requestAdoption } = useAppStore();
  const [tab, setTab] = useState('available'); // 'available' or 'my_applications'
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [postType, setPostType] = useState('give'); // 'give' or 'adopt'
  const [form, setForm] = useState({ animalType: 'Cow', breed: '', age: '', description: '', reason: '' });
  
  const [selectedApp, setSelectedApp] = useState(null); // application object
  const [activeChat, setActiveChat] = useState(null); // chat interaction modal
  const [chatMessage, setChatMessage] = useState('');

  // List of all listings (both giving and seeking)
  const availableListings = adoptions.filter(a => a.status === 'available');
  
  // List of listings created by the current user
  const myApplications = adoptions.filter(a => a.managerPhone === user?.phone);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    
    addAdoptionListing({
      postType,
      type: form.animalType,
      breed: form.breed,
      age: form.age,
      description: form.description,
      reason: form.reason,
      health: 'Healthy',
      photo: postType === 'give' ? 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&q=80' : null,
      managerPhone: user?.phone,
      managerName: user?.name || 'Citizen',
      location: user?.location || 'Garhwa'
    });
    
    setShowAddForm(false);
    setForm({ animalType: 'Cow', breed: '', age: '', description: '', reason: '' });
    setTab('my_applications');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      if (activeChat.isApplying) {
        // I am applying/sending first message to someone else's post
        requestAdoption(activeChat.appId, {
          name: user?.name,
          phone: user?.phone,
          reason: chatMessage
        });
        alert("Message sent to the owner!");
      } else {
        // I am replying to someone who responded to my post
        alert("Mock: Message sent to " + activeChat.contactName);
      }
      setActiveChat(null);
      setChatMessage('');
    }
  };

  return (
    <>
      <div className="header" style={{ borderBottom: 'none' }}>
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} color="var(--text-primary)" /> 
          <HeartHandshake color="var(--primary-color)" /> Adoption & Fostering
        </h1>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--surface-color)', padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => { setTab('available'); setSelectedApp(null); }}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'available' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'available' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'available' ? 600 : 400 }}
        >
          All Applications
        </div>
        <div 
          onClick={() => { setTab('my_applications'); setSelectedApp(null); }}
          style={{ flex: 1, padding: '1rem 0', textAlign: 'center', cursor: 'pointer', borderBottom: tab === 'my_applications' ? '2px solid var(--primary-color)' : '2px solid transparent', color: tab === 'my_applications' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: tab === 'my_applications' ? 600 : 400 }}
        >
          My Applications
        </div>
      </div>

      <div className="content">
        {/* Available Applications List */}
        {tab === 'available' && !selectedApp && (
          <div style={{ display: 'grid', gap: '1rem', paddingBottom: '5rem' }}>
            {availableListings.length > 0 ? availableListings.map(app => (
              <div key={app.id} className="card" onClick={() => setSelectedApp(app)} style={{ padding: 0, overflow: 'hidden', borderLeft: `4px solid ${app.postType === 'give' ? 'var(--primary-color)' : '#0ea5e9'}`, cursor: 'pointer' }}>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                      {app.postType === 'give' ? `${app.breed} ${app.type}` : `Looking to adopt a ${app.type}`}
                    </h3>
                    <span className="badge" style={{ backgroundColor: app.postType === 'give' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)', color: app.postType === 'give' ? 'var(--primary-hover)' : '#0284c7' }}>
                      {app.postType === 'give' ? 'FOR ADOPTION' : 'WANT TO ADOPT'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    By: {app.managerName} | Loc: {app.location}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tap to view details & contact</p>
                </div>
              </div>
            )) : (
              <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>No applications posted yet.</p>
            )}
          </div>
        )}

        {/* My Applications List */}
        {tab === 'my_applications' && !selectedApp && (
          <div style={{ display: 'grid', gap: '1rem', paddingBottom: '5rem' }}>
            {myApplications.length > 0 ? myApplications.map(app => (
              <div key={app.id} className="card" onClick={() => setSelectedApp(app)} style={{ borderLeft: '4px solid var(--primary-color)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    {app.postType === 'give' ? `${app.breed} ${app.type}` : `Looking for a ${app.type}`}
                  </h3>
                  <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    ACTIVE
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {app.postType === 'give' ? 'You are offering this animal.' : 'You want to adopt.'}
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                    {app.requests?.length || 0} Responses
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tap to view</span>
                </div>
              </div>
            )) : (
              <p style={{textAlign:'center', marginTop:'2rem', color:'var(--text-secondary)'}}>You haven't posted any applications yet.</p>
            )}
          </div>
        )}

        {/* Selected Application Details */}
        {selectedApp && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => setSelectedApp(null)}>
              <ArrowLeft size={20} color="var(--primary-color)" /> 
              <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Back to List</span>
            </div>
            
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {selectedApp.postType === 'give' && selectedApp.photo && (
                <img src={selectedApp.photo} alt={selectedApp.type} style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ padding: '1.5rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>
                  {selectedApp.postType === 'give' ? `${selectedApp.breed} ${selectedApp.type}` : `Looking to adopt a ${selectedApp.type}`}
                </h2>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Posted by: {selectedApp.managerName} ({selectedApp.location})
                </p>

                {selectedApp.postType === 'give' ? (
                  <>
                    <p><strong>Age:</strong> {selectedApp.age} years</p>
                    <p><strong>Health:</strong> {selectedApp.health}</p>
                    <p><strong>Description:</strong></p>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedApp.description}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Preferred Breed:</strong> {selectedApp.breed || 'Any'}</p>
                    <p><strong>Reason / Details:</strong></p>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{selectedApp.reason}</p>
                  </>
                )}

                {/* Show Chat Action if it's someone else's post */}
                {user?.phone !== selectedApp.managerPhone && (
                   <button 
                     className="btn btn-primary" 
                     style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} 
                     onClick={() => setActiveChat({ appId: selectedApp.id, contactName: selectedApp.managerName, isApplying: true })}
                   >
                     <MessageCircle size={20} /> Chat / Express Interest
                   </button>
                )}

                {/* Show Responses if it's my post */}
                {user?.phone === selectedApp.managerPhone && (
                  <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Responses ({selectedApp.requests?.length || 0})</h3>
                    {selectedApp.requests?.length > 0 ? (
                      selectedApp.requests.map((req, i) => (
                        <div key={i} className="card" style={{ marginBottom: '1rem', backgroundColor: 'var(--bg-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{req.name}</p>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{req.reason}"</p>
                            </div>
                            <button 
                              className="btn btn-outline" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
                              onClick={() => setActiveChat({ appId: selectedApp.id, contactName: req.name, isApplying: false })}
                            >
                              <MessageCircle size={14} /> Reply
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-secondary)' }}>No one has responded yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for New Application */}
      {!selectedApp && (
        <div 
          style={{ position: 'fixed', bottom: '2rem', right: '1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer', zIndex: 100 }}
          onClick={() => setShowAddForm(true)}
        >
          <PlusCircle size={32} />
        </div>
      )}

      {/* Add New Application Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg-color)', zIndex: 999, overflowY: 'auto' }}>
          <div className="header" style={{ position: 'sticky', top: 0, backgroundColor: 'var(--surface-color)', zIndex: 10 }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <X size={24} onClick={() => setShowAddForm(false)} style={{cursor:'pointer'}} /> Create Application
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                type="button"
                className={postType === 'give' ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ flex: 1 }}
                onClick={() => setPostType('give')}
              >
                Give for Adoption
              </button>
              <button 
                type="button"
                className={postType === 'adopt' ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ flex: 1 }}
                onClick={() => setPostType('adopt')}
              >
                Want to Adopt
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
               <div className="form-group">
                 <label>Preferred Animal Type</label>
                 <select className="form-control" value={form.animalType} onChange={e => setForm({...form, animalType: e.target.value})}>
                   <option>Cow</option>
                   <option>Calf</option>
                   <option>Ox / Bull</option>
                   <option>Dog (Stray)</option>
                   <option>Cat</option>
                 </select>
               </div>
               
               {postType === 'give' ? (
                 <>
                   <div className="form-group">
                     <label>Breed</label>
                     <input type="text" className="form-control" placeholder="e.g. Sahiwal, Desi" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} required />
                   </div>
                   <div className="form-group">
                     <label>Approx Age (Years)</label>
                     <input type="number" className="form-control" placeholder="e.g. 2" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
                   </div>
                   <div className="form-group">
                     <label>Behavioral Notes & Description</label>
                     <textarea className="form-control" rows="3" placeholder="Friendly, good for fostering..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="form-group">
                     <label>Preferred Breed (Optional)</label>
                     <input type="text" className="form-control" placeholder="e.g. Any, Sahiwal" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
                   </div>
                   <div className="form-group">
                     <label>Why do you want to adopt?</label>
                     <textarea className="form-control" rows="3" placeholder="I have a farm and can take good care..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required></textarea>
                   </div>
                 </>
               )}
               
               <button type="submit" className="btn btn-primary" style={{marginTop: '1rem', width: '100%'}}>
                 Submit Application
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat / Message Modal */}
      {activeChat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: 0, padding: 0, overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Chat with {activeChat.contactName}</h3>
              </div>
              <X size={20} onClick={() => setActiveChat(null)} style={{cursor:'pointer'}} />
            </div>
            
            <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', minHeight: '150px' }}>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This is the beginning of your conversation.</p>
            </div>
            
            <form onSubmit={handleSendMessage} style={{ padding: '1rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Type a message..." 
                value={chatMessage} 
                onChange={e => setChatMessage(e.target.value)} 
                required 
                style={{ flex: 1, marginBottom: 0 }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

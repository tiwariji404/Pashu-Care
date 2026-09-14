import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function MyAnimals() {
  const navigate = useNavigate();
  const { user, cows } = useAppStore();
  
  const myAnimals = cows.filter(c => c.phone === user?.phone && c.qrId !== '00');

  return (
    <>
      <div className="header">
        <h1>
          <ArrowLeft size={24} onClick={() => navigate('/')} style={{cursor:'pointer'}} color="var(--text-primary)" />
          My Animals
        </h1>
      </div>
      
      <div className="content">
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <img src="/src/assets/safe cow.png" alt="Cow" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
             My Registered Animals
          </h3>
          {myAnimals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {myAnimals.map((animal, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate(`/cow/${animal.qrId}`)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 0.5rem', border: '1px solid var(--primary-color)', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', color: 'var(--primary-hover)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <img src="/src/assets/safe cow.png" alt="Cow" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                  <strong style={{ fontSize: '1rem' }}>{animal.breed || animal.species}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {animal.qrId}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              No animals registered under your number yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

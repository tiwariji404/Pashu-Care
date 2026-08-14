import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Box, Edit2, Save, X } from 'lucide-react';

export default function WorkerInventory() {
  const { user, updateUserInventory } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Provide defaults in case inventory doesn't exist on older mock users
  const inventory = user?.inventory || { total: 0, remaining: 0, label: 'कार्य' };
  const [total, setTotal] = useState(inventory.total);
  const [remaining, setRemaining] = useState(inventory.remaining);

  const used = inventory.total - inventory.remaining;
  const progressPercent = inventory.total > 0 ? (used / inventory.total) * 100 : 0;

  const handleSave = () => {
    updateUserInventory(user.phone, Number(total), Number(remaining));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTotal(inventory.total);
    setRemaining(inventory.remaining);
    setIsEditing(false);
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--primary-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={20} /> मेरी कार्य प्रगति ({inventory.label})
        </h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
            <Edit2 size={18} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>कुल आवंटित (Total)</label>
            <input 
              type="number" 
              className="form-control" 
              value={total} 
              onChange={e => setTotal(e.target.value)} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>शेष (Remaining)</label>
            <input 
              type="number" 
              className="form-control" 
              value={remaining} 
              onChange={e => setRemaining(e.target.value)} 
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> सहेजें
            </button>
            <button onClick={handleCancel} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <X size={16} /> रद्द करें
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span>प्रगति: {used} / {inventory.total} उपयोग किया गया</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(progressPercent)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: 'var(--primary-color)' }}>{inventory.remaining}</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>शेष (Remaining)</p>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{inventory.total}</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>कुल (Total)</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

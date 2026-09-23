import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { RefreshCw } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // phone, otp
  
  const login = useAppStore(state => state.login);
  const checkUser = useAppStore(state => state.checkUser);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const success = login(phone, otp);
    if (success) {
      navigate('/');
    } else {
      alert('Invalid OTP. Use 1234 for demo.');
    }
  };

  return (
    <div className="login-split-container">
      {/* LEFT PANE */}
      <div className="login-left-pane">
        <svg className="login-watermark login-watermark-top" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M10 10 L50 90 L90 10 Z" stroke="#1B3B36" strokeWidth="2"/>
           <circle cx="50" cy="50" r="30" stroke="#1B3B36" strokeWidth="1"/>
        </svg>
        <svg className="login-watermark login-watermark-bottom" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
           <rect x="20" y="20" width="60" height="60" stroke="#1B3B36" strokeWidth="2" transform="rotate(45 50 50)"/>
           <line x1="0" y1="50" x2="100" y2="50" stroke="#1B3B36" strokeWidth="1"/>
        </svg>

        <img src="/src/assets/pashu care.png" alt="Pashu Care" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
        
        <h1 style={{ fontSize: '2rem', fontFamily: 'Palatino, Georgia, serif', color: '#1B3B36', marginTop: '1rem', marginBottom: '0.25rem' }}>
          Pashu Care
        </h1>
        <p style={{ color: '#1B3B36', fontSize: '1rem', fontWeight: 500, maxWidth: '85%' }}>
          Connecting Passionate Caretakers with Livestock Insights.
        </p>
        <p style={{ color: '#4A5D58', marginTop: '1.5rem', maxWidth: '420px', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Pashu Care is a community-driven initiative for animal stewardship. We provide the tools to simplify records, understand herd health, and make informed choices for a brighter, more sustainable future.
        </p>

        <div className="login-left-features">
          <div className="login-feature-item">
            <img src="/src/assets/satellite.png" alt="Satellite" />
            <p style={{ fontSize: '0.9rem', color: '#1B3B36', fontWeight: 500 }}>
              Precision Insights: Harnessing modern data for a thriving herd.
            </p>
          </div>
          <div className="login-feature-item">
            <img src="/src/assets/cow_card.png" alt="Digital ID" />
            <p style={{ fontSize: '0.9rem', color: '#1B3B36', fontWeight: 500 }}>
              Digital Identity: Secure, individual profiles for holistic animal care.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="login-right-pane">
        <h1 style={{ fontSize: '2rem', fontFamily: 'Palatino, Georgia, serif', color: '#1B3B36', position: 'absolute', top: '5%' }}>
          Pashu Care
        </h1>
        
        <div className="login-card">
          <h2>🇮🇳 User Login 🇮🇳</h2>
          
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Mobile number</label>
                <div className="input-with-flag">
                  <div className="flag-box">🇮🇳</div>
                  <input 
                    type="tel" 
                    placeholder="Mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0,10))}
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Captcha</label>
                <div className="captcha-box">
                  <span>Captcha</span>
                  <RefreshCw size={18} style={{ cursor: 'pointer' }} />
                </div>
              </div>

              <div className="demo-otp-box">
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Demo Access:</div>
                <strong style={{ fontSize: '1.1rem', color: '#1B3B36' }}>Admin: 9999999999</strong><br/>
                <span style={{ fontSize: '1rem', color: '#1B3B36' }}>Manager: 1111111111</span><br/>
                <span style={{ fontSize: '1rem', color: '#1B3B36' }}>Agent: 3333333333</span>
              </div>

              <button type="submit" className="btn" style={{ backgroundColor: '#1B3B36', color: 'white', padding: '1rem', fontSize: '1.1rem' }}>
                Login
              </button>
            </form>
          ) : (
             <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Enter OTP</label>
                <div className="input-with-flag">
                  <div className="flag-box">💬</div>
                  <input 
                    type="number" 
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value.substring(0,4))}
                    autoFocus
                  />
                </div>
              </div>

              <div className="demo-otp-box">
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Demo Access (OTP: 1234)</div>
                <strong style={{ fontSize: '1.3rem', color: '#1B3B36' }}>OTP : 1234</strong>
              </div>

              <button type="submit" className="btn" style={{ backgroundColor: '#1B3B36', color: 'white', padding: '1rem', fontSize: '1.1rem' }}>
                Verify & Login
              </button>
              
              <p style={{ textAlign: 'center', marginTop: '1.5rem', cursor: 'pointer', color: '#666', textDecoration: 'underline' }} onClick={() => setStep('phone')}>
                Try different number
              </p>
            </form>
          )}
        </div>

        <div className="login-footer">
          <p>About | Privacy Policy | Terms of Use | Contact<br/>
          <strong>Email:</strong> community@pashucare.personal<br/>
          Support: 1800-XXX-XXXX</p>
          <p style={{ marginTop: '1rem' }}>
            © [Current Year] Pashu Care Community. All rights reserved.<br/>
            (A Personal Project for Passionate Caretakers)
          </p>
        </div>

      </div>
    </div>
  );
}

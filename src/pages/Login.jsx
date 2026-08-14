import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'register_details', 'otp', 'otp_register'
  const [error, setError] = useState('');
  
  const login = useAppStore(state => state.login);
  const checkUser = useAppStore(state => state.checkUser);
  const registerAndLogin = useAppStore(state => state.registerAndLogin);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setError('');
      if (checkUser(phone)) {
        setStep('otp');
      } else {
        setStep('register_details');
      }
    } else {
      setError('Please enter a valid 10-digit number');
    }
  };

  const handleRegisterDetails = (e) => {
    e.preventDefault();
    if (name.trim() && location.trim()) {
      setStep('otp_register');
    } else {
      setError('Please fill all details');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    let success = false;
    if (step === 'otp') {
      success = login(phone, otp);
    } else if (step === 'otp_register') {
      success = registerAndLogin(phone, name, location, otp);
    }
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid OTP. Use 1234 for demo.');
    }
  };

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/src/assets/safe cow.png" alt="Safe Cow Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto' }} />
        <h1 style={{ marginTop: '0.5rem', color: 'var(--primary-color)' }}>Safe Cow</h1>
        <p>Digital Patrol & Registration System</p>
      </div>

      <div className="card">
        <h2 className="card-title">
          {step === 'phone' ? 'Login to Portal' : step === 'register_details' ? 'Create Account' : 'Enter OTP'}
        </h2>
        
        {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{error}</p>}

        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder="10-digit number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0,10))}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '-10px', marginBottom: '5px' }}>
              <strong>Demo Logins (OTP: 1234):</strong><br/>
              Admin: 9999999999<br/>
              Manager: 1111111111<br/>
              Patrol: 2222222222<br/>
              Agent: 3333333333
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Continue <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 'register_details' && (
          <form onSubmit={handleRegisterDetails}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Garhwa"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-10px' }}>This helps find nearby Gaushalas.</p>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Send OTP <ArrowRight size={18} />
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ marginTop: '0.75rem' }}
              onClick={() => setStep('phone')}
            >
              Back
            </button>
          </form>
        )}

        {(step === 'otp' || step === 'otp_register') && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>OTP Sent to {phone}</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Enter 1234"
                value={otp}
                onChange={e => setOtp(e.target.value.substring(0,4))}
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Verify & Login
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ marginTop: '0.75rem' }}
              onClick={() => setStep('phone')}
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

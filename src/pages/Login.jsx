import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
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
          <img src="/src/assets/pashu care.png" alt="Pashu Care Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto' }} />
          <h1 style={{ marginTop: '0.5rem', color: 'var(--primary-color)' }}>{t('app_title')}</h1>
          <p>{t('digital_patrol_sys')}</p>
        </div>
  
        <div className="card">
          <h2 className="card-title">
            {step === 'phone' ? t('login_portal') : step === 'register_details' ? t('create_account') : t('enter_otp')}
          </h2>
        
        {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{error}</p>}

        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
                <label>{t('mobile_number')}</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="10-digit number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').substring(0,10))}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '-10px', marginBottom: '5px' }}>
                <strong>{t('demo_logins')} (OTP: 1234):</strong><br/>
                Admin: 9999999999<br/>
                Manager: 1111111111<br/>
                Patrol: 2222222222<br/>
                Agent: 3333333333
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {t('continue')} <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 'register_details' && (
          <form onSubmit={handleRegisterDetails}>
            <div className="form-group">
              <label>{t('full_name')}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={t('enter_name')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('location_label')}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={t('eg_garhwa')}
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-10px' }}>{t('helps_find_nearby')}</p>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {t('send_otp')} <ArrowRight size={18} />
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ marginTop: '0.75rem' }}
              onClick={() => setStep('phone')}
            >
              {t('back')}
            </button>
          </form>
        )}

        {(step === 'otp' || step === 'otp_register') && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>{t('otp_sent_to')}{phone}</label>
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
              {t('verify_login')}
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ marginTop: '0.75rem' }}
              onClick={() => setStep('phone')}
            >
              {t('change_number')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

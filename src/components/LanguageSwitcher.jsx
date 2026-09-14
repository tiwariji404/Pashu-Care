import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface-color)', padding: '0.5rem', borderRadius: 'var(--border-radius)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <button 
        onClick={() => changeLanguage('en')}
        className="btn"
        style={{ 
          padding: '0.25rem 0.75rem', 
          backgroundColor: i18n.language === 'en' ? 'var(--primary-color)' : 'transparent',
          color: i18n.language === 'en' ? 'white' : 'var(--text-primary)',
          borderColor: i18n.language === 'en' ? 'var(--primary-color)' : 'var(--border-color)',
          fontSize: '0.875rem'
        }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('hi')}
        className="btn"
        style={{ 
          padding: '0.25rem 0.75rem', 
          backgroundColor: i18n.language === 'hi' ? 'var(--primary-color)' : 'transparent',
          color: i18n.language === 'hi' ? 'white' : 'var(--text-primary)',
          borderColor: i18n.language === 'hi' ? 'var(--primary-color)' : 'var(--border-color)',
          fontSize: '0.875rem'
        }}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageSwitcher;

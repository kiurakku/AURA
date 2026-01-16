import React from 'react';
import { t, languages, setLanguage, getLanguage } from '../utils/i18n';
import './LanguageSelector.css';

function LanguageSelector({ onLanguageChange }) {
  const currentLang = getLanguage();

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    // Reload page to apply translations
    window.location.reload();
  };

  return (
    <div className="language-selector">
      <label className="setting-label">
        <span className="setting-name">{t('profile.language')}</span>
        <span className="setting-desc">{languages.find(l => l.code === currentLang)?.name}</span>
      </label>
      <div className="language-grid">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-option ${currentLang === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;

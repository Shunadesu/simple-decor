import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest = () => {
  const { t, i18n } = useTranslation();

  const testKeys = [
    'nav.home',
    'footer.newsletter.title',
    'about.title',
    'quote.title'
  ];

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg max-w-sm z-[10000]">
      <h3 className="font-bold mb-2">🔍 Translation Debug</h3>
      <p className="text-sm mb-2">Current Lang: {i18n.language}</p>
      <div className="text-xs">
        {testKeys.map(key => (
          <div key={key} className="mb-1">
            <strong>{key}:</strong> {t(key)}
          </div>
        ))}
      </div>
      <button 
        onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')}
        className="mt-2 px-2 py-1 bg-white text-red-500 rounded text-xs"
      >
        Switch Lang
      </button>
    </div>
  );
};

export default TranslationTest;

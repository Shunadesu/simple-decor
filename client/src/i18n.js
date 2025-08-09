import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Pure HTTP backend config - no inline resources
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // React config
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace config
    ns: ['translation'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false,
    },
    
    // Backend config for loading translation files
    backend: {
      loadPath: '/locales/{{lng}}.json',
      crossDomain: true,
      withCredentials: false,
      requestOptions: {
        cache: 'no-cache',
        mode: 'cors',
        credentials: 'omit'
      }
    },

    detection: {
      // Language detection order
      order: [
        'localStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain'
      ],
      
      // Cache user language
      caches: ['localStorage'],
      
      // Language detection settings
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true
    }
  });

export default i18n;
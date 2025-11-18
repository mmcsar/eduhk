import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import sw from './locales/sw.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    sw: { translation: sw },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

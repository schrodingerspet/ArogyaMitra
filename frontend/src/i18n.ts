import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// We can add more languages, keeping it minimal for DoD
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome",
      "Dashboard": "Dashboard",
      "Appointments": "Appointments",
      "Health Tracking": "Health Tracking",
      "Records": "Records",
      "Services": "Services",
      "Profile": "Profile"
    }
  },
  hi: {
    translation: {
      "Welcome": "स्वागत हे",
      "Dashboard": "डैशबोर्ड",
      "Appointments": "नियुक्तियों",
      "Health Tracking": "स्वास्थ्य ट्रैकिंग",
      "Records": "अभिलेख",
      "Services": "सेवाएं",
      "Profile": "प्रोफ़ाइल"
    }
  },
  te: {
    translation: {
      "Welcome": "స్వాగతం",
      "Dashboard": "డాష్‌బోర్డ్",
      "Appointments": "అపాయింట్‌మెంట్‌లు",
      "Health Tracking": "ఆరోగ్య ట్రాకింగ్",
      "Records": "రికార్డులు",
      "Services": "సేవలు",
      "Profile": "ప్రొఫైల్"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

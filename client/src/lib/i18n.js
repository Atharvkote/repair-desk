import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from '../locales/en/common.json'
import mrCommon from '../locales/mr/common.json'
import enSidebar from '../locales/en/sidebar.json'
import mrSidebar from '../locales/mr/sidebar.json'
import enAdmin from '../locales/en/admin.json'
import mrAdmin from '../locales/mr/admin.json'
import enPages from '../locales/en/pages.json'
import mrPages from '../locales/mr/pages.json'

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = () => {
  const saved = localStorage.getItem('preferredLanguage')
  if (saved === 'mr' || saved === 'en') {
    return saved
  }
  return 'en' // Default to English
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        sidebar: enSidebar,
        admin: enAdmin,
        pages: enPages,
      },
      mr: {
        common: mrCommon,
        sidebar: mrSidebar,
        admin: mrAdmin,
        pages: mrPages,
      },
    },
    lng: getSavedLanguage(), // Default language
    fallbackLng: 'en', // Fallback to English if translation is missing
    defaultNS: 'common',
    ns: ['common', 'sidebar', 'admin', 'pages'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better performance
    },
    // Enable namespace prefix support
    nsSeparator: ':',
    keySeparator: '.',
  })

export default i18n


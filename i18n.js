import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
import { en, es } from './locales'

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
}

const i18n = i18next.createInstance()

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    resources,
    // detection: {
    //   caches: ['localStorage'],
    //   order: ['cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    //   lookupCookie: 'hylo-i18n-lng',
    //   lookupLocalStorage: 'hylo-i18n-lng',
    //   lookupSessionStorage: 'hylo-i18n-lng'
    // },
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    supportedLngs: ['en', 'es'],
    pathMatcher: './locales/{locale}.json',
    nonExplicitSupportedLngs: true,
    // keySeparator: false,
    nsSeparator: false,
    defaultNS: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n

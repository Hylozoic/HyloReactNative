import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ReactNativeLanguageDetector } from 'react-native-localization-settings';
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
  .use(initReactI18next)
  .use(ReactNativeLanguageDetector)
  .init({
    debug: true,
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    // i18next doesn't seem to be handling the interpolation of plurals correctly with react native
    // https://github.com/i18next/i18next/issues/1671
    // https://github.com/i18next/react-i18next/issues/1495
    // Reliant on the v3 fallback here, which uses a different plural-key syntax
    supportedLngs: ['en', 'es'],
    pathMatcher: './locales/{locale}.json',
    nonExplicitSupportedLngs: true,
    nsSeparator: false,
    defaultNS: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n

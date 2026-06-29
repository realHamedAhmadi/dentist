import i18next, { type i18n as I18nInstance } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getDefaultLanguage, getSupportedLanguages } from '@/core/i18n/language'
import HttpBackend from "i18next-http-backend";

/**
 * Creates a UI-agnostic i18next instance with multilingual defaults.
 */
export async function createI18n(): Promise<I18nInstance> {
    const i18n = i18next.createInstance()

    // Register browser language detector plugin
    i18n.use(LanguageDetector)

    await i18n.init({
        // Pass values, not function references
        lng: getDefaultLanguage(),
        fallbackLng: 'en',
        supportedLngs: getSupportedLanguages(),

        // Plugins inject bundles dynamically
        resources: {},

        // Keep keys like "common.save"
        keySeparator: '.',
        nsSeparator: ':',

        interpolation: {
            escapeValue: false,
        },

        returnNull: false,
        returnEmptyString: false,
        load: 'languageOnly',
        debug: false,
    })

    return i18n
}

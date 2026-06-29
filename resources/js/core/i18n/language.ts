import {Direction, ILanguage} from "@/core/i18n/types";
/**
 * All supported languages.
 */
export const LANGUAGES: ILanguage[] = [
    {
        lang: 'en',
        dir: 'ltr',
        label: 'English',
        locale: 'en-US',
    },
    {
        lang: 'fa',
        dir: 'rtl',
        label: 'فارسی',
        locale: 'fa-IR',
        isDefault: true,
    },
    {
        lang: 'ar',
        dir: 'rtl',
        label: 'العربية',
        locale: 'ar-SA',
    },
]

/**
 * Returns default language from config.
 */
export function getDefaultLanguage(): string {
    const found = LANGUAGES.find((x) => x.isDefault)
    return found?.lang ?? 'en'
}

/**
 * Returns i18next supported languages.
 */
export function getSupportedLanguages(): string[] {
    return LANGUAGES.map((x) => x.lang)
}

/**
 * Returns direction for a language.
 */
export function getLanguageDirection(lang: string): Direction {
    const found = LANGUAGES.find((x) => x.lang === lang)
    return found?.dir ?? 'ltr'
}

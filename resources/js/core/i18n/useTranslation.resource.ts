import { I18nService } from '@/core/i18n/I18nService'
import type { UseTranslationOptions } from '@/core/i18n/types'
import type { TranslationResolvedValue, UseTranslationResult } from '@/core/i18n/useTranslation.types'
import {
    buildCacheKey,
    buildServiceOptions,
    getCurrentLanguageRecord,
    getTranslationRecord,
    resolveOptionLanguage,
    setCurrentLanguageRecord,
    setTranslationRecord,
} from '@/core/i18n/useTranslation.cache'
import { loadCurrentLanguage } from '@/core/i18n/useTranslation.bridge'
import {getApp} from "@/core/platform/application/appInstance";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

/**
 * Read current language with Suspense semantics.
 */
export function readCurrentLanguage(options?: UseTranslationOptions): string {
    const explicitLanguage = resolveOptionLanguage(options)
    if (explicitLanguage) {
        return explicitLanguage
    }

    const record = getCurrentLanguageRecord()
    if (record) {
        if (record.status === 'resolved') {
            return record.value
        }

        if (record.status === 'rejected') {
            throw record.error
        }

        throw record.promise
    }

    const promise = loadCurrentLanguage()
        .then((lang) => {
            setCurrentLanguageRecord({
                status: 'resolved',
                value: lang,
            })
        })
        .catch((error: unknown) => {
            setCurrentLanguageRecord({
                status: 'rejected',
                error: error instanceof Error
                    ? error
                    : new Error('Failed to resolve current language'),
            })
        })

    setCurrentLanguageRecord({
        status: 'pending',
        promise,
    })

    throw promise
}

/**
 * Load translation through the application I18n service.
 */
async function loadTranslation(
    signature: string,
    lang: string,
    options?: UseTranslationOptions,
): Promise<TranslationResolvedValue> {
    const app = getApp()
    if (!app) {
        throw new Error('Application container is not available')
    }

    const i18n = await app.make(ServiceTokens.I18N_SERVICE)
    const result = await i18n.useTranslation(signature, buildServiceOptions(lang, options))

    return { t: result.t }
}

/**
 * Read translation synchronously with Suspense semantics.
 */
export function readTranslationResource(
    signature: string,
    lang: string,
    options?: UseTranslationOptions,
): UseTranslationResult {
    const cacheKey = buildCacheKey(signature, lang, options)
    const existingRecord = getTranslationRecord(cacheKey)

    if (existingRecord) {
        if (existingRecord.status === 'resolved') {
            return {
                t: existingRecord.value.t,
                ready: true,
                error: null,
            }
        }

        if (existingRecord.status === 'rejected') {
            throw existingRecord.error
        }

        throw existingRecord.promise
    }

    const promise = loadTranslation(signature, lang, options)
        .then((value) => {
            setTranslationRecord(cacheKey, {
                status: 'resolved',
                value,
            })
        })
        .catch((error: unknown) => {
            setTranslationRecord(cacheKey, {
                status: 'rejected',
                error: error instanceof Error
                    ? error
                    : new Error('Failed to load translation resource'),
            })
        })

    setTranslationRecord(cacheKey, {
        status: 'pending',
        promise,
    })

    throw promise
}

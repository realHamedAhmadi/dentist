import type { UseTranslationOptions } from '@/core/i18n/types'
import type { LanguageRecord, TranslationRecord } from '@/core/i18n/useTranslation.types'

const translationResourceCache = new Map<string, TranslationRecord>()
const languageStoreListeners = new Set<() => void>()

let currentLanguageRecord: LanguageRecord | null = null
let languageStoreVersion = 0
let languageBridgeBound = false
let languageBridgeBindingPromise: Promise<void> | null = null

/**
 * Build a stable cache key per translation signature and language.
 */
export function buildCacheKey(signature: string, lang: string, options?: UseTranslationOptions): string {
    const normalized = options as (UseTranslationOptions & { lng?: string }) | undefined
    return `${signature}::${lang}::${normalized?.keyPrefix ?? ''}`
}

/**
 * Resolve language from hook options.
 */
export function resolveOptionLanguage(options?: UseTranslationOptions): string | undefined {
    const normalized = options as (UseTranslationOptions & { lng?: string }) | undefined
    return normalized?.lng ?? normalized?.lang
}

/**
 * Build normalized service options with explicit language.
 */
export function buildServiceOptions(lang: string, options?: UseTranslationOptions): UseTranslationOptions {
    const normalized = options as (UseTranslationOptions & { lng?: string }) | undefined

    return {
        ...normalized,
        lang,
    }
}

/**
 * Notify all React subscribers about a language store update.
 */
function notifyLanguageStoreListeners(): void {
    // Notify every active subscriber
    for (const listener of languageStoreListeners) {
        listener()
    }
}

/**
 * Advance language store version and notify subscribers.
 */
export function bumpLanguageStoreVersion(): void {
    languageStoreVersion += 1
    notifyLanguageStoreListeners()
}

/**
 * Clear all cached translation resources.
 */
export function clearTranslationResourceCache(): void {
    translationResourceCache.clear()
}

/**
 * Invalidate one cached translation resource.
 */
export function invalidateTranslationResource(
    signature: string,
    lang: string,
    options?: UseTranslationOptions,
): void {
    translationResourceCache.delete(buildCacheKey(signature, lang, options))
}

/**
 * Get translation record by cache key.
 */
export function getTranslationRecord(cacheKey: string): TranslationRecord | undefined {
    return translationResourceCache.get(cacheKey)
}

/**
 * Set translation record by cache key.
 */
export function setTranslationRecord(cacheKey: string, record: TranslationRecord): void {
    translationResourceCache.set(cacheKey, record)
}

/**
 * Get current language record snapshot.
 */
export function getCurrentLanguageRecord(): LanguageRecord | null {
    return currentLanguageRecord
}

/**
 * Set current language record snapshot.
 */
export function setCurrentLanguageRecord(record: LanguageRecord): void {
    currentLanguageRecord = record
}

/**
 * Add a language store listener.
 */
export function addLanguageStoreListener(listener: () => void): void {
    languageStoreListeners.add(listener)
}

/**
 * Remove a language store listener.
 */
export function removeLanguageStoreListener(listener: () => void): void {
    languageStoreListeners.delete(listener)
}

/**
 * Return current language store version snapshot.
 */
export function getLanguageStoreSnapshot(): number {
    return languageStoreVersion
}

/**
 * Return server-side language store snapshot.
 */
export function getLanguageStoreServerSnapshot(): number {
    return languageStoreVersion
}

/**
 * Check whether language bridge is already bound.
 */
export function isLanguageBridgeBound(): boolean {
    return languageBridgeBound
}

/**
 * Mark language bridge as bound.
 */
export function setLanguageBridgeBound(value: boolean): void {
    languageBridgeBound = value
}

/**
 * Get in-flight language bridge binding promise.
 */
export function getLanguageBridgeBindingPromise(): Promise<void> | null {
    return languageBridgeBindingPromise
}

/**
 * Set in-flight language bridge binding promise.
 */
export function setLanguageBridgeBindingPromise(value: Promise<void> | null): void {
    languageBridgeBindingPromise = value
}

import type { I18nCacheOptions, I18nPathConfig, I18nRetryOptions } from './types'

/**
 * Default path config.
 */
export const DEFAULT_I18N_PATH_CONFIG: I18nPathConfig = {
    tailTemplate: '/locales/{lang}/{namespace}.json',
}

/**
 * Default cache config.
 */
export const DEFAULT_I18N_CACHE_OPTIONS: I18nCacheOptions = {
    enabled: true,
    ttlMs: 5 * 60 * 1000,
}

/**
 * Default retry config.
 */
export const DEFAULT_I18N_RETRY_OPTIONS: I18nRetryOptions = {
    retries: 2,
    baseDelayMs: 250,
    maxDelayMs: 2000,
    backoffFactor: 2,
    retryOnStatuses: [408, 425, 429, 500, 502, 503, 504],
}

/**
 * Default language storage key.
 */
export const DEFAULT_I18N_STORAGE_KEY = 'app.lang'

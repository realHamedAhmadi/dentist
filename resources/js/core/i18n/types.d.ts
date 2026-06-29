/**
 * Supported text directions.
 */
export type Direction = 'ltr' | 'rtl'

/**
 * Single language definition.
 */
export interface ILanguage {
    lang: string
    dir: Direction
    label: string
    locale: string
    isDefault?: boolean
}

/**
 * Dynamic loader for locale JSON.
 */
export type LocaleLoader = () => Promise<{ default: Record<string, unknown> }>

/**
 * Namespace registration manifest for plugins.
 */
export interface I18nNamespaceManifest {
    namespace: string
    loaders: Partial<Record<ILanguage, LocaleLoader>>
}

export interface I18nNamespaceRegisteredPayload {
    namespace:I18nNamespaceManifest['namespace'],
}

export interface I18nLangChangedPayload {
    lang:ILanguage['lang'],
    dir:Direction
}

import type { TFunction } from 'i18next'

/**
 * Common resource shape.
 */
export type I18nResource = Record<string, unknown>

/**
 * Tail template config.
 */
export interface I18nPathConfig {
    tailTemplate: string
}

/**
 * Module namespace registration input.
 */
export interface I18nModuleNamespaceInput {
    module: string
    basePath: string
    namespace: string
}

/**
 * Retry policy.
 */
export interface I18nRetryOptions {
    retries: number
    baseDelayMs: number
    maxDelayMs: number
    backoffFactor: number
    retryOnStatuses: number[]
}

/**
 * Cache policy.
 */
export interface I18nCacheOptions {
    enabled: boolean
    ttlMs: number
}

/**
 * URL resolver abstraction.
 */
export interface II18nUrlResolver {
    /**
     * Build final URL for locale file.
     */
    resolve(basePath: string, lang: string, namespace: string): string
}

/**
 * Backend abstraction.
 */
export interface II18nBackend {
    /**
     * Read locale JSON from URL.
     */
    read(url: string): Promise<I18nResource>
}

/**
 * Cache abstraction.
 */
export interface II18nCache {
    /**
     * Get cached item by key.
     */
    get(key: string): I18nResource | null

    /**
     * Set cached item by key.
     */
    set(key: string, value: I18nResource): void

    /**
     * Invalidate one key or full cache.
     */
    invalidate(key?: string): void
}

/**
 * Retry executor abstraction.
 */
export interface IRetryExecutor {
    /**
     * Execute async operation with retry policy.
     */
    run<T>(operation: () => Promise<T>): Promise<T>
}

/**
 * Module registry abstraction.
 */
export interface IModuleNamespaceRegistry {
    /**
     * Register module + namespace + basePath.
     */
    register(input: I18nModuleNamespaceInput): void

    /**
     * Resolve module entry.
     */
    get(module: string): { basePath: string; namespaces: Set<string> } | null
}

/**
 * Locale loader abstraction.
 */
export interface II18nResourceLoader {
    /**
     * Load locale resource by module/basePath/lang/namespace.
     */
    load(basePath: string, lang: string, namespace: string): Promise<I18nResource>
}

/**
 * Translation response shape.
 */
export interface IUseTranslationResult {
    t: TFunction
    ready: boolean
}



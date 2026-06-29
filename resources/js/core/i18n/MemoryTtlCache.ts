import type { II18nCache, I18nCacheOptions, I18nResource } from './types'
import { DEFAULT_I18N_CACHE_OPTIONS } from './defaults'

/**
 * In-memory TTL cache implementation.
 */
export class MemoryTtlCache implements II18nCache {
    private readonly store = new Map<string, { value: I18nResource; expiresAt: number }>()
    private readonly options: I18nCacheOptions

    constructor(options: Partial<I18nCacheOptions> = {}) {
        this.options = { ...DEFAULT_I18N_CACHE_OPTIONS, ...options }
    }

    /**
     * Get cached value if not expired.
     */
    get(key: string): I18nResource | null {
        if (!this.options.enabled) return null

        const entry = this.store.get(key)
        if (!entry) return null

        // Remove expired entry
        if (Date.now() >= entry.expiresAt) {
            this.store.delete(key)
            return null
        }

        return entry.value
    }

    /**
     * Save cache value.
     */
    set(key: string, value: I18nResource): void {
        if (!this.options.enabled) return

        this.store.set(key, {
            value,
            expiresAt: Date.now() + this.options.ttlMs,
        })
    }

    /**
     * Invalidate one key or all.
     */
    invalidate(key?: string): void {
        if (key) {
            this.store.delete(key)
            return
        }

        this.store.clear()
    }
}

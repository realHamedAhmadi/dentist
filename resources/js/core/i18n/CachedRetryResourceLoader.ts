import type {
    II18nBackend,
    II18nCache,
    II18nResourceLoader,
    II18nUrlResolver,
    I18nResource,
    IRetryExecutor,
} from './types'

/**
 * Resource loader with URL resolve + cache + retry + backend + in-flight dedupe.
 */
export class CachedRetryResourceLoader implements II18nResourceLoader {
    private readonly inFlight = new Map<string, Promise<I18nResource>>()

    constructor(
        private readonly urlResolver: II18nUrlResolver,
        private readonly backend: II18nBackend,
        private readonly cache: II18nCache,
        private readonly retry: IRetryExecutor
    ) {}

    /**
     * Load resource with dedupe and cache.
     */
    async load(basePath: string, lang: string, namespace: string): Promise<I18nResource> {
        const url = this.urlResolver.resolve(basePath, lang, namespace)

        // Return from cache if exists
        const cached = this.cache.get(url)
        if (cached) return cached

        // Reuse in-flight request if available
        const inflight = this.inFlight.get(url)
        if (inflight) return inflight

        const request = this.retry.run(async () => {
            // Fetch and cache resource
            const data = await this.backend.read(url)
            this.cache.set(url, data)
            return data
        })

        this.inFlight.set(url, request)

        try {
            return await request
        } finally {
            this.inFlight.delete(url)
        }
    }
}

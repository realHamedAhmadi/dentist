import type { II18nBackend, I18nResource } from './types'

/**
 * Fetch backend implementation.
 */
export class FetchI18nBackend implements II18nBackend {
    /**
     * Load JSON using fetch.
     */
    async read(url: string): Promise<I18nResource> {
        // Request resource
        const response = await fetch(url, { method: 'GET' })
        if (!response.ok) {
            const error = new Error(`Locale request failed: ${response.status} ${response.statusText}`)
            ;(error as Error & { status?: number }).status = response.status
            throw error
        }

        return (await response.json()) as I18nResource
    }
}

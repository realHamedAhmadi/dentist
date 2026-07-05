import type { II18nBackend, I18nResource } from './types'
import {isProd} from "@/core/config/env";
import {Logger} from "@/core/facades/Logger";

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
            const message=`Locale request failed: ${response.status} ${response.statusText}; url:${url}`
            const error = new Error(message);
            (error as Error & { status?: number }).status = response.status
            throw error
        }

        return (await response.json()) as I18nResource
    }
}

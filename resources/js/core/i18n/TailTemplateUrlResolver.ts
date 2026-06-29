import type { I18nPathConfig, II18nUrlResolver } from './types'
import { DEFAULT_I18N_PATH_CONFIG } from './defaults'

/**
 * Default URL resolver using tail template.
 */
export class TailTemplateUrlResolver implements II18nUrlResolver {
    constructor(private readonly config: I18nPathConfig = DEFAULT_I18N_PATH_CONFIG) {
        if (!config?.tailTemplate) {
            throw new Error('tailTemplate is required')
        }
    }

    /**
     * Resolve final URL from basePath and template vars.
     */
    resolve(basePath: string, lang: string, namespace: string): string {
        // Normalize path segments
        const base = basePath.trim().replace(/\/+$/, '')
        const tail = this.config.tailTemplate.replace(/^\/+/, '')

        // Replace known placeholders
        const resolvedTail = tail.replace(/\{(\w+)\}/g, (_m, token: string) => {
            const vars: Record<string, string> = { lang, namespace }
            return encodeURIComponent(vars[token] ?? '')
        })

        return `${base}/${resolvedTail}`
    }
}

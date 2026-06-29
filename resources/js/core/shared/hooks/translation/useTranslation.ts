import React from 'react'
import { getApp } from '@/core/shared/store/useAppStore'
import { I18nService } from '@/core/i18n/I18nService'

/**
 * React-safe translation hook using async I18nService.useTranslation.
 */
export function useTranslation(signature: string,options={}) {
    const [t, setT] = React.useState<(key: string, options?: any) => string>(() => (key) => key)
    const [ready, setReady] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)

    React.useEffect(() => {
        // Ignore stale async results after unmount/signature change
        let cancelled = false

        /**
         * Load translation function from service.
         */
        const load = async () => {
            try {
                setReady(false)
                setError(null)

                const app = getApp()
                if (!app) throw new Error('Application container is not available')

                const i18n = await app.make(I18nService)
                const result = await i18n.useTranslation(signature)

                if (!cancelled) {
                    setT(() => result.t as (key: string, options?: any) => string)
                    setReady(result.ready)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err as Error)
                    setReady(false)
                }
            }
        }

        void load()

        return () => {
            cancelled = true
        }
    }, [signature])

    return { t, ready, error }
}

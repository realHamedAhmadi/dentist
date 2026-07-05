import { getApp } from '@/core/shared/store/useAppStore'
import { EventBus } from '@/core/platform/event/EventBus'
import { I18nService } from '@/core/i18n/I18nService'
import { I18nEvents } from '@/core/platform/tokens/i18n'
import type { I18nLangChangedPayload } from '@/core/i18n/types'
import { IDisposable, IEvent } from '@/core/platform/event/Event'
import {
    bumpLanguageStoreVersion,
    clearTranslationResourceCache,
    getLanguageBridgeBindingPromise,
    isLanguageBridgeBound,
    setCurrentLanguageRecord,
    setLanguageBridgeBindingPromise,
    setLanguageBridgeBound,
} from '@/core/i18n/useTranslation.cache'

/**
 * Attach to i18n language-changed event through EventBus.
 */
function attachLanguageChangedListener(
    eventBus: EventBus,
    listener: (payload: I18nLangChangedPayload) => void,
): () => void {
    const wrapped = (event: IEvent) => {
        // Forward event payload to translation store listener
        listener(event.payload as I18nLangChangedPayload)
    }

    const disposable: IDisposable = eventBus.on(I18nEvents.I18nLangChanged, wrapped)

    return () => {
        // Prefer disposable cleanup contract from EventBus.on()
        if (disposable && typeof disposable.dispose === 'function') {
            disposable.dispose()
            return
        }

        // Fallback cleanup using explicit off() if needed
        eventBus.off(I18nEvents.I18nLangChanged, wrapped)
    }
}

/**
 * Ensure public language-change bridge is bound only once.
 */
export async function ensureLanguageChangeBridge(): Promise<void> {
    if (isLanguageBridgeBound()) {
        return
    }

    const pending = getLanguageBridgeBindingPromise()
    if (pending) {
        await pending
        return
    }

    const bindingPromise = (async () => {
        const app = getApp()
        if (!app) {
            throw new Error('Application container is not available')
        }

        const eventBus = await app.make(EventBus)

        attachLanguageChangedListener(eventBus, (payload) => {
            // Replace all cached translations after active language changes
            clearTranslationResourceCache()

            // Replace current language record with the new language snapshot
            setCurrentLanguageRecord({
                status: 'resolved',
                value: payload.lang,
            })

            // Notify React subscribers to re-render
            bumpLanguageStoreVersion()
        })

        setLanguageBridgeBound(true)
    })()

    setLanguageBridgeBindingPromise(bindingPromise)
    await bindingPromise
}

/**
 * Resolve current language through the application service.
 */
export async function loadCurrentLanguage(): Promise<string> {
    const app = getApp()
    if (!app) {
        throw new Error('Application container is not available')
    }

    const i18n = await app.make(I18nService)

    await ensureLanguageChangeBridge()

    return i18n.getLanguage()
}

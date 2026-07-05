import React from 'react'
import type { UseTranslationOptions } from '@/core/i18n/types'
import type { UseTranslationResult } from '@/core/i18n/useTranslation.types'
import {
    addLanguageStoreListener,
    getLanguageStoreServerSnapshot,
    getLanguageStoreSnapshot,
    removeLanguageStoreListener,
} from '@/core/i18n/useTranslation.cache'
import { ensureLanguageChangeBridge } from '@/core/i18n/useTranslation.bridge'
import { readCurrentLanguage, readTranslationResource } from '@/core/i18n/useTranslation.resource'

/**
 * Subscribe React to language store version updates.
 */
function subscribeLanguageStore(listener: () => void): () => void {
    addLanguageStoreListener(listener)

    // Bind language bridge lazily on first subscription
    void ensureLanguageChangeBridge()

    return () => {
        // Remove listener during unmount
        removeLanguageStoreListener(listener)
    }
}

/**
 * React translation hook with Suspense behavior similar to react-i18next.
 */
export function useTranslation(
    signature: string,
    options?: UseTranslationOptions,
): UseTranslationResult {
    React.useSyncExternalStore(
        subscribeLanguageStore,
        getLanguageStoreSnapshot,
        getLanguageStoreServerSnapshot,
    )

    const lang = readCurrentLanguage(options)

    return readTranslationResource(signature, lang, options)
}

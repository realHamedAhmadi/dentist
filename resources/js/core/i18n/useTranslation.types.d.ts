import type { TFunction } from 'i18next'

/**
 * Public hook result returned to consumers.
 */
export type UseTranslationResult = {
    t: TFunction
    ready: true
    error: null
}

/**
 * Internal resolved translation payload.
 */
export type TranslationResolvedValue = {
    t: TFunction
}

/**
 * Internal pending resource record.
 */
export type PendingRecord = {
    status: 'pending'
    promise: Promise<void>
}

/**
 * Internal resolved resource record.
 */
export type ResolvedRecord = {
    status: 'resolved'
    value: TranslationResolvedValue
}

/**
 * Internal rejected resource record.
 */
export type RejectedRecord = {
    status: 'rejected'
    error: Error
}

/**
 * Internal union type for translation cache records.
 */
export type TranslationRecord = PendingRecord | ResolvedRecord | RejectedRecord

/**
 * Internal pending language record.
 */
export type LanguagePendingRecord = {
    status: 'pending'
    promise: Promise<void>
}

/**
 * Internal resolved language record.
 */
export type LanguageResolvedRecord = {
    status: 'resolved'
    value: string
}

/**
 * Internal rejected language record.
 */
export type LanguageRejectedRecord = {
    status: 'rejected'
    error: Error
}

/**
 * Internal union type for language cache records.
 */
export type LanguageRecord =
    | LanguagePendingRecord
    | LanguageResolvedRecord
    | LanguageRejectedRecord

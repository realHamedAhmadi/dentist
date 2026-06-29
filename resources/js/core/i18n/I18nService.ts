import type { i18n as I18nInstance, TFunction } from 'i18next'
import { EventBus } from '@/core/platform/event/EventBus'
import {
    getDefaultLanguage,
    getLanguageDirection,
    getSupportedLanguages,
} from '@/core/i18n/language'
import { I18nEvents } from '@/core/platform/tokens/i18n'
import type {
    I18nLangChangedPayload,
    I18nNamespaceRegisteredPayload,
} from '@/core/i18n/types'
import type { IApplication } from '@/core/platform/application/types'
import type {
    I18nModuleNamespaceInput,
    IModuleNamespaceRegistry,
    II18nResourceLoader,
    IUseTranslationResult,
} from './types'
import { DEFAULT_I18N_STORAGE_KEY } from './defaults'

/**
 * Main i18n application service (orchestrator).
 */
export class I18nService {
    private readonly loadedBundles = new Set<string>()

    constructor(
        private readonly i18n: I18nInstance,
        private readonly registry: IModuleNamespaceRegistry,
        private readonly loader: II18nResourceLoader,
        private readonly eventBus: EventBus,
        private readonly app: IApplication,
        private readonly storageKey: string = DEFAULT_I18N_STORAGE_KEY
    ) {}

    /**
     * Initialize language from storage or default.
     */
    async init(): Promise<void> {
        const supported = getSupportedLanguages()
        const fallback = getDefaultLanguage()
        const saved = this.getSavedLanguage()
        const target = saved && supported.includes(saved) ? saved : fallback

        await this.i18n.changeLanguage(target)
        await this.langChanged(target)
    }

    /**
     * Register module namespace runtime mapping.
     */
    registerModuleNamespace(input: I18nModuleNamespaceInput): void {
        this.registry.register(input)
    }

    /**
     * Resolve translation function by module:namespace.
     */
    async useTranslation(signature: string): Promise<IUseTranslationResult> {
        const { moduleName, namespace } = this.parseSignature(signature)
        await this.ensureLoaded(moduleName, namespace)

        // Return fixed namespace translator
        const t: TFunction = this.i18n.getFixedT(this.getLanguage(), namespace)
        return { t, ready: true }
    }

    /**
     * Change active language.
     */
    async setLanguage(lang: string): Promise<void> {
        if (!getSupportedLanguages().includes(lang)) {
            throw new Error(`Unsupported language: ${lang}`)
        }

        await this.i18n.changeLanguage(lang)
        this.saveLanguage(lang)
        await this.langChanged(lang)
    }

    /**
     * Get active language.
     */
    getLanguage(): string {
        return this.i18n.language || getDefaultLanguage()
    }

    /**
     * Ensure module namespace is loaded.
     */
    private async ensureLoaded(moduleName: string, namespace: string): Promise<void> {
        const entry = this.registry.get(moduleName)
        if (!entry) throw new Error(`Module not found: ${moduleName}`)
        if (!entry.namespaces.has(namespace)) {
            throw new Error(`Namespace "${namespace}" is not registered under module "${moduleName}"`)
        }

        const lang = this.getLanguage()
        const bundleKey = `${moduleName}:${namespace}:${lang}`

        if (this.loadedBundles.has(bundleKey) || this.i18n.hasResourceBundle(lang, namespace)) {
            return
        }

        try {
            // Load and attach resource bundle
            const data = await this.loader.load(entry.basePath, lang, namespace)
            this.i18n.addResourceBundle(lang, namespace, data, true, true)
            this.loadedBundles.add(bundleKey)

            const payload: I18nNamespaceRegisteredPayload = { namespace }
            await Promise.resolve(this.eventBus.emit(I18nEvents.I18nNamespaceRegistered, payload))
        } catch (error) {
            await Promise.resolve(
                this.eventBus.emit('i18n.namespace.load_failed', {
                    module: moduleName,
                    namespace,
                    language: lang,
                    basePath: entry.basePath,
                    error: this.serializeError(error),
                })
            )
            throw error
        }
    }

    /**
     * Parse "module:namespace" signature.
     */
    private parseSignature(signature: string): { moduleName: string; namespace: string } {
        const raw = signature.trim()
        const index = raw.indexOf(':')

        if (index <= 0 || index >= raw.length - 1) {
            throw new Error(`Invalid signature "${signature}". Expected "module:namespace"`)
        }

        // Split and normalize parts
        const moduleName = raw.slice(0, index).trim()
        const namespace = raw.slice(index + 1).trim()

        if (!moduleName || !namespace) {
            throw new Error(`Invalid signature "${signature}". Expected "module:namespace"`)
        }

        return { moduleName, namespace }
    }

    /**
     * Read persisted language from localStorage.
     */
    private getSavedLanguage(): string | null {
        // Guard for non-browser environments
        if (typeof localStorage === 'undefined') return null
        return localStorage.getItem(this.storageKey)
    }

    /**
     * Persist language into localStorage.
     */
    private saveLanguage(lang: string): void {
        // Guard for non-browser environments
        if (typeof localStorage === 'undefined') return
        localStorage.setItem(this.storageKey, lang)
    }

    /**
     * Handle language changed side effects.
     */
    private async langChanged(lang: string): Promise<void> {
        // Sync shell language and direction
        const dir = getLanguageDirection(lang)
        const payload: I18nLangChangedPayload = { lang, dir }

        this.app.setLang(lang)
        this.app.setDir(dir)

        await Promise.resolve(this.eventBus.emit(I18nEvents.I18nLangChanged, payload))
    }

    /**
     * Serialize unknown error safely.
     */
    private serializeError(error: unknown): { message: string } | null {
        // Convert error to stable payload
        if (!error) return null
        if (error instanceof Error) return { message: error.message }
        return { message: String(error) }
    }
}

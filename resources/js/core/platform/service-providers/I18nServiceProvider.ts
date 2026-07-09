import {I18nService} from '@/core/i18n/I18nService'
import {I18N} from "@/core/platform/tokens/i18n";
import {createI18n} from "@/core/i18n/createI18n";
import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {EventBus} from "@/core/platform/event/EventBus";
import {TailTemplateUrlResolver} from "@/core/i18n/TailTemplateUrlResolver";
import {MemoryTtlCache} from "@/core/i18n/MemoryTtlCache";
import {ExponentialBackoffRetryExecutor} from "@/core/i18n/ExponentialBackoffRetryExecutor";
import {InMemoryModuleNamespaceRegistry} from "@/core/i18n/InMemoryModuleNamespaceRegistry";
import {CachedRetryResourceLoader} from "@/core/i18n/CachedRetryResourceLoader";
import {FetchI18nBackend} from "@/core/i18n/FetchI18nBackend";

export class I18nServiceProvider extends ServiceProvider {
    /**
     * Register i18n instances in container.
     */
    async register(): Promise<void> {
        const backend = new FetchI18nBackend()
        const urlResolver = new TailTemplateUrlResolver()
        const cache = new MemoryTtlCache()
        const retry = new ExponentialBackoffRetryExecutor()
        const registry = new InMemoryModuleNamespaceRegistry()
        const loader = new CachedRetryResourceLoader(urlResolver, backend, cache, retry)
        this.app.singleton(I18N, async () => {
            return await createI18n()
        })
        this.app.singleton(I18nService, async () => {
            const i18n = await this.app.make(I18N)
            return new I18nService(
                i18n,
                registry,
                loader,
                this.app.make(EventBus),
                this.app,
                'app.lang'
            )
        })
    }

    /**
     * Initialize runtime i18n behavior.
     */
    async boot(): Promise<void> {
        const i18nService = await this.app.make(I18nService)
        await i18nService.init()
        i18nService.registerModuleNamespace({
            module:'core',
            namespace:'sidebar',
            basePath:'http://localhost:5173/dist/app/admin/1.0.0'
        })
    }
}

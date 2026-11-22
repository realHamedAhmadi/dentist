import {DirType, IApplication} from "@/core/platform/application/types";
import {ServiceProviderConstructor} from "@/core/platform/service-providers/types";
import {Container} from "@/core/platform/container/Container";
import {DefaultProviders} from "@/core/platform/service-providers/DefaultProvider";
import {PluginRegistry} from "@/core/platform/plugin/PluginRegistry";
import {setApp} from "@/core/platform/application/appInstance";

export class Application extends Container implements IApplication {
    protected dir: DirType = 'ltr';
    protected lang = 'en';
    protected version = '1.0.0';

    public readonly plugins: PluginRegistry;
    protected providers = new Set<ServiceProviderConstructor>();

    constructor(
        protected readonly type:string,
        public config?: object
    ) {
        super();
        this.singleton(PluginRegistry, PluginRegistry);
        this.plugins = this.make(PluginRegistry);
    }

    /**
     * Bootstrap the application by registering and booting providers sequentially.
     */
    async bootstrap(): Promise<void> {
        setApp(this);
        this.registerConfiguredProviders();

        // Use a Set to ensure provider uniqueness and maintain insertion order
        const providers = new Set();

        // Sequentially register providers to respect temporal dependency constraints
        for (const Provider of this.providers) {
            const instance = new Provider(this);
            providers.add(instance);
            await instance.register();
        }

        // Sequentially boot providers to ensure all dependencies are initialized
        for (const provider of providers) {
            if (typeof provider.boot === 'function') {
                await provider.boot();
            }
        }
    }


    register(provider: ServiceProviderConstructor): void {
        this.providers.add(provider);
    }

    registerConfiguredProviders(): void {
        DefaultProviders.defaults().get().forEach(p => this.register(p))
    }

    getDir(): DirType {
        return this.dir;
    }

    getLang(): string {
        return this.lang;
    }

    setDir(dir: DirType): void {
        this.dir = dir
    }

    setLang(lang: string): void {
        this.lang=lang
    }

    getType() {
        return this.type;
    }
}

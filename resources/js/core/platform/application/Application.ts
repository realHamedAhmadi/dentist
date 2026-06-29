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

    protected readonly plugins: PluginRegistry;
    protected providers = new Set<ServiceProviderConstructor>();

    constructor(
        readonly public type,
        public config?: object
    ) {
        super();
        this.singleton(PluginRegistry, PluginRegistry);
        this.plugins = this.make(PluginRegistry);
    }

    bootstrap(): void {
        setApp(this)
        this.registerConfiguredProviders();
        const providers = new Set();
        this.providers.forEach((p) => {
            const instance = new p(this);
            providers.add(instance);
            instance.register();
        });

        providers.forEach(p => p.boot?.());
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
}

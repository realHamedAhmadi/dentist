import { ServiceProviderConstructor } from "./types";
import { CoreMessagingServiceProvider } from "./CoreMessagingServiceProvider";
import {LoggerServiceProvider} from "@/core/platform/service-providers/LoggerServiceProvider";
import {PluginServiceProvider} from "@/core/platform/service-providers/PluginServiceProvider";
import {SlotServiceProvider} from "@/core/platform/service-providers/SlotServiceProvider";
import {RoutingServiceProvider} from "@/core/platform/service-providers/RoutingServiceProvider";
import {HotKeyServiceProvider} from "@/core/platform/service-providers/HotKeyServiceProvider";
import {CoreServiceProvider} from "@/core/platform/service-providers/CoreServiceProvider";
import {TransportServiceProvider} from "@/core/platform/service-providers/TransportServiceProvider";
import {TracingServiceProvider} from "@/core/platform/service-providers/TracingServiceProvider";
import {I18nServiceProvider} from "@/core/platform/service-providers/I18nServiceProvider";

/**
 * Stores provider classes and allows merge/replace/except operations
 */
export class DefaultProviders {

    protected providers: Set<ServiceProviderConstructor>;

    /**
     * Create provider collection
     */
    constructor(providers: ServiceProviderConstructor[] = []) {
        // Initialize provider set
        this.providers = new Set(providers);
    }

    /**
     * Default core providers
     */
    static defaults(): DefaultProviders {
        return new DefaultProviders([
            CoreServiceProvider,
            LoggerServiceProvider,
            TracingServiceProvider,
            TransportServiceProvider,
            CoreMessagingServiceProvider,
            I18nServiceProvider,
            SlotServiceProvider,
            RoutingServiceProvider,
            HotKeyServiceProvider,
            PluginServiceProvider,
        ]);
    }

    /**
     * Merge providers
     */
    merge(providers: ServiceProviderConstructor[]): DefaultProviders {

        const merged = new Set(this.providers);

        for (const provider of providers) {
            // Add provider class to set
            merged.add(provider);
        }

        return new DefaultProviders([...merged]);
    }

    /**
     * Replace providers
     */
    replace(
        replacements: Map<ServiceProviderConstructor, ServiceProviderConstructor>
    ): DefaultProviders {

        const replaced = [...this.providers].map(provider => {
            // Replace provider if mapping exists
            return replacements.get(provider) ?? provider;
        });

        return new DefaultProviders(replaced);
    }

    /**
     * Remove providers
     */
    except(providers: ServiceProviderConstructor[]): DefaultProviders {

        const removeSet = new Set(providers);

        const filtered = [...this.providers].filter(
            provider => !removeSet.has(provider)
        );

        return new DefaultProviders(filtered);
    }

    /**
     * Get to all
     */
    get(): Set<ServiceProviderConstructor> {
        return this.providers;
    }

    /**
     * Convert to array
     */
    toArray(): ServiceProviderConstructor[] {
        return [...this.providers];
    }
}

import { ServiceProvider } from "@/core/platform/service-providers/ServiceProvider";
import {
    __federation_method_setRemote as setRemote,
    __federation_method_getRemote as getRemote,
    __federation_method_unwrapDefault as unwrapDefault,
} from "virtual:__federation__";
import { resolveDevServerPort } from "@/core/shared/utils/helper";
import { isProd } from "@/core/config/env";
import {Logger} from "@/core/facades/Logger";

type RemoteEntryConfig = {
    entry: string
    version: string
};

export class PluginServiceProvider extends ServiceProvider {
    /**
     * Register local and remote plugin service providers.
     */
    async register(): Promise<void> {
        const remotes = window.__APP__?.remoteEntries ?? {};

        for (const [pluginName, rawConfig] of Object.entries(remotes)) {
            const config = rawConfig as RemoteEntryConfig;

            let url = config.entry;
            if (!isProd()) {
                url = url.replace("{port}", this.getPort(pluginName).toString());
            }
            setRemote(pluginName, {
                url,
                format: "esm",
                from: "vite",
            });

            const remoteModule = await getRemote(pluginName, "./serviceProvider");
            const provider = this.resolveProviderExport(remoteModule);
            console.log(provider)
            if (!provider) {
                Logger.channel('PluginServiceProvider:register').error(`Remote provider export is invalid for plugin "${pluginName}"`, {
                    pluginName,
                    url,
                    pluginVersion:config?.version,
                    __location__
                });
                continue;
            }

            this.app.register(provider);
        }
    }

    /**
     * Resolve the service provider class from a remote federation module.
     */
    protected resolveProviderExport(remoteModule: unknown): any {
        const unwrapped = unwrapDefault(remoteModule as any);

        if (typeof unwrapped === "function") {
            return unwrapped;
        }

        if (remoteModule && typeof remoteModule === "object") {
            const candidates = Object.values(remoteModule as Record<string, unknown>);
            const provider = candidates.find((value) => typeof value === "function");
            if (provider) {
                return provider;
            }
        }

        return null;
    }

    /**
     * Resolve the plugin dev server port by plugin name and panel type.
     */
    protected getPort(pluginName: string): number {
        return resolveDevServerPort(pluginName, this.app.getType());
    }
}

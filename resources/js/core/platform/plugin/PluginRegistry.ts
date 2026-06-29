import {PluginActivationType, PluginManifest, PluginMetadata} from "@/core/platform/plugin/types";

export class PluginRegistry {
    // We use a Map to keep O(1) access time by plugin ID
    private plugins: Map<string, PluginMetadata> = new Map();

    /**
     * Registers a plugin into the registry.
     * Performs dependency validation before accepting the plugin.
     */
    public register(manifest: PluginManifest, provider: any, path: string): void {
        if (this.plugins.has(manifest.id)) {
            console.warn(`Plugin ${manifest.id} is already registered.`);
            return;
        }

        // 1. Dependency Validation (The nerd part 🤓)
        this.validateDependencies(manifest);

        // 2. Wrap into Metadata
        const metadata: PluginMetadata = {
            ...manifest,
            provider: provider,
            enabled: true, // Default to enabled
            booted:false,
            path: path
        };

        this.plugins.set(manifest.id, metadata);
        console.log(`Plugin ${manifest.id} registered successfully.`);
    }

    private validateDependencies(manifest: PluginManifest): void {
        const required = manifest.dependencies?.required;
        if (!required) return;

        for (const [id, version] of Object.entries(required)) {
            const dependency = this.plugins.get(id);
            if (!dependency) {
                throw new Error(`Plugin ${manifest.id} requires ${id}@${version}, but it is not installed.`);
            }
            // Add SemVer comparison logic here if needed
        }
    }

    /**
     * Boots plugins based on their activation strategy.
     */
    public bootPlugins(activation: PluginActivationType): void {
        for (const plugin of this.plugins.values()) {
            this.boot(plugin.id,activation)
        }
    }

    public boot(plugin:string | PluginMetadata, activation?: PluginActivationType): void {
        if (typeof plugin==='string'){
            plugin=this.get(plugin);
        }
        if ((activation && plugin.activation === activation) && plugin.enabled && !plugin.booted) {
            // Assuming the provider has a 'boot' method
            if (typeof plugin.provider.boot === 'function') {
                plugin.provider.boot();
                plugin.booted=true;
            }
        }
    }

    public get(pluginId:string):PluginMetadata {
        return this.plugins.get(pluginId)
    }

    public all(): PluginMetadata[] {
        return Array.from(this.plugins.values());
    }
}

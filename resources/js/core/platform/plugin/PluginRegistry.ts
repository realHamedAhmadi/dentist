import {
    PluginActivationType,
    PluginManifest,
    PluginMetadata,
    IServiceProvider
} from "@/core/platform/plugin/types";
import {DevLogger} from "@/core/facades/DevLogger";

/**
 * Registry responsible for managing the lifecycle of plugins.
 * Handles registration, dependency validation, and activation.
 */
export class PluginRegistry {
    /**
     * Internal store for plugin metadata, indexed by plugin name.
     */
    private readonly plugins: Map<string, PluginMetadata> = new Map();

    /**
     * Registers a plugin and prepares it for activation.
     *
     * @param manifest - The plugin's manifest configuration.
     * @param provider - The instantiated plugin provider (remote module).
     * @param path - Filesystem or build directory path.
     * @param port - Development server port.
     */
    public register(
        manifest: PluginManifest,
        provider: IServiceProvider,
        path: string,
        port: number
    ): void {
        // Use name as the unique identifier
        if (this.plugins.has(manifest.name)) {
            DevLogger.channel('Plugin:registry').warn(`Plugin "${manifest.name}" is already registered.`);
            return;
        }

        // Validate if all required dependencies are present
        this.validateDependencies(manifest);

        // Construct metadata with runtime state
        const metadata: PluginMetadata = {
            ...manifest,
            provider,
            path,
            port,
            enabled: true,
            booted: false,
        };

        this.plugins.set(manifest.name, metadata);

        // Potential for Event Bus trigger here: 'plugin:registered'
        DevLogger.channel('Plugin:registry').info(`Plugin "${manifest.name}" registered.`);
    }

    /**
     * Validates that all required dependencies for a plugin are already registered.
     */
    private validateDependencies(manifest: PluginManifest): void {
        const required = manifest.dependencies?.required;
        if (!required) return;

        for (const [depName, version] of Object.entries(required)) {
            if (!this.plugins.has(depName)) {
                throw new Error(
                    `Dependency Error: Plugin "${manifest.name}" requires "${depName}" (@${version}), but it is missing.`
                );
            }
            // Implementation of SemVer comparison could be added here
        }
    }

    /**
     * Boots all registered plugins that match a specific activation strategy.
     *
     * @param activation - The activation strategy to filter by (e.g., 'eager').
     */
    public async bootPlugins(activation: PluginActivationType): Promise<void> {
        const targets = this.all().filter(p => p.activation === activation);

        for (const plugin of targets) {
            await this.boot(plugin);
        }
    }

    /**
     * Triggers the boot sequence for a specific plugin.
     *
     * @param plugin - Plugin name or metadata object.
     * @param activation - Optional filter to match activation strategy.
     */
    public async boot(
        plugin: string | PluginMetadata,
        activation?: PluginActivationType
    ): Promise<void> {
        const metadata = typeof plugin === 'string' ? this.get(plugin) : plugin;

        if (!metadata) {
            DevLogger.channel('Plugin:registry').error(`Plugin boot failed: Plugin not found.`);
            return;
        }

        // Check if plugin is eligible for booting
        const matchesActivation = activation ? metadata.activation === activation : true;
        const canBoot = metadata.enabled && !metadata.booted && matchesActivation;

        if (canBoot) {
            try {
                // Execute boot method if provided by the plugin implementation
                if (typeof metadata.provider.boot === 'function') {
                    await metadata.provider.boot();
                }

                metadata.booted = true;
                // Potential for Event Bus trigger here: 'plugin:booted'
            } catch (error) {
                DevLogger.channel('Plugin:registry').error(`Failed to boot plugin "${metadata.name}":`, error);
            }
        }
    }

    /**
     * Retrieves a plugin's metadata by its name.
     */
    public get(pluginName: string): PluginMetadata | undefined {
        return this.plugins.get(pluginName);
    }

    /**
     * Returns an array of all registered plugins.
     */
    public all(): PluginMetadata[] {
        return Array.from(this.plugins.values());
    }
}

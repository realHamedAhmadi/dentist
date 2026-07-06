/**
 * Maps plugin identifiers to semantic version ranges (e.g., "order-service": "^1.2.0").
 */
export interface PluginDependencyMap {
    [pluginId: string]: string
}

/**
 * Defines plugin dependencies grouped by requirement level (required vs optional).
 */
export interface PluginDependencies {
    /**
     * Critical dependencies that must be present for the plugin to function.
     */
    required?: PluginDependencyMap
    /**
     * Non-critical dependencies that enhance functionality if available.
     */
    optional?: PluginDependencyMap
}

/**
 * Defines the activation strategy:
 * - 'eager': Loaded immediately at startup.
 * - 'lazy': Loaded when the route or component is requested.
 * - 'manual': Loaded via explicit user action or command.
 */
export type PluginActivationType = 'eager' | 'lazy' | 'manual'

/**
 * Base plugin provider contract.
 * Represents the exported interface from the remote module.
 */
export interface IServiceProvider {
    /**
     * Method to initialize the plugin.
     */
    register(): void | Promise<void>;
    /**
     * Method to boot the plugin after all registrations are done.
     */
    boot?(): void | Promise<void>;
}

/**
 * Describes the manifest contract used for plugin discovery,
 * validation, dependency resolution, and activation.
 */
export interface PluginManifest {
    /**
     * Unique plugin identifier.
     */
    name: string

    /**
     * Targeted panel or layout area (e.g., 'admin', 'client', 'shared').
     */
    area: string

    /**
     * Semantic version of the plugin.
     */
    version: string

    /**
     * Required core application version range.
     */
    core: string

    /**
     * The exposed module path inside the remote (e.g., './OrderList').
     */
    entry: string

    /**
     * Declared plugin dependencies.
     */
    dependencies?: PluginDependencies

    /**
     * Strategy for loading and activating the plugin.
     */
    activation?: PluginActivationType
}

/**
 * Extends the plugin manifest with runtime-specific metadata
 * used by the system for managing the plugin lifecycle.
 */
export interface PluginMetadata extends PluginManifest {
    /**
     * Resolved plugin provider instance after loading the remote module.
     */
    provider: IServiceProvider;

    /**
     * Current availability status of the plugin.
     */
    enabled: boolean;

    /**
     * Indicates whether the plugin's boot method has been executed.
     */
    booted: boolean;

    /**
     * The network port used for loading the remote in development mode.
     */
    port: number;

    /**
     * The filesystem directory path where the plugin's built artifacts are located.
     * Useful for static file serving or resolving relative assets.
     */
    path: string;
}

/**
 * Maps plugin ids to semantic version ranges.
 */
export interface PluginDependencyMap {
    [pluginId: string]: string
}

/**
 * Declares plugin dependencies grouped by strictness.
 */
export interface PluginDependencies {
    required?: PluginDependencyMap
    optional?: PluginDependencyMap
}

/**
 * Describes a plugin manifest used during discovery,
 * validation, dependency resolution, and activation.
 */
export interface PluginManifest {
    id: string
    version: string
    core: string
    dependencies?: PluginDependencies
    activation?: "eager" | "lazy" | "manual"
}

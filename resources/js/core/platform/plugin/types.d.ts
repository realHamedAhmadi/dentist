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

export type PluginActivationType= 'eager' | 'lazy' | 'manual'

/**
 * Describes a plugin manifest used during discovery,
 * validation, dependency resolution, and activation.
 */
export interface PluginManifest {
    name: string
    area:string
    version: string
    core: string
    entry: string;
    dependencies?: PluginDependencies
    activation?: PluginActivationType
}

export interface PluginMetadata extends PluginManifest{
    provider: any;
    enabled: boolean;
    booted:boolean;
    path: string;
}





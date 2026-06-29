import {PluginActivationType, PluginDependencies} from "@/core/platform/plugin/types";

export type BuildTarget = 'admin' | 'client';

/**
 * Package.json plugin-specific metadata.
 */
export interface PluginPackageMeta {
    core: string;
    activation?: PluginActivationType;
    dependencies?: PluginDependencies;
}

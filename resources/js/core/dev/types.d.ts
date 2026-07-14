import {PluginActivationType, PluginDependencies} from "@/core/platform/plugin/types";
/**
 * Package.json plugin-specific metadata.
 */
export interface PluginPackageMeta {
    core: string;
    activation?: PluginActivationType;
    dependencies?: PluginDependencies;
}

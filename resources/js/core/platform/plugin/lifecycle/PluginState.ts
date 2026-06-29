/**
 * Represents the lifecycle states of a plugin inside the plugin runtime.
 *
 * The lifecycle typically progresses in this order:
 *
 * Discovered  -> Plugin was found by the discovery mechanism (filesystem, registry, etc.)
 * Resolved    -> Dependencies were validated and resolved by the dependency resolver
 * Loaded      -> Plugin module was loaded and instance created
 * Initialized -> Plugin.initialize() has been executed
 * Active      -> Plugin.start() executed and the plugin is fully running
 * Stopped     -> Plugin.stop() executed but the plugin instance still exists
 * Unloaded    -> Plugin.destroy() executed and the plugin is completely removed
 *
 * These states are used by PluginLifecycleManager to control and track
 * plugin lifecycle transitions safely.
 */
export const PluginState = {

    Discovered : "discovered",
    Resolved : "resolved",
    Loaded : "loaded",
    Initialized : "initialized",
    Active : "active",
    Stopped : "stopped",
    Unloaded : "unloaded"

} as const

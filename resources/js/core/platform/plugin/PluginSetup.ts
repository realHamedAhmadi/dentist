import { IPluginContext } from '@/core/platform/plugin/PluginContext'
import { ExtensionLoader } from "@/core/platform/extension/ExtensionLoader"
import { ExtensionDiscovery } from "@/core/platform/extension/ExtensionDiscovery"
import { PluginDescriptor } from "@/core/platform/plugin/types"
import { PluginContextFactory } from "@/core/platform/plugin/PluginContextFactory"

/**
 * Handles the orchestration of plugin lifecycle stages.
 * Uses a context factory to ensure stable plugin identities and efficient state management.
 */
export class PluginSetup {

    constructor(
        private contextFactory: PluginContextFactory,
        private extensionDiscovery: ExtensionDiscovery,
        private extensionLoader: ExtensionLoader
    ) {}

    /**
     * Executes a specific lifecycle method across a set of plugins in a defined order.
     */
    private async runLifecycle(
        descriptors: PluginDescriptor[],
        runner: (descriptor: PluginDescriptor, ctx: IPluginContext) => Promise<void>
    ) {
        for (const descriptor of descriptors) {
            // Get or create the stable context for this plugin
            const ctx = this.contextFactory.get(descriptor.manifest.id)
            await runner(descriptor, ctx)
        }
    }

    /**
     * Setup phase: registration of services, slots, commands, and extension loading.
     */
    async runSetup(descriptors: PluginDescriptor[]) {
        await this.runLifecycle(
            descriptors,
            async (descriptor, ctx) => {
                const plugin = descriptor.plugin

                // 1. Initialize plugin internals
                if (plugin.setup) {
                    await plugin.setup(ctx)
                }

                // 2. Discover and load extensions for this plugin
                const extensionModules = this.extensionDiscovery.discover(
                    descriptor.path
                )

                await this.extensionLoader.load(
                    descriptor.manifest.id,
                    extensionModules
                )
            }
        )
    }

    /**
     * Start phase: triggering runtime side-effects (e.g., cron jobs, websockets).
     */
    async runStart(descriptors: PluginDescriptor[]) {
        await this.runLifecycle(
            descriptors,
            async (descriptor, ctx) => {
                // We pass ctx to start() as well to allow plugins to access
                // the bus or logger if they need to initialize background workers
                if (descriptor.plugin.start) {
                    await descriptor.plugin.start(ctx)
                }
            }
        )
    }
}

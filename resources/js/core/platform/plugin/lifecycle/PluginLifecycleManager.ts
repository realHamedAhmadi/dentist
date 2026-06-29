import {PluginState} from "@/core/platform/plugin/lifecycle/PluginState";
import {PluginGraph} from "@/core/platform/plugin/graph/PluginGraph";
import {PluginDescriptor} from "@/core/platform/plugin/types";
import {IPluginContext} from "@/core/platform/plugin/PluginContext";

export class PluginLifecycleManager {

    private states = new Map<string, PluginState>()

    constructor(
        private graph: PluginGraph,
        private loadOrder: PluginDescriptor[]
    ) {}

    getState(pluginId: string): PluginState | undefined {
        return this.states.get(pluginId)
    }

    async initializeAll(contextFactory: (id: string) => IPluginContext) {

        for (const descriptor of this.loadOrder) {

            const id = descriptor.manifest.id
            const plugin = descriptor.plugin

            try {

                if (plugin.setup) {
                    await plugin.setup(contextFactory(id))
                }

                this.states.set(id, PluginState.Initialized)

            } catch (err) {

                throw new Error(
                    `Failed to initialize plugin '${id}': ${err}`
                )

            }

        }

    }

    async startAll() {

        for (const descriptor of this.loadOrder) {

            const id = descriptor.manifest.id
            const plugin = descriptor.plugin

            try {

                if (plugin.start) {
                    await plugin.start()
                }

                this.states.set(id, PluginState.Active)

            } catch (err) {

                throw new Error(
                    `Failed to start plugin '${id}': ${err}`
                )

            }

        }

    }

    async stopAll() {

        const reverse = [...this.loadOrder].reverse()

        for (const descriptor of reverse) {

            const id = descriptor.manifest.id
            const plugin = descriptor.plugin

            if (this.states.get(id) !== PluginState.Active) {
                continue
            }

            try {

                if (plugin.stop) {
                    await plugin.stop()
                }

                this.states.set(id, PluginState.Stopped)

            } catch (err) {

                console.error(`Failed stopping plugin '${id}'`, err)

            }

        }

    }

    async destroyAll() {

        const reverse = [...this.loadOrder].reverse()

        for (const descriptor of reverse) {

            const id = descriptor.manifest.id
            const plugin = descriptor.plugin

            try {

                if (plugin.destroy) {
                    await plugin.destroy()
                }

                this.states.set(id, PluginState.Unloaded)

            } catch (err) {

                console.error(`Failed destroying plugin '${id}'`, err)

            }

        }

    }

    async stop(pluginId: string) {

        const dependents = this.graph.getDependents(pluginId)

        if (dependents.length > 0) {

            const list = dependents.map(d => d.id).join(", ")

            throw new Error(
                `Cannot stop plugin '${pluginId}', used by: ${list}`
            )

        }

        const node = this.graph.getNode(pluginId)

        if (!node) return

        const plugin = node.descriptor.plugin

        if (plugin.stop) {
            await plugin.stop()
        }

        this.states.set(pluginId, PluginState.Stopped)

    }

    async reload(pluginId: string, contextFactory: (id: string) => PluginContext) {

        const node = this.graph.getNode(pluginId)

        if (!node) {
            throw new Error(`Plugin '${pluginId}' not found`)
        }

        const dependents = this.graph.getDependents(pluginId)

        const reloadChain = [
            node,
            ...dependents
        ]

        for (const n of reloadChain) {

            const plugin = n.descriptor.plugin

            if (plugin.stop) {
                await plugin.stop()
            }

            if (plugin.destroy) {
                await plugin.destroy()
            }

            this.states.set(n.id, PluginState.Unloaded)

        }

        for (const n of reloadChain) {

            const plugin = n.descriptor.plugin

            if (plugin.setup) {
                await plugin.setup(contextFactory(n.id))
            }

            if (plugin.start) {
                await plugin.start()
            }

            this.states.set(n.id, PluginState.Active)

        }

    }

}

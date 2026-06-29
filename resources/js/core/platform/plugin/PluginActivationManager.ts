import {PluginGraphNode} from "@/core/platform/plugin/graph/types";
import {PluginDescriptor} from "@/core/platform/plugin/types";
import {PluginContextFactory} from "@/core/platform/plugin/PluginContextFactory";
import {PluginState} from "@/core/platform/plugin/lifecycle/PluginState";

export class PluginActivationManager {

    private graph: Map<string, PluginGraphNode>;
    private descriptors: Map<string, PluginDescriptor>;
    private states: Map<string, PluginState>;
    constructor(
        private contextFactory: PluginContextFactory
    ) {}

    async activate(pluginId: string) {

        const state =
            this.states.get(pluginId)

        if (state === PluginState.Active) {
            return
        }

        const node =
            this.graph.get(pluginId)!

        for (const dep of node.dependencies) {

            await this.activate(dep)

        }

        const descriptor =
            this.descriptors.get(pluginId)!

        const ctx =
            this.contextFactory.get(pluginId)

        if (state !== PluginState.Initialized) {

            await descriptor.plugin.setup?.(ctx)

            this.states.set(pluginId, PluginState.Initialized)

        }

        await descriptor.plugin.start?.(ctx)

        this.states.set(pluginId, PluginState.Active)

    }

}

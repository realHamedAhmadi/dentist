import {PluginGraph} from "@/core/platform/plugin/graph/PluginGraph";
import {PluginDescriptor} from "@/core/platform/plugin/types";

export function buildGraph(descriptors: PluginDescriptor[]): PluginGraph {

    const graph = new PluginGraph()

    for (const d of descriptors) {
        graph.addPlugin(d)
    }

    for (const d of descriptors) {

        const manifest = d.manifest
        const deps = manifest.dependencies?.required ?? {}

        for (const depId in deps) {
            graph.addDependency(manifest.id, depId)
        }

    }

    return graph
}

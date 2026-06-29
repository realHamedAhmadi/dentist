import {PluginDescriptor} from "@/core/platform/plugin/types";
import {PluginGraphNode} from "@/core/platform/plugin/graph/types";

export class PluginGraph {

    private nodes = new Map<string, PluginGraphNode>()

    addPlugin(descriptor: PluginDescriptor) {

        const id = descriptor.manifest.id

        if (this.nodes.has(id)) {
            throw new Error(`Plugin '${id}' already exists in graph`)
        }

        this.nodes.set(id, {
            id,
            descriptor,
            dependencies: new Set(),
            dependents: new Set()
        })

    }

    addDependency(pluginId: string, dependencyId: string) {

        const plugin = this.nodes.get(pluginId)
        const dependency = this.nodes.get(dependencyId)

        if (!plugin || !dependency) {
            throw new Error(`Invalid dependency ${pluginId} -> ${dependencyId}`)
        }

        plugin.dependencies.add(dependencyId)
        dependency.dependents.add(pluginId)

    }

    getNode(id: string): PluginGraphNode | undefined {
        return this.nodes.get(id)
    }

    getDependencies(id: string): PluginGraphNode[] {

        const node = this.nodes.get(id)

        if (!node) return []

        return [...node.dependencies]
            .map(dep => this.nodes.get(dep))
            .filter(Boolean) as PluginGraphNode[]

    }

    getDependents(id: string): PluginGraphNode[] {

        const node = this.nodes.get(id)

        if (!node) return []

        return [...node.dependents]
            .map(dep => this.nodes.get(dep))
            .filter(Boolean) as PluginGraphNode[]

    }

    getAll(): PluginGraphNode[] {
        return [...this.nodes.values()]
    }

}

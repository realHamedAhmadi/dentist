import versionUtils from "@/core/shared/utils/version"
import {PluginDescriptor} from "@/core/platform/plugin/types";

export class PluginDependencyResolver {

    resolve(descriptors: PluginDescriptor[]): PluginDescriptor[] {

        const descriptorMap = new Map<string, PluginDescriptor>()

        // Build descriptor map by plugin id
        for (const d of descriptors) {
            descriptorMap.set(d.manifest.id, d)
        }

        const graph = new Map<string, Set<string>>()

        for (const descriptor of descriptors) {

            const manifest = descriptor.manifest

            const deps = new Set<string>()

            const required = manifest.dependencies?.required ?? {}
            const optional = manifest.dependencies?.optional ?? {}

            // Validate required dependencies
            for (const depId in required) {

                const depDescriptor = descriptorMap.get(depId)

                if (!depDescriptor) {
                    throw new Error(
                        `Plugin '${manifest.id}' requires missing plugin '${depId}'`
                    )
                }

                const range = required[depId]
                const version = depDescriptor.manifest.version

                if (!versionUtils.satisfies(version, range)) {
                    throw new Error(
                        `Plugin '${manifest.id}' requires ${depId}@${range} but found ${version}`
                    )
                }

                deps.add(depId)

            }

            // Validate optional dependencies
            for (const depId in optional) {

                const depDescriptor = descriptorMap.get(depId)

                if (!depDescriptor) continue

                const range = optional[depId]
                const version = depDescriptor.manifest.version

                if (!versionUtils.satisfies(version, range)) continue

                deps.add(depId)

            }

            graph.set(manifest.id, deps)

        }

        return this.topologicalSort(graph, descriptorMap)

    }

    private topologicalSort(
        graph: Map<string, Set<string>>,
        descriptorMap: Map<string, PluginDescriptor>
    ): PluginDescriptor[] {

        const visited = new Set<string>()
        const visiting = new Set<string>()
        const result: PluginDescriptor[] = []

        const visit = (id: string) => {

            if (visited.has(id)) return

            if (visiting.has(id)) {
                throw new Error(`Circular dependency detected at '${id}'`)
            }

            visiting.add(id)

            const deps = graph.get(id) ?? new Set()

            for (const dep of deps) {
                visit(dep)
            }

            visiting.delete(id)
            visited.add(id)

            const descriptor = descriptorMap.get(id)

            if (descriptor) {
                result.push(descriptor)
            }

        }

        for (const id of graph.keys()) {
            visit(id)
        }

        return result

    }

}

import type { I18nModuleNamespaceInput, IModuleNamespaceRegistry } from './types'

/**
 * In-memory module namespace registry.
 */
export class InMemoryModuleNamespaceRegistry implements IModuleNamespaceRegistry {
    private readonly modules = new Map<string, { basePath: string; namespaces: Set<string> }>()

    /**
     * Register module namespace mapping.
     */
    register(input: I18nModuleNamespaceInput): void {
        // Normalize values
        const moduleName = input.module.trim()
        const namespace = input.namespace.trim()
        let basePath = input.basePath.trim().replace(/\/+$/, '')
        basePath=!basePath?'/':basePath

        if (!moduleName) throw new Error('module is required')
        if (!namespace) throw new Error('namespace is required')
        const current = this.modules.get(moduleName)
        if (!current) {
            this.modules.set(moduleName, { basePath, namespaces: new Set([namespace]) })
            return
        }

        // Update basePath and merge namespace
        current.basePath = basePath
        current.namespaces.add(namespace)
    }

    /**
     * Get module entry.
     */
    get(module: string): { basePath: string; namespaces: Set<string> } | null {
        return this.modules.get(module) ?? null
    }
}

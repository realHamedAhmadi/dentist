import { HotkeyRegistry } from "./HotkeyRegistry"
import { HotkeyPriority } from "./types"

/**
 * Priority resolution order
 */
const PriorityOrder = [
    HotkeyPriority.User,
    HotkeyPriority.Plugin,
    HotkeyPriority.Core
]

/**
 * High performance hotkey resolver with cache
 */
export class HotkeyResolver {

    private cache = new Map<string, string | null>()

    private cacheVersion = -1

    constructor(protected readonly registry:HotkeyRegistry) {
    }

    /**
     * Resolve command for key combo
     */
    resolve(
        combo: string,
        contexts: string[],
        scopes: string[]
    ): string | null {

        const version = this.registry.getVersion()

        // invalidate cache when registry changes
        if (version !== this.cacheVersion) {
            this.cache.clear()
            this.cacheVersion = version
        }

        const cacheKey = `${combo}|${contexts.join(",")}|${scopes.join(",")}`

        const cached = this.cache.get(cacheKey)

        if (cached !== undefined) return cached

        const keyIndex = this.registry.getByRootKey(combo)

        if (!keyIndex) {
            this.cache.set(cacheKey, null)
            return null
        }

        for (const context of contexts) {

            const scopeMap = keyIndex.get(context)

            if (!scopeMap) continue

            for (const scope of scopes) {

                const priorityMap = scopeMap.get(scope)

                if (!priorityMap) continue

                for (const priority of PriorityOrder) {

                    const entry = priorityMap.get(priority)

                    if (entry) {

                        this.cache.set(cacheKey, entry.command)

                        return entry.command

                    }

                }

            }

        }

        this.cache.set(cacheKey, null)

        return null

    }

}

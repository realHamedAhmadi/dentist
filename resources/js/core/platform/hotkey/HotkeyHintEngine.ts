import { HotkeyRegistry } from "./HotkeyRegistry"
import { HotkeyHint } from "@/core/platform/hotkey/contracts/HotkeyEvent"

/**
 * Extracts possible next keys for a sequence
 */
export class HotkeyHintEngine {

    constructor(
        private readonly registry: HotkeyRegistry
    ) {}

    /**
     * Get hints for a sequence
     */
    getHints(sequence: string[]): HotkeyHint[] {

        const node = this.registry.getTrie().getNode(sequence)

        if (!node) {
            return []
        }

        const hints: HotkeyHint[] = []

        for (const [key, child] of node.children.entries()) {

            // Skip nodes without entries
            if (!child.entries.length) continue

            const first = child.entries[0]

            hints.push({
                key,
                description: first?.description,
                desKey: first?.desKey
            })

        }

        return hints
    }

}

import { HotkeyEntry } from "./types"

/**
 * Matching state for sequence resolution
 */
export type MatchState = "none" | "partial" | "full"

/**
 * Result of sequence matching
 */
export interface MatchResult {
    state: MatchState
    entries: HotkeyEntry[]
}

/**
 * Trie node optimized for hotkey matching
 */
class TrieNode {

    children = new Map<string, TrieNode>()

    entries: HotkeyEntry[] = []

}

/**
 * IDE-grade trie for hotkey sequence handling.
 *
 * Features:
 * - Multi-step sequences
 * - Partial match detection
 * - Full match detection
 * - Clean memory pruning
 * - Resolver-friendly
 */
export class HotkeySequenceTrie {

    private root = new TrieNode()

    /**
     * Insert new hotkey entry
     */
    insert(entry: HotkeyEntry): void {

        let node = this.root

        for (const combo of entry.sequence) {

            const key = this.normalize(combo)

            let next = node.children.get(key)

            if (!next) {

                next = new TrieNode()

                node.children.set(key, next)

            }

            node = next

        }

        node.entries.push(entry)

    }

    /**
     * Remove existing hotkey entry
     */
    remove(entry: HotkeyEntry): void {

        const stack: { parent: TrieNode; key: string }[] = []

        let node = this.root

        for (const combo of entry.sequence) {

            const key = this.normalize(combo)

            const next = node.children.get(key)

            if (!next) return

            stack.push({ parent: node, key })

            node = next

        }

        // remove entry reference
        node.entries = node.entries.filter(e => e !== entry)

        // prune empty nodes bottom-up
        for (let i = stack.length - 1; i >= 0; i--) {

            const { parent, key } = stack[i]

            const child = parent.children.get(key)

            if (!child) return

            if (child.entries.length > 0 || child.children.size > 0) {
                return
            }

            parent.children.delete(key)

        }

    }

    /**
     * Match current sequence state
     */
    match(sequence: string[]): MatchResult {

        let node = this.root
        for (const combo of sequence) {

            const key = this.normalize(combo)

            const next = node.children.get(key)

            if (!next) {

                return {
                    state: "none",
                    entries: []
                }

            }

            node = next

        }

        // partial match if children exist
        if (node.children.size > 0) {

            return {
                state: "partial",
                entries: node.entries
            }

        }

        // full match if entries exist
        if (node.entries.length > 0) {

            return {
                state: "full",
                entries: node.entries
            }

        }

        return {
            state: "none",
            entries: []
        }

    }

    /**
     * Returns the Trie node for a given sequence.
     * Used to inspect children (next possible keys) for hints/UI.
     * Returns null if the sequence path does not exist.
     */
    getNode(sequence: string[]): TrieNode | null {

        let node = this.root

        for (const combo of sequence) {

            const next = node.children.get(combo)

            if (!next) return null

            node = next

        }

        return node

    }

    /**
     * Reset traversal (for timeout handling)
     */
    clear(): void {

        // intentionally empty for future stateful mode

    }

    /**
     * Normalize key combo
     */
    private normalize(combo: string): string {

        return combo.toLowerCase().trim()

    }

}

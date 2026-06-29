import {
    HotkeyEntry,
    HotkeyContext,
    HotkeyScope,
    HotkeyPriority
} from "./types"

import {HotkeySequenceTrie} from "@/core/platform/hotkey/HotkeySequenceTrie"
import {HotkeyConflictDetector} from "@/core/platform/hotkey/HotkeyConflictDetector"
import {isDev} from "@/core/config/env";
import {Logger} from "@/core/facades/Logger";

/**
 * Central hotkey registry.
 *
 * Responsibilities:
 * - Store hotkeys grouped by root key
 * - Normalize sequences
 * - Prevent exact duplicates
 * - Sync with sequence trie
 * - Support resolver lookups
 */
export class HotkeyRegistry {
    private readonly index = new Map<string,
        Map<HotkeyContext,
            Map<HotkeyScope,
                Map<HotkeyPriority,
                    Map<string, HotkeyEntry>>>>>()

    private readonly trie = new HotkeySequenceTrie()

    private readonly conflictDetector = new HotkeyConflictDetector()

    private version = 0

    /**
     * Bulk register hotkeys
     */
    load(entries: HotkeyEntry[]): void {

        for (const entry of entries) {
            this.register(entry)
        }

    }

    /**
     * Register a hotkey entry
     */
    register(rawEntry: HotkeyEntry): void {

        if (!rawEntry.sequence || rawEntry.sequence.length === 0) {
            const m = `Invalid hotkey entry: action must define a sequence`
            if (isDev()) {
                throw new Error(m)
            }
            Logger.error(m);
            return;
        }

        // Normalize sequence once
        const entry: HotkeyEntry = {
            ...rawEntry,
            sequence: rawEntry.sequence.map(c => this.normalizeCombo(c))
        }

        const rootKey = entry.sequence[0]

        this.conflictDetector.detect(entry, this.index.get(rootKey))

        const priorityMap = this.ensurePath(rootKey, entry)

        const sequenceKey = entry.sequence.join(" ")

        let sequenceMap = priorityMap.get(entry.priority)

        if (!sequenceMap) {
            sequenceMap = new Map()
            priorityMap.set(entry.priority, sequenceMap)
        }

        if (sequenceMap.has(sequenceKey)) {
            const m = `Hotkey already registered: sequence="${sequenceKey}" ` +
                `command="${entry.command}" context="${entry.context}" scope="${entry.scope}" priority="${entry.priority}"`


            if (isDev()) {
                throw new Error(m)
            }
            Logger.channel(`Hotkey.register`).error(m,__location__)
            return;
        }

        sequenceMap.set(sequenceKey, entry)

        this.trie.insert(entry)

        this.version++

    }

    /**
     * Return full root-key tree for resolver
     */
    getByRootKey(rootKey: string) {

        return this.index.get(
            this.normalizeCombo(rootKey)
        )

    }

    /**
     * Get sequence trie
     */
    getTrie(): HotkeySequenceTrie {

        return this.trie

    }

    /**
     * Get registry version
     */
    getVersion(): number {

        return this.version

    }

    private ensurePath(
        rootKey: string,
        entry: HotkeyEntry
    ): Map<HotkeyPriority, Map<string, HotkeyEntry>> {

        let ctxMap = this.index.get(rootKey)

        if (!ctxMap) {
            ctxMap = new Map()
            this.index.set(rootKey, ctxMap)
        }

        let scopeMap = ctxMap.get(entry.context)

        if (!scopeMap) {
            scopeMap = new Map()
            ctxMap.set(entry.context, scopeMap)
        }

        let priorityMap = scopeMap.get(entry.scope)

        if (!priorityMap) {
            priorityMap = new Map()
            scopeMap.set(entry.scope, priorityMap)
        }

        return priorityMap

    }

    private normalizeCombo(combo: string): string {

        return combo.toLowerCase().trim()

    }

}

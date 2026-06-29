import {HotkeyEntry} from "./types"
import {isProd} from "@/core/config/env";

/**
 * Detect hotkey conflicts during registration
 */
export class HotkeyConflictDetector {

    /**
     * Check for potential hotkey conflicts
     */
    detect(entry: HotkeyEntry, keyIndex): void {
        if (isProd()) {
            return;
        }
        if (!keyIndex) return

        const scopeMap = keyIndex.get(entry.context)

        if (!scopeMap) return

        const priorityMap = scopeMap.get(entry.scope)

        if (!priorityMap) return

        // iterate existing priorities
        for (const existingEntry of priorityMap.entries()) {

            // ignore same command override
            if (existingEntry.command === entry.command) continue

            this.warn(entry, existingEntry)

        }

    }

    /**
     * Emit conflict warning
     */
    private warn(
        entry: HotkeyEntry,
        existingEntry: HotkeyEntry
    ): void {
        console.warn(
            `[HotkeyConflict] ${entry.key}`,
            {
                newCommand: entry.command,
                newSource: entry.source,
                existingCommand: existingEntry.command,
                existingSource: existingEntry.source
            }
        )

    }

}

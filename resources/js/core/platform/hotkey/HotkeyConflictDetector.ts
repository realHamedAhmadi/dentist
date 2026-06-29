import {HotkeyEntry} from "./types"
import {isProd} from "@/core/config/env";
import {DevLogger} from "@/core/facades/DevLogger";

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
            if (existingEntry.action === entry.action) continue

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
        DevLogger.channel('HotkeyConflict').warn(
            `Sequence with "${entry.sequence.join('|')}" conflict.`,
            {
                newAction: entry.action,
                newSource: entry.source,
                existingAction: existingEntry.action,
                existingSource: existingEntry.source
            }
        )

    }

}

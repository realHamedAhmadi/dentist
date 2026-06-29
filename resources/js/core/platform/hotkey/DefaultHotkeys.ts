import {HotkeyEntry, HotkeyPriority} from "./types"

/**
 * Core default hotkeys
 *
 * Notes:
 * - Uses sequence instead of key
 * - Each sequence is an array (supports multi-step bindings)
 * - source is required for plugin lifecycle management
 */
export const DefaultHotkeys: HotkeyEntry[] = [
    {
        sequence: ["alt+r"],
        action: 'app.save',
        context: "global",
        scope: "global",
        priority: HotkeyPriority.Core,
        source: "core"
    },

    {
        sequence: ["alt+f"],
        action: "app.search",
        context: "global",
        scope: "global",
        priority: HotkeyPriority.Core,
        source: "core"
    },
    {
        sequence: ["alt+n"],
        action: "entity.create",
        context: "list",
        scope: "panel",
        priority: HotkeyPriority.Core,
        source: "core"
    },
    {
        sequence: ["alt+n", "alt+p"],
        action: "entity.create",
        context: "list",
        scope: "panel",
        priority: HotkeyPriority.Core,
        source: "core"
    },

]

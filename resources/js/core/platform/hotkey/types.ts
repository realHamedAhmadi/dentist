import { HotkeyExecutable } from "@/core/platform/hotkey/contracts/HotkeyExecutable"

/**
 * Available hotkey contexts
 */
export type HotkeyContext =
    | "global"
    | "editor"
    | "list"
    | "modal"
    | (string & {}) // allow plugin-defined contexts

/**
 * Available hotkey scopes
 */
export type HotkeyScope =
    | "global"
    | "layout"
    | "panel"
    | (string & {}) // allow plugin-defined scopes

/**
 * Hotkey priority levels (typed, not numeric)
 */
export enum HotkeyPriority {
    Core = "core",
    Plugin = "plugin",
    User = "user"
}

/**
 * Hotkey source identifier
 */
export type HotkeySource =

    | "core"
    | "user"
    | `plugin:${string}`

/**
 * Hotkey definition contract
 */
export interface HotkeyEntry {

    /**
     * Sequence of key combos
     * Example: ["ctrl+k","ctrl+c"]
     */
    sequence: string[]

    action: HotkeyExecutable

    context: HotkeyContext

    scope: HotkeyScope

    priority: HotkeyPriority

    source: HotkeySource

    description?: string

    desKey?:string
}


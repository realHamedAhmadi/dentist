import { HotkeyExecutable } from "@/core/platform/hotkey/contracts/HotkeyExecutable"

export interface SequenceUpdatePayload {
    sequence: string[]
    interactionId: number
}

export interface SequenceTimeoutExecutePayload {
    executable: HotkeyExecutable
    interactionId: number
}

export interface SequenceHintsPayload {
    sequence: string[]
    hints: Array<{ key: string; command?: string }>
}

export interface RecordingPayload {
    sequence: string[]
}

/**
 * Hint item
 */
export interface HotkeyHint {
    key: string
    description?: string
    desKey?:string
}

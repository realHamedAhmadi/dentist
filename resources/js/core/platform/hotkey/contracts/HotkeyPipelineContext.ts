import { HotkeyExecutable } from "@/core/platform/hotkey/contracts/HotkeyExecutable"

export interface HotkeyPipelineContext {
    event: object,
    combo: string
    interactionId: number
    sequence: string[]
    sequenceState: "idle" | "partial" | "full" | "none"
    sequenceExecutable: HotkeyExecutable | null
    singleExecutable: HotkeyExecutable | null
    executed: boolean
}

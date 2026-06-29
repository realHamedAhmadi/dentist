import { EventBus } from "@/core/platform/event/EventBus"
import { HotkeyEvents } from "@/core/platform/tokens/hotkey"
import { SequenceHintsPayload } from "@/core/platform/hotkey/contracts/HotkeyEvent"
import { HotkeyHintEngine } from "@/core/platform/hotkey/HotkeyHintEngine"

/**
 * Emits sequence hints for UI
 */
export class HotkeyHintService {

    constructor(
        private readonly hintEngine: HotkeyHintEngine,
        private readonly eventBus: EventBus
    ) {}

    /**
     * Show hints for sequence
     */
    async showHints(sequence: string[]): Promise<void> {

        const hints = this.hintEngine.getHints(sequence)

        if (!hints.length) return

        const payload: SequenceHintsPayload = {
            sequence,
            hints
        }

        await Promise.resolve(
            this.eventBus.emit(
                HotkeyEvents.SequenceHintsShown,
                payload
            )
        )

    }

    /**
     * Hide hints for sequence
     */
    async hideHints() {
        await Promise.resolve(this.eventBus.emit(HotkeyEvents.SequenceHintsHidden))
    }

}

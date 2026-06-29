import {HotkeyRegistry} from "./HotkeyRegistry"
import {HotkeyEntry, HotkeyPriority} from "./types"
import {MatchResult} from "@/core/platform/hotkey/HotkeySequenceTrie"
import {EventBus} from "@/core/platform/event/EventBus"
import {HotkeyEvents} from "@/core/platform/tokens/hotkey"
import {DefaultHotkeyPolicy, IHotkeyPolicy} from "@/core/platform/hotkey/contracts/HotkeyPolicy";
import {HotkeyExecutable} from "@/core/platform/hotkey/contracts/HotkeyExecutable";
import {SequenceTimeoutExecutePayload, SequenceUpdatePayload} from "@/core/platform/hotkey/contracts/HotkeyEvent";

/**
 * Priority resolution order
 */
const PriorityOrder = [
    HotkeyPriority.User,
    HotkeyPriority.Plugin,
    HotkeyPriority.Core
]

/**
 * Production-grade hotkey sequence engine (stateless)
 *
 * - Resolves command immediately on full match
 * - On partial match determines fallback command and passes it to timer
 * - Timeout executes fallback ONLY if provided
 * - No hidden trie lookups inside timer
 * - Fully token-safe for overlapping timers
 */
export class HotkeySequenceEngine {

    private sequence: string[] = []

    private timer: number | null = null

    private readonly timeout = 1500

    private timerToken = 0

    constructor(
        private readonly registry: HotkeyRegistry,
        private readonly eventBus: EventBus,
        private readonly policy: IHotkeyPolicy = DefaultHotkeyPolicy
    ) {
    }

    /**
     * Handle next combo and determine match state
     */
    handle(
        combo: string,
        interactionId: number
    ): { state: "none" | "partial" | "full"; executable: HotkeyExecutable | null } {

        this.sequence.push(combo)

        const result = this.registry.getTrie().match(this.sequence) as MatchResult

        if (result.state === "none") {
            this.reset()
            return { state: "none", executable: null }
        }

        if (result.state === "partial") {
            this.emitSequenceUpdate({
                sequence: [...this.sequence],
                interactionId
            });

            const fallbackExecutable = this.resolveEntries(result.entries)
            this.startTimer(interactionId, fallbackExecutable ?? undefined)

            return { state: "partial", executable: null }
        }

        const executable = this.resolveEntries(result.entries)
        this.reset()
        console.log(result.state)
        return { state: "full", executable: executable ?? null }
    }

    /**
     * Resolve command by priority order
     */
    private resolveEntries(entries: HotkeyEntry[]): HotkeyExecutable | null {
        if (!entries.length) return null

        for (const priority of PriorityOrder) {
            const entry = entries.find((item) => item.priority === priority)
            if (entry) return entry.action
        }

        return null
    }

    /**
     * Emit partial-sequence update to UI layer
     */
    private emitSequenceUpdate(
        updatePayload: SequenceUpdatePayload
    ): void {

        void Promise.resolve(this.eventBus.emit(HotkeyEvents.SequenceUpdate, updatePayload))
    }

    /**
     * Emit timeout execution event
     */
    private emitSequenceTimeoutExecute(
        payload: SequenceTimeoutExecutePayload
    ): void {

        void Promise.resolve(this.eventBus.emit(HotkeyEvents.SequenceTimeoutExecute, payload))

    }

    /**
     * Start/reset timer — executes only if fallback is defined
     */
    private startTimer(interactionId: number, fallbackExecutable?: HotkeyExecutable): void {
        this.clearTimer()

        const token = ++this.timerToken
        this.timer = window.setTimeout(() => {
            if (token !== this.timerToken) return
            if (fallbackExecutable && this.policy.executeFallbackOnTimeout) {
                this.emitSequenceTimeoutExecute({
                    executable: fallbackExecutable,
                    interactionId
                })
            }
            this.reset()
        }, this.timeout)
    }

    /**
     * Reset everything: timer + sequence
     */
    private reset(): void {

        this.clearTimer()
        this.sequence = []
    }

    /**
     * Clear an active timer
     */
    private clearTimer(): void {

        if (!this.timer) return

        clearTimeout(this.timer)
        this.timer = null
    }

    /**
     * Public accessor for UI/debugging
     */
    getCurrentSequence(): string[] {
        return [...this.sequence]
    }
}

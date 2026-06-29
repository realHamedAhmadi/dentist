import { HotkeyRegistry } from "./HotkeyRegistry"
import { HotkeyEntry, HotkeyPriority } from "./types"
import { MatchResult } from "@/core/platform/hotkey/HotkeySequenceTrie"
import { EventBus } from "@/core/platform/event/EventBus"
import { HotkeyEvents } from "@/core/platform/tokens/hotkey"
import {DevLogger} from "@/core/facades/DevLogger";

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
        private readonly eventBus: EventBus
    ) {}

    /**
     * Handle next combo and determine match state
     */
    handle(combo: string): string | null {

        this.sequence.push(combo)
        const trie = this.registry.getTrie()
        const result = trie.match(this.sequence) as MatchResult

        // No match → reset fully
        if (result.state === "none") {
            this.reset()
            return null
        }

        // Partial match → update UI + start timeout with fallback
        if (result.state === "partial") {

            // Inform UI
            this.emitSequenceUpdate()
            // Determine fallback command for timeout execution
            const fallback = this.resolveEntries(result.entries)
            DevLogger.channel('HotKey.SequenceEngine').debug('Partial match and start timer',{fallback,__location__})
            // Start timer with fallback (optional)
            this.startTimer(fallback ?? undefined)

            return null
        }

        // Full match → execute immediately
        if (result.state === "full") {

            const command = this.resolveEntries(result.entries)

            this.reset()
            DevLogger.channel('HotKey.SequenceEngine').debug('Full match',{command,__location__})
            return command ?? null
        }

        return null
    }

    /**
     * Resolve command by priority order
     */
    private resolveEntries(
        entries: HotkeyEntry[]
    ): string | null {

        if (!entries.length) return null

        for (const p of PriorityOrder) {
            const match = entries.find(e => e.priority === p)
            if (match) return match.command
        }

        return null
    }

    /**
     * Emit partial-sequence update to UI layer
     */
    private emitSequenceUpdate(): void {

        this.eventBus.emit(
            HotkeyEvents.SequenceUpdate,
            [...this.sequence]
        )
    }

    /**
     * Emit timeout execution event
     */
    private emitSequenceTimeoutExecute(
        command: string
    ): void {

        this.eventBus.emit(
            HotkeyEvents.SequenceTimeoutExecute,
            command
        )
    }

    /**
     * Start/reset timer — executes only if fallback is defined
     */
    private startTimer(
        fallbackCommand?: string
    ): void {

        // Clear previous timer
        this.clearTimer()

        const token = ++this.timerToken

        this.timer = window.setTimeout(() => {

            // Skip outdated timers
            if (token !== this.timerToken) return

            // Execute fallback if provided
            if (fallbackCommand) {
                this.emitSequenceTimeoutExecute(fallbackCommand)
            }

            // Reset sequence + timer
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

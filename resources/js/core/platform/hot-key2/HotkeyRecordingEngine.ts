import { HotkeyRegistry } from "./HotkeyRegistry"
import { EventBus } from "@/core/platform/event/EventBus"

import {
    SequenceHintsPayload,
    RecordingPayload,
    HotkeyHint
} from "./HotkeyUXEvents"
import {HotkeyUXEvents} from '@/core/platform/tokens/hotkey'

/**
 * Handles hotkey recording and sequence hint logic
 *
 * UI rendering is delegated to EventBus listeners (React layer)
 */
export class HotkeyRecordingEngine {

    private recording = false

    constructor(
        private readonly registry: HotkeyRegistry,
        private readonly eventBus: EventBus
    ) {}

    /**
     * Show sequence hints
     */
    async showHints(sequence: string[]): Promise<void> {
        const hints = this.collectHints(sequence)

        if (!hints) return

        const payload: SequenceHintsPayload = {
            sequence,
            hints
        }

        await this.eventBus.emit(
            HotkeyUXEvents.SequenceHints,
            payload
        )

    }

    /**
     * Start recording mode
     */
    async startRecording(): Promise<void> {

        this.recording = true

        const payload: RecordingPayload = {

            sequence: []

        }

        await this.eventBus.emit(
            HotkeyUXEvents.RecordingStart,
            payload
        )

    }

    /**
     * Record next step
     */
    async recordStep(sequence: string[]): Promise<void> {

        if (!this.recording) return

        const payload: RecordingPayload = {

            sequence

        }

        await this.eventBus.emit(
            HotkeyUXEvents.RecordingUpdate,
            payload
        )

    }

    /**
     * Stop recording
     */
    async stopRecording(): Promise<void> {

        if (!this.recording) return

        this.recording = false

        await this.eventBus.emit(
            HotkeyUXEvents.RecordingStop
        )

    }

    /**
     * Check recording mode
     */
    isRecording(): boolean {

        return this.recording

    }

    /**
     * Collect next possible keys from trie
     */
    private collectHints(sequence: string[]): HotkeyHint[] | null {

        const trie = this.registry.getTrie()

        const node = trie.getNode(sequence)

        if (!node) return null

        const hints: HotkeyHint[] = []

        for (const [key, child] of node.children.entries()) {

            const entry = child.entries[0]

            hints.push({
                key,
                command: entry?.command
            })

        }

        return hints

    }

}

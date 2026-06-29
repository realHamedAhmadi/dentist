import { EventBus } from "@/core/platform/event/EventBus"

import {
    RecordingPayload,
} from "@/core/platform/hotkey/contracts/HotkeyEvent"
import {HotkeyEvents} from '@/core/platform/tokens/hotkey'

/**
 * Handles hotkey recording and sequence hint logic
 *
 * UI rendering is delegated to EventBus listeners (React layer)
 */
export class HotkeyRecordingEngine {

    private recording = false
    private recordedSequence: string[] = []

    constructor(
        private readonly eventBus: EventBus
    ) {}

    /**
     * Start recording mode
     */
    async startRecording(): Promise<void> {

        this.recording = true

        const payload: RecordingPayload = {
            sequence: []
        }

        await Promise.resolve(this.eventBus.emit(
            HotkeyEvents.RecordingStart,
            payload
        ))
    }

    /**
     * Record next step
     */
    async recordStep(sequence: string[]): Promise<void> {
        if (!this.recording) return
        const payload: RecordingPayload = { sequence}
        await Promise.resolve(this.eventBus.emit(HotkeyEvents.RecordingUpdate, payload))
    }

    /**
     * Record combo
     */
    async recordCombo(combo: string): Promise<void> {
        if (!this.recording) return
        this.recordedSequence.push(combo)
        const payload: RecordingPayload = { sequence: [...this.recordedSequence] }
        await Promise.resolve(this.eventBus.emit(HotkeyEvents.RecordingUpdate, payload))
    }

    /**
     * Stop recording
     */
    async stopRecording(): Promise<void> {

        if (!this.recording) return
        this.recording = false

        await Promise.resolve(this.eventBus.emit(
            HotkeyEvents.RecordingStop
        ))

    }

    /**
     * Toggle recording
     */
    async toggleRecording():Promise<void> {
        if (this.isRecording()){
            await this.stopRecording();
          return;
        }
        await this.startRecording();
    }

    /**
     * Check recording mode
     */
    isRecording(): boolean {

        return this.recording

    }
}

import { NextFunction } from "@/core/pipeline/types"
import { HotkeyPipelineContext } from "@/core/platform/hotkey/contracts/HotkeyPipelineContext"
import { HotkeyRecordingEngine } from "@/core/platform/hotkey/HotkeyRecordingEngine"
import { IHotkeyPolicy } from "@/core/platform/hotkey/contracts/HotkeyPolicy"
import {HotkeySequenceEngine} from "@/core/platform/hotkey/HotkeySequenceEngine";

/**
 * Handles recording mode before any other stage
 */
export class RecordingMiddleware {
    constructor(
        private readonly recordingEngine: HotkeyRecordingEngine,
        private readonly sequenceEngine: HotkeySequenceEngine,
        private readonly policy: IHotkeyPolicy
    ) {}

    async handle(context: HotkeyPipelineContext, next: NextFunction<HotkeyPipelineContext, void>): Promise<void> {
        if (!this.recordingEngine.isRecording()) {
            await next(context)
            return
        }
        if (this.policy.preventDefaultOnRecording) context.event.preventDefault()
        await this.recordingEngine.recordStep(context.sequence)
    }
}

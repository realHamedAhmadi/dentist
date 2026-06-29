import { NextFunction } from "@/core/pipeline/types"
import { HotkeyPipelineContext } from "@/core/platform/hotkey/contracts/HotkeyPipelineContext"
import { HotkeySequenceEngine } from "@/core/platform/hotkey/HotkeySequenceEngine"
import { IHotkeyPolicy } from "@/core/platform/hotkey/contracts/HotkeyPolicy"

/**
 * Resolves trie sequences and stores executable when matched
 */
export class SequenceMiddleware {
    constructor(
        private readonly sequenceEngine: HotkeySequenceEngine,
        private readonly policy: IHotkeyPolicy
    ) {}

    async handle(context: HotkeyPipelineContext, next: NextFunction<HotkeyPipelineContext, void>): Promise<void> {
        const result = this.sequenceEngine.handle(context.combo, context.interactionId)
        if (result.state === "partial") {
            context.sequenceState = "partial"
            if (this.policy.preventDefaultOnPartial) context.event.preventDefault()
            await next(context)
            return
        }

        if (result.state === "full" && result.executable) {
            context.sequenceState = "full"
            context.sequenceExecutable = result.executable
            if (this.policy.preventDefaultOnFull) context.event.preventDefault()
            await next(context)
            return
        }

        context.sequenceState = "none"
        await next(context)
    }
}

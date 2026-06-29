import { NextFunction } from "@/core/pipeline/types"
import { HotkeyPipelineContext } from "@/core/platform/hotkey/contracts/HotkeyPipelineContext"
import { HotkeyActionInvoker } from "@/core/platform/hotkey/HotkeyActionInvoker"

/**
 * Invokes resolved executable (sequence first, then single fallback)
 */
export class ExecuteMiddleware {
    constructor(private readonly invoker: HotkeyActionInvoker) {}

    async handle(context: HotkeyPipelineContext, _next: NextFunction<HotkeyPipelineContext, void>): Promise<void> {
        const executable = context.sequenceExecutable ?? context.singleExecutable
        if (!executable) return

        await this.invoker.invoke(executable, {
            combo: context.combo,
            sequence: context.sequence,
            interactionId: context.interactionId
        })
        context.executed = true
    }
}

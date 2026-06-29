import { NextFunction } from "@/core/pipeline/types"
import { HotkeyPipelineContext } from "@/core/platform/hotkey/contracts/HotkeyPipelineContext"
import { HotkeyResolver } from "@/core/platform/hotkey/HotkeyResolver"
import { HotkeyContextStack } from "@/core/platform/hotkey/HotkeyContextStack"
import { HotkeyScopeStack } from "@/core/platform/hotkey/HotkeyScopeStack"
import { IHotkeyPolicy } from "@/core/platform/hotkey/contracts/HotkeyPolicy"

/**
 * Resolves single hotkeys only when sequence did not produce executable
 */
export class SingleHotkeyMiddleware {
    constructor(
        private readonly resolver: HotkeyResolver,
        private readonly contextStack: HotkeyContextStack,
        private readonly scopeStack: HotkeyScopeStack,
        private readonly policy: IHotkeyPolicy
    ) {}

    async handle(context: HotkeyPipelineContext, next: NextFunction<HotkeyPipelineContext, void>): Promise<void> {
        if (context.sequenceExecutable) {
            await next(context)
            return
        }

        const executable = this.resolver.resolve(
            context.combo,
            this.contextStack.getStack(),
            this.scopeStack.getStack()
        )

        if (executable) {
            context.singleExecutable = executable
            if (this.policy.preventDefaultOnSingle) context.event.preventDefault()
        }

        await next(context)
    }
}

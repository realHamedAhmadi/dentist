import { HotkeyPipelineContext } from "@/core/platform/hotkey/contracts/HotkeyPipelineContext"
import { NextFunction } from "@/core/pipeline/types"

/**
 * Stops pipeline when keyboard focus is on editable elements
 */
export class IgnoreEditableMiddleware {
    async handle(context: HotkeyPipelineContext, next: NextFunction<HotkeyPipelineContext, void>): Promise<void> {
        const target = context.event.target as HTMLElement | null
        if (!target) return next(context)

        const tag = target.tagName
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
        if (target.isContentEditable) return
        if (target.getAttribute("role") === "textbox") return

        await next(context)
    }
}

// core/platform/hot-key/HotkeyActionInvoker.ts
import { CommandBus } from "@/core/platform/command/CommandBus"
import {
    HotkeyExecutable,
    HotkeyExecutionContext,
    HotkeyFunctionExecutable,
    HotkeyClassConstructor,
    HotkeyClassExecutable, HotkeyCommandExecutablePayload
} from "@/core/platform/hotkey/contracts/HotkeyExecutable"
import {IApplication} from "@/core/platform/application/types";
import {HotkeyEvents} from "@/core/platform/tokens/hotkey";
import {EventBus} from "@/core/platform/event/EventBus";

/**
 * Executes any supported hotkey executable type
 */
export class HotkeyActionInvoker {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus:EventBus,
        private readonly app: IApplication,
    ) {}

    /**
     * Dispatch executable using the proper strategy
     */
    async invoke(executable: HotkeyExecutable, context: HotkeyExecutionContext): Promise<void> {

        await Promise.resolve(this.eventBus.emit(HotkeyEvents.SequenceExecuted))

        if (typeof executable === "string") {
            const payload:HotkeyCommandExecutablePayload={
                context,
                app:this.app
            }
            await Promise.resolve(this.commandBus.execute(executable,payload))
            return
        }

        if (this.isFunctionExecutable(executable)) {
            const fn = executable as HotkeyFunctionExecutable
            await Promise.resolve(fn(context,this.app))
            return
        }

        const ctor = executable as HotkeyClassConstructor
        const instance = this.resolveClassInstance(ctor)
        await Promise.resolve(instance.execute(context,this.app))
    }

    private resolveClassInstance(ctor: HotkeyClassConstructor): HotkeyClassExecutable {
        if (!this.app) return new ctor()

        try {
            const resolved = this.app.make<HotkeyClassExecutable>(ctor as any)
            if (resolved) return resolved
        } catch (_) {
            // ignore container miss
        }

        return new ctor()
    }

    private isFunctionExecutable(value: unknown): boolean {
        return typeof value === "function" && (!value.prototype || !value.prototype.execute)
    }
}

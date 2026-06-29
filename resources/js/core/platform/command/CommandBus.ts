import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {Tracer} from "@/core/facades/Tracer";

export class CommandBus {

    constructor(
        private bus: MessageBus,
        private registry: CommandRegistry
    ) {}

    register(
        command: string,
        handler: Function
    ) {

        this.registry.setHandler(
            command,
            handler,
            null
        )

    }

    async execute(
        command: string,
        payload?: unknown,
        meta?: any
    ) {
        return Tracer.runAsync(
            `command:${command}`,
            () => this.bus.dispatch({
                kind: "command",
                type: command,
                payload,
                meta
            }),
        )
    }


}

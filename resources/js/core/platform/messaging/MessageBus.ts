import {IMessage, MessageMiddleware} from "@/core/platform/messaging/types";
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {Logger} from "@/core/facades/Logger";
import {isDev} from "@/core/config/env";

/**
 * Central messaging bus responsible for dispatching
 * events, commands, and queries through middleware pipeline.
 *
 * Supports:
 * - Multi-subscriber events
 * - Single handler commands
 * - Single handler queries
 * - Plugin-safe execution isolation
 */
export class MessageBus {

    private middlewares: MessageMiddleware[] = [];

    constructor(
        private readonly eventRegistry: EventRegistry,
        private readonly commandRegistry: CommandRegistry,
        private readonly queryRegistry: QueryRegistry,
        private readonly pipelineFactory: PipelineFactory
    ) {
    }

    /**
     * Register middleware
     */
    use(middleware: MessageMiddleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Dispatch message through middleware pipeline
     */
    async dispatch(message: IMessage) {

        return this.pipelineFactory
            .create<IMessage, any>()
            .send(message)
            .through(this.middlewares)
            .then(msg => this.execute(msg));
    }

    /**
     * Execute message after middleware pipeline
     */
    private async execute(message: IMessage) {

        switch (message.kind) {

            case "event":
                return this.executeEvent(message);

            case "command":
                return this.executeCommand(message);

            case "query":
                return this.executeQuery(message);

            default:
                throw new Error(`Unknown message kind: ${message.kind}`);
        }
    }

    /**
     * Execute event (multi-subscriber, plugin-safe)
     */
    private async executeEvent(message: IMessage) {

        const entries =
            this.eventRegistry.getHandlersOf(message.type);

        if (!entries || entries.size === 0) return;

        // Execute all handlers in parallel
        await Promise.all(
            [...entries].map(async entry => {
                try {
                    await entry.handler(message);
                } catch (err) {
                    Logger.channel('eventBus').error(
                        `crashed on event "${message.type}"`,
                        {err, plugin: entry?.pluginId,__location__}
                    );
                }
            })
        );
    }

    /**
     * Execute command (single handler)
     */
    private async executeCommand(message: IMessage) {

        const handler =
            this.commandRegistry.getHandlerOf(message.type);

        if (!handler) {

            const m = `Command handler not found for "${message.type}"`;

            if (isDev()) {
                throw new Error(m);
            }

            Logger.channel('commandBus').error(m,__location__);

            // Stop execution safely in production
            return;
        }

        return handler(message);
    }


    /**
     * Execute query (single handler, returns value)
     */
    private async executeQuery(message: IMessage) {

        const handler =
            this.queryRegistry.getHandlerOf(message.type);

        if (!handler) {

            const m = `Query handler not found for "${message.type}"`

            if (isDev()) {
                throw new Error(m);
            }

            Logger.channel('queryBus').error(m,__location__);

            // Stop execution safely in production
            return;
        }

        return handler(message);
    }
}

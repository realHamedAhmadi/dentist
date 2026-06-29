import { PluginActivationManager } from "@/core/platform/plugin/PluginActivationManager";
import { CommandRegistry } from "@/core/platform/command/CommandRegistry";
import { QueryRegistry } from "@/core/platform/query/QueryRegistry";
import { EventRegistry } from "@/core/platform/event/EventRegistry";

import { IMessage } from "@/core/platform/messaging/types";
import { IPipe, NextFunction } from "@/core/pipeline/types";

/**
 * Middleware that ensures the plugin owning a message handler
 * is activated before the message is processed.
 *
 * Supports:
 * - command handlers
 * - query handlers
 * - event handlers (multiple plugins)
 */
export class PluginActivationMiddleware implements IPipe<IMessage, unknown> {

    constructor(
        private readonly activation: PluginActivationManager,
        private readonly events: EventRegistry,
        private readonly commands: CommandRegistry,
        private readonly queries: QueryRegistry
    ) {}

    /**
     * Activate plugin owners before message execution
     */
    async handle<R>(
        message: IMessage,
        next: NextFunction<IMessage, R>
    ): Promise<R> {

        switch (message.kind) {

            case "command": {

                const pluginId = this.commands.getOwnerOf(message.type);

                if (pluginId) {
                    // Activate plugin owning this command handler
                    await this.activation.activate(pluginId);
                }

                break;
            }

            case "query": {

                const pluginId = this.queries.getOwnerOf(message.type);

                if (pluginId) {
                    // Activate plugin owning this query handler
                    await this.activation.activate(pluginId);
                }

                break;
            }

            case "event": {

                const owners = this.events.getOwnersOf(message.type);

                if (owners && owners.length > 0) {

                    for (const entry of owners) {
                        // Activate each plugin listening to this event
                        await this.activation.activate(entry.pluginId);
                    }

                }

                break;
            }

        }

        // Continue pipeline
        return next(message);
    }
}

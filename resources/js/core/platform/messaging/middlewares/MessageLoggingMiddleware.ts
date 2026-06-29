import {IMessage} from "@/core/platform/messaging/types";
import {ILogger} from "@/core/logger/types";
import {IPipe, NextFunction} from "@/core/pipeline/types";
import {Logger} from "@/core/facades/Logger";

/**
 * Middleware that logs message lifecycle using a dedicated "messaging" logger channel.
 * This supports:
 * - Start, success, error logs
 * - Duration timing
 * - Correlation ID propagation
 * - Pipeline-style next(message)
 */
export class MessageLoggingMiddleware implements IPipe<IMessage, unknown> {

    private readonly msgLogger: ILogger=Logger.channel("messaging");

    /**
     * Handle message lifecycle logging
     */
    async handle<R>(
        message: IMessage,
        next: NextFunction<IMessage, R>
    ): Promise<R> {

        const start = performance.now();

        // Log start
        this.msgLogger.info("message started", {
            messageType: message.type,
            plugin:message.meta?.plugin,
            correlationId: message.meta?.correlationId
        });

        try {

            // Continue pipeline
            const result = await next(message);

            const duration = performance.now() - start;

            // Log success
            this.msgLogger.info("message completed", {
                messageType: message.type,
                plugin:message.meta?.plugin,
                duration,
                correlationId: message.meta?.correlationId
            });

            return result;

        } catch (error) {

            const duration = performance.now() - start;

            // Log failure
            this.msgLogger.error("message failed", {
                messageType: message.type,
                plugin:message.meta?.plugin,
                duration,
                correlationId: message.meta?.correlationId,
                error: error instanceof Error ? error.message : error
            });

            throw error;
        }
    }
}

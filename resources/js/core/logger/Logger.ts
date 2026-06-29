import { ILogger, LogEntry, LoggerMiddleware, LogLevel, LogTransport } from "@/core/logger/types";
import { PipelineFactory } from "@/core/pipeline/PipelineFactory";
import {Tracer} from "@/core/facades/Tracer";
import {Session} from "@/core/session/Session";
import {UserContext} from "@/core/user/UserContext";
import {getEnvMode} from "@/core/config/env";

/**
 * Core logger implementation.
 * Uses PipelineFactory to process log entries
 * through a unified middleware pipeline system.
 */
export class Logger implements ILogger {

    /** Internal middleware list */
    private middlewares: LoggerMiddleware[] = [];

    constructor(
        private readonly transports: LogTransport[],
        private readonly pipelineFactory: PipelineFactory,
        private readonly preset: Partial<LogEntry> = {}
    ) {}

    /** Register middleware */
    use(middleware: LoggerMiddleware): void {
        this.middlewares.push(middleware);
    }

    /** Create a child logger with preset channel */
    channel(type: string): ILogger {
        return new Logger(
            this.transports,
            this.pipelineFactory,
            {
                ...this.preset,
                channel: type
            }
        );
    }

    /** Base log method */
    async log(
        level: LogLevel,
        message: string,
        option?: Partial<LogEntry>
    ): Promise<void> {
        const {
            meta,
            locationId,
            module,
            moduleVersion,
            file,
            line,
            column,
            __location__ = {},
            ...others
        } = option ?? {}

        const entry: LogEntry = {
            level,
            message,
            ...this.preset,
            sessionId: Session.getId(),
            userId: UserContext.getUserId(),
            env: getEnvMode(),
            timestamp: Date.now(),
            locationId: locationId ?? __location__?.locationId ?? null,
            module: module ?? __location__?.module ?? null,
            moduleVersion: moduleVersion ?? __location__?.moduleVersion ?? null,
            file: file ?? __location__?.file ?? null,
            line: line ?? __location__?.line ?? null,
            column: column ?? __location__?.column ?? null,
            meta: {
                ...(meta ?? {}),
                ...others,
            },
        }

    // Run through middleware pipeline
        const processed = await this.pipelineFactory
            .create<LogEntry, LogEntry>()
            .send(entry)
            .through(this.middlewares)
            .then(entry => entry);

        // Dispatch to transports
        for (const transport of this.transports) {
            await transport.write(processed);
        }
    }

    /** Level shortcuts */

    info(message: string, option?: Partial<LogEntry>): Promise<void> {
        return this.log("info", message, option);
    }

    debug(message: string, option?: Partial<LogEntry>): Promise<void> {
        return this.log("debug", message, option);
    }

    warn(message: string, option?: Partial<LogEntry>): Promise<void> {
        return this.log("warn", message, option);
    }

    error(message: string, option?: Partial<LogEntry>): Promise<void> {
        return this.log("error", message, option);
    }
}

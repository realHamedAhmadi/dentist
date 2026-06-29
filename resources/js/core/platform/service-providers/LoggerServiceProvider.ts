import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {Logger} from "@/core/logger/Logger";
import {ConsoleTransport} from "@/core/logger/transports/console.transport";
import {BatchTransport} from "@/core/logger/transports/batch.transport";
import {isDev} from "@/core/config/env";
import {LoggerTransportResolver} from "@/core/logger/LoggerTransportResolver";
import {DEV_LOGGER, LOGGER_STRATEGY} from "@/core/platform/tokens/logger";
import {DevLoggerStrategy} from "@/core/logger/LoggerStrategy/DevLoggerStrategy";
import {ProdLoggerStrategy} from "@/core/logger/LoggerStrategy/ProdLoggerStrategy";
import {NoopLogger} from "@/core/logger/NoopLogger";
import {ColorConsoleFormatter} from "@/core/logger/formatter/ColorConsoleFormatter";
import {ILogger} from "@/core/logger/types";
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {PerformanceLoggerMiddleware} from "@/core/logger/middlewares/PerformanceLoggerMiddleware";
import {RedactSensitiveDataMiddleware} from "@/core/logger/middlewares/RedactSensitiveDataMiddleware";

export class LoggerServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton(ColorConsoleFormatter, ColorConsoleFormatter);
        this.app.singleton(ConsoleTransport, () =>
            new ConsoleTransport(this.app.make(ColorConsoleFormatter))
        )
        this.app.singleton(BatchTransport, () => new BatchTransport("/api/logs"))
        this.app.singleton(DevLoggerStrategy, DevLoggerStrategy);
        this.app.singleton(ProdLoggerStrategy, ProdLoggerStrategy);
        this.app.singleton(LOGGER_STRATEGY, () => {
            if (isDev()) {
                return this.app.make(DevLoggerStrategy);
            }
            return this.app.make(ProdLoggerStrategy);
        })
        this.app.singleton(LoggerTransportResolver, () =>
            // Inject container into resolver for flexibility
            new LoggerTransportResolver(this.app, this.app.make(LOGGER_STRATEGY))
        );
        this.app.singleton(Logger, () => {
            const transports = this.app.make(LoggerTransportResolver).resolve();
            const logger = new Logger(
                transports,
                this.app.make(PipelineFactory)
            );
            this.setMiddlewares(logger);
            return logger;
        })

        this.app.singleton(DEV_LOGGER, () => {
            if (!isDev()) {
                return new NoopLogger();
            }
            const resolver = new LoggerTransportResolver(
                this.app,
                this.app.make(DevLoggerStrategy)
            );

            return new Logger(
                resolver.resolve(),
                this.app.make(PipelineFactory)
            );
        });

    }

    protected setMiddlewares(logger: ILogger) {
        logger.use(new PerformanceLoggerMiddleware());
        logger.use(new RedactSensitiveDataMiddleware());
    }
}

import {ILogger, LogLevel} from "@/core/logger/types";

export class NoopLogger implements ILogger {
    log(level: LogLevel, message: string, option?: object): void {
    }

    debug(message: string, option?: object): void {
    }

    error(message: string, option?: object): void {
    }

    info(message: string, option?: object): void {
    }

    warn(message: string, option?: object): void {
    }

    channel(type: string): ILogger {
        return this;
    }
}

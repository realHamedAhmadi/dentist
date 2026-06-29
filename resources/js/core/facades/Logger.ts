import {Facade} from "@/core/facades/Facade";
import {Logger as MainLogger} from "@/core/logger/Logger";
import {ILogger, LogLevel} from "@/core/logger/types";

export class Logger extends Facade {
    protected static getToken() {
        return MainLogger
    }

    static log(level: LogLevel, message: string, option?: object): void {
        this.resolve().info(level, message, option)
    }

    static debug(message: string, option?: object): void {
        this.resolve().debug(message, option)
    }

    static error(message: string, option?: object): void {
        this.resolve().error(message, option)
    }

    static info(message: string, option?: object): void {
        this.resolve().info(message, option)
    }

    static warn(message: string, option?: object): void {
        this.resolve().warn(message, option)
    }

    static channel(type: string): ILogger {
        return this.resolve().channel(type);
    }
}

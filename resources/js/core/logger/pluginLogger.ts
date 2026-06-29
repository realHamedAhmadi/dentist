import {Logger} from "@/core/logger/Logger";

export function createPluginLogger(plugin: string, logger: Logger): Logger {
    return {
        info: (msg, option) => logger.info(msg, {plugin, ...option}),
        debug: (msg, option) => logger.debug(msg, {plugin, ...option}),
        warn: (msg, option) => logger.warn(msg, {plugin, ...option}),
        error: (msg, option) => logger.error(msg, {plugin, ...option}),
    } as Logger
}

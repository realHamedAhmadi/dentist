import {LoggerStrategy, LogTransport} from "@/core/logger/types";
import {IContainer} from "@/core/platform/container/types";
import {ConsoleTransport} from "@/core/logger/transports/console.transport";

export class DevLoggerStrategy implements LoggerStrategy {

    resolve(container: IContainer): LogTransport[] {
        return [
            container.make(ConsoleTransport)
        ];
    }
}

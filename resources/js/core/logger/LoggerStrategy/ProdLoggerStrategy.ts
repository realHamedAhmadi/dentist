import {LoggerStrategy, LogTransport} from "@/core/logger/types";
import {IContainer} from "@/core/platform/container/types";
import {BatchTransport} from "@/core/logger/transports/batch.transport";

export class ProdLoggerStrategy implements LoggerStrategy {

    resolve(container: IContainer): LogTransport[] {
        return [
            container.make(BatchTransport)
        ];
    }
}

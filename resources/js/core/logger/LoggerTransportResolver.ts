import {IContainer} from "@/core/platform/container/types";
import {LoggerStrategy, LogTransport} from "@/core/logger/types";

export class LoggerTransportResolver {

    constructor(
        private container: IContainer,
        private strategy: LoggerStrategy
    ) {}

    resolve(): LogTransport[] {
        return this.strategy.resolve(this.container);
    }
}

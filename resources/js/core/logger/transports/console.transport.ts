import {LogEntry, LogFormatter, LogTransport} from "../types"

export class ConsoleTransport
    implements LogTransport {
    constructor(
        private readonly formatter: LogFormatter<string>
    ) {}
    write(entry: LogEntry): void {
        const message = this.formatter.format(entry)
        console.log(message,entry)
    }
}

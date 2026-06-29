import {LogEntry, LogTransport} from "../types"

export class BatchTransport
    implements LogTransport {

    private queue: LogEntry[] = []

    constructor(
        private endpoint: string,
        private batchSize = 50,
        private flushInterval = 5000
    ) {

        setInterval(() => {
            this.flush()
        }, this.flushInterval)

    }

    write(entry: LogEntry): void {

        this.queue.push(entry)

        if (this.queue.length >= this.batchSize) {
            this.flush()
        }

    }

    async flush() {

        if (!this.queue.length)
            return

        const batch = [...this.queue]

        this.queue = []

        try {

            await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(batch)
            })

        } catch (error) {

            console.error(
                "log batch failed",
                error
            )

        }

    }

}

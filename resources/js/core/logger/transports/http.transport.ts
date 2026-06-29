import {LogEntry, LogTransport} from "../types"

export class HttpTransport
    implements LogTransport {

    constructor(
        private endpoint: string
    ) {
    }

    async write(entry: LogEntry) {

        await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entry)
        })

    }

}

import {LogEntry, LogFormatter} from "@/core/logger/types";

export class PrettyConsoleFormatter implements LogFormatter<string> {

    format(entry: LogEntry): string {

        const time = new Date(entry.timestamp).toLocaleTimeString()

        const parts: string[] = []

        parts.push(`[${time}]`)
        parts.push(`[${entry.level.toUpperCase()}]`)

        if (entry.plugin) {
            parts.push(`[${entry.plugin}]`)
        }

        parts.push(entry.message)

        if (entry.duration) {
            parts.push(`(${entry.duration}ms)`)
        }

        if (entry.correlationId) {
            parts.push(`cid=${entry.correlationId}`)
        }

        if (entry.meta) {
            parts.push(JSON.stringify(entry.meta))
        }

        // Join all formatted parts
        return parts.join(" ")

    }

}

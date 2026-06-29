import {LogEntry, LogFormatter} from "@/core/logger/types";

export class JsonLogFormatter implements LogFormatter<Record<string, unknown>> {

    format(entry: LogEntry): Record<string, unknown> {

        // Convert structured log entry into JSON payload
        return {
            id: entry.id,
            timestamp: entry.timestamp,
            level: entry.level,
            message: entry.message,
            plugin: entry.plugin ?? null,
            correlationId: entry.correlationId ?? null,
            messageType: entry.messageType ?? null,
            duration: entry.duration ?? null,
            meta: entry.meta ?? null
        }

    }

}

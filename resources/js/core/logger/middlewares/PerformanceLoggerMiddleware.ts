import { IPipe, NextFunction } from "@/core/pipeline/types"
import { LogEntry } from "@/core/logger/types"

/**
 * Calculates execution duration if meta.startTime exists.
 * This middleware enriches the log entry with a duration field.
 */
export class PerformanceLoggerMiddleware implements IPipe<LogEntry, LogEntry> {

    async handle(
        entry: LogEntry,
        next: NextFunction<LogEntry, LogEntry>
    ): Promise<LogEntry> {

        // Read start time from metadata
        const start = entry.meta?.["startTime"]

        let enrichedEntry = entry

        if (typeof start === "number") {

            // Calculate execution duration
            const duration = Date.now() - start

            // Create immutable enriched log entry
            enrichedEntry = {
                ...entry,
                duration
            }
        }

        // Continue pipeline with enriched entry
        return next(enrichedEntry)
    }

}

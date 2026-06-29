import {LogEntry, LogFormatter} from "@/core/logger/types";

const colors = {
    debug: "\x1b[36m",
    info: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m",
};

/**
 * Console formatter that outputs colored and human-readable log messages.
 */
export class ColorConsoleFormatter implements LogFormatter<string> {
    format(entry: LogEntry): string {
        // Format timestamp for console readability
        const time = new Date(entry.timestamp).toLocaleTimeString();

        // Resolve color based on log level
        const color = colors[entry.level] ?? "";

        // Colorize level label only
        const level = `${color}${entry.level.toUpperCase()}${colors.reset}`;

        const parts: string[] = [];

        // Base prefix
        parts.push(`[${time}]`);
        parts.push(`[${level}]`);

        // Optional structured labels
        if (entry.channel) {
            parts.push(`[channel: ${entry.channel}]`);
        }

        if (entry.module) {
            parts.push(`[module: ${entry.module}]`);
        }

        if (entry.type) {
            parts.push(`[type: ${entry.type}]`);
        }

        // Main message
        parts.push(entry.message);

        // Location + PhpStorm link
        if (entry.file) {
            // Show readable location
            //parts.push(`${entry.file}:${entry.line ?? 1}:${entry.column ?? 1}`);

            // Add clickable IDE deep link
            parts.push(`\n${this.toPhpStormHttpLink(entry.file, entry.line, entry.column)}`);
        }

        // Join formatted segments
        return parts.join(" ");
    }

    /**
     * Build PhpStorm deep-link from file location.
     */
    toPhpStormLink(file: string, line?: number, column?: number): string {
        // Encode values for URL safety
        const f = encodeURIComponent(file);
        const l = encodeURIComponent(String(line ?? 1));
        const c = encodeURIComponent(String(column ?? 1));
        return `phpstorm://open?file=${f}&line=${l}&column=${c}`;
    }

    /**
     * Build PhpStorm built-in server link with file/line/column query params.
     */
    toPhpStormHttpLink(file: string, line?: number, column?: number): string {
        // Normalize Windows separators
        const normalized = file.replace(/\\/g, "/");

        // Encode query values safely
        const fileParam = encodeURIComponent(normalized);
        const lineParam = encodeURIComponent(String(line ?? 1));
        const colParam = encodeURIComponent(String(column ?? 1));

        return `http://localhost:63342/api/file?file=${fileParam}&line=${lineParam}&column=${colParam}`;
    }

}

import { LogEntry } from "@/core/logger/types";
import { IPipe, NextFunction } from "@/core/pipeline/types";

/**
 * Middleware that sanitizes sensitive information inside log metadata.
 *
 * Features:
 * - Recursive traversal of objects and arrays
 * - Sensitive key detection
 * - Path-based redaction rules
 * - Regex-based detection
 * - Partial masking
 * - Immutable transformations
 */
export class RedactSensitiveDataMiddleware implements IPipe<LogEntry, LogEntry> {

    /**
     * Keys that should be masked automatically
     */
    private readonly sensitiveKeys = new Set([
        "password",
        "token",
        "accessToken",
        "refreshToken",
        "authorization",
        "apiKey",
        "secret"
    ]);

    /**
     * Regex patterns that indicate sensitive data
     */
    private readonly sensitivePatterns: RegExp[] = [
        /bearer\s+[a-z0-9\-._~+/]+=*/i,
        /sk_[a-z0-9]{20,}/i,
        /api[_-]?key/i
    ];

    /**
     * Explicit paths that should always be masked
     */
    private readonly sensitivePaths = new Set([
        "meta.credentials.password",
        "meta.user.password",
        "meta.auth.token"
    ]);

    /**
     * Pipeline handler
     */
    async handle(
        entry: LogEntry,
        next: NextFunction<LogEntry, LogEntry>
    ): Promise<LogEntry> {

        if (!this.isObject(entry.meta)) {
            return next(entry);
        }

        const sanitized: LogEntry = {
            ...entry,
            meta: this.redactObject(entry.meta, "meta")
        };

        return next(sanitized);
    }

    /**
     * Recursively sanitize objects
     */
    private redactObject(
        obj: Record<string, unknown>,
        path: string
    ): Record<string, unknown> {

        const result: Record<string, unknown> = {};

        for (const key in obj) {

            const value = obj[key];
            const currentPath = `${path}.${key}`;

            // Path-based redaction
            if (this.sensitivePaths.has(currentPath)) {
                result[key] = "***";
                continue;
            }

            // Key-based redaction
            if (this.sensitiveKeys.has(key)) {
                result[key] = this.maskValue(value);
                continue;
            }

            result[key] = this.redactValue(value, currentPath);
        }

        return result;
    }

    /**
     * Recursively process values
     */
    private redactValue(value: unknown, path: string): unknown {

        if (Array.isArray(value)) {
            // Process arrays immutably
            return value.map((v, i) => this.redactValue(v, `${path}[${i}]`));
        }

        if (this.isObject(value)) {
            return this.redactObject(value, path);
        }

        if (typeof value === "string" && this.matchesSensitivePattern(value)) {
            return this.maskValue(value);
        }

        return value;
    }

    /**
     * Detect sensitive patterns
     */
    private matchesSensitivePattern(value: string): boolean {
        return this.sensitivePatterns.some(pattern => pattern.test(value));
    }

    /**
     * Mask sensitive values while keeping last characters visible
     */
    private maskValue(value: unknown): string {

        const str = String(value);

        if (str.length <= 6) {
            return "***";
        }

        const visible = str.slice(-4);
        const masked = "*".repeat(str.length - 4);

        return masked + visible;
    }

    /**
     * Type guard for objects
     */
    private isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
}

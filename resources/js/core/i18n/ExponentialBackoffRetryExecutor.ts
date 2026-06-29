import type { I18nRetryOptions, IRetryExecutor } from './types'
import { DEFAULT_I18N_RETRY_OPTIONS } from './defaults'

/**
 * Exponential backoff retry executor.
 */
export class ExponentialBackoffRetryExecutor implements IRetryExecutor {
    private readonly options: I18nRetryOptions

    constructor(options: Partial<I18nRetryOptions> = {}) {
        this.options = { ...DEFAULT_I18N_RETRY_OPTIONS, ...options }
    }

    /**
     * Execute operation with retry strategy.
     */
    async run<T>(operation: () => Promise<T>): Promise<T> {
        const totalAttempts = this.options.retries + 1
        let attempt = 0
        let lastError: unknown = null

        while (attempt < totalAttempts) {
            try {
                // Try operation
                return await operation()
            } catch (error) {
                lastError = error
                attempt += 1

                // Stop on final attempt
                if (attempt >= totalAttempts) break

                // Stop on non-retryable error
                if (!this.isRetryable(error)) break

                // Wait using backoff delay
                await this.sleep(this.calculateDelay(attempt))
            }
        }

        throw lastError instanceof Error ? lastError : new Error(String(lastError))
    }

    /**
     * Check retryable status/network error.
     */
    private isRetryable(error: unknown): boolean {
        if (!(error instanceof Error)) return false
        const status = (error as Error & { status?: number }).status

        // Retry network-like errors without explicit status
        if (typeof status !== 'number') return true
        return this.options.retryOnStatuses.includes(status)
    }

    /**
     * Calculate delay with exponential backoff.
     */
    private calculateDelay(attempt: number): number {
        const raw = this.options.baseDelayMs * Math.pow(this.options.backoffFactor, attempt - 1)
        return Math.min(raw, this.options.maxDelayMs)
    }

    /**
     * Sleep helper.
     */
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

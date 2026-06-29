import type {ISpanPersistence} from "../types"
import {isProd} from "@/core/config/env";
import {Logger} from "@/core/facades/Logger";

export interface IFetchSpanExporterOptions<TSpan = unknown> {
    headers?: Record<string, string>
    timeoutMs?: number
    keepalive?: boolean
    replayBatchSize?: number
}

export class FetchSpanExporter<TSpan = unknown> {
    private readonly headers: Record<string, string>
    private readonly timeoutMs: number
    private readonly keepalive: boolean
    private readonly replayBatchSize: number

    private replaying = false

    constructor(private readonly endpoint: string,
                private readonly persistence?: ISpanPersistence<TSpan>,
                options?: Partial<IFetchSpanExporterOptions<TSpan>>) {
        this.headers = options?.headers ?? {}
        this.timeoutMs = options?.timeoutMs ?? 8000
        this.keepalive = options?.keepalive ?? true
        this.replayBatchSize = options?.replayBatchSize ?? 50
    }

    async export(spans: TSpan[]): Promise<void> {
        if (!spans.length) return

        try {
            await this.send(spans)
            await this.replayPersisted()
        } catch (error) {
            // Store only if persistence strategy is provided
            await this.persistence?.append(spans)
            if (!isProd()){
                throw error
            }
            const message = this.persistence
                ? "Failed to export tracing spans. Spans were queued for retry via persistence."
                : "Failed to export tracing spans. Persistence is unavailable; spans may be lost."

            Logger.channel("Tracing.FetchExporter").error(message, {
                error,
                spansCount: spans.length,
                hasPersistence: Boolean(this.persistence),
                __location__
            })

        }
    }

    async flush(): Promise<void> {
        await this.replayPersisted()
    }

    async restoreAndSend(): Promise<void> {
        await this.replayPersisted()
    }

    private async replayPersisted(): Promise<void> {
        if (!this.persistence || this.replaying) return
        this.replaying = true

        try {
            while ((await this.persistence.size()) > 0) {
                const batch = await this.persistence.peek(this.replayBatchSize)
                if (!batch.length) break

                try {
                    await this.send(batch)
                    await this.persistence.remove(batch.length)
                } catch {
                    break
                }
            }
        } finally {
            this.replaying = false
        }
    }

    private async send(spans: TSpan[]): Promise<void> {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), this.timeoutMs)

        try {
            const res = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    ...this.headers,
                },
                body: JSON.stringify({spans, sentAt: Date.now()}),
                keepalive: this.keepalive,
                signal: controller.signal,
            })

            if (!res.ok) {
                throw new Error(`Export failed: ${res.status}`)
            }
        } finally {
            clearTimeout(timer)
        }
    }
}

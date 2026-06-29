import {ISpanContext, ISpanRecord, SpanStatus} from "./types";
import { Tracer } from "./Tracer";
import {Logger} from "@/core/facades/Logger";
import {isProd} from "@/core/config/env";

export class Span {
    private readonly startedAt = performance.now();
    private ended = false;

    constructor(
        private readonly tracer: Tracer,
        private readonly context: ISpanContext,
        private readonly name: string,
        private readonly attributes?: Record<string, unknown>,
    ) {}

    run<T>(fn: () => T): T {
        return this.tracer.runInContext(this.context, () => {
            try {
                const result = fn();
                this.end("ok");
                return result;
            } catch (error) {
                this.end("error", error);
                if (!isProd()){
                    throw error;
                }
                return;
            }
        });
    }

    async runAsync<T>(fn: () => Promise<T>): Promise<T> {
        return this.tracer.runInContextAsync(this.context, async () => {
            try {
                const result = await fn();
                await this.endAsync("ok");
                return result;
            } catch (error) {
                await this.endAsync("error", error);
                if (!isProd()){
                    throw error;
                }
                return;
            }
        });
    }

    end(status: SpanStatus='ok', error?: unknown): void {
        if (this.ended) return;
        this.ended = true;

        const record = this.buildRecord(status, error);
        this.logSlowSpan(record.durationMs, record);

        if (!this.context.sampled) return;
        void this.tracer.exportSpan(record);
    }

    async endAsync(status: SpanStatus='ok', error?: unknown): Promise<void> {
        if (this.ended) return;
        this.ended = true;

        const record = this.buildRecord(status, error);
        this.logSlowSpan(record.durationMs, record);

        if (!this.context.sampled) return;
        await this.tracer.exportSpan(record);
    }

    private buildRecord(status: "ok" | "error", error?: unknown): ISpanRecord {
        const endedAt = performance.now();
        const durationMs = endedAt - this.startedAt;

        return {
            name: this.name,
            traceId: this.context.traceId,
            spanId: this.context.spanId,
            parentSpanId: this.context.parentSpanId,
            startTime: this.startedAt,
            endTime: endedAt,
            durationMs,
            status,
            attributes: this.attributes,
            errorMessage: error instanceof Error ? error.message : undefined,
        };
    }

    private logSlowSpan(durationMs: number, record: ISpanRecord): void {
        if (durationMs > this.tracer.getSlowSpanThresholdMs()) {
            Logger.channel('Tracing.Span').warn("Slow span detected", {
                name: record.name,
                durationMs: record.durationMs,
                traceId: record.traceId,
                spanId: record.spanId,
                __location__
            });
        }
    }
}

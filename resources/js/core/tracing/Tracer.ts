import {
    IIdGenerator,
    IRedactor,
    ISampler,
    ISpanContext,
    ISpanRecord,
    ISpanExporter,
    ITraceOptions,
} from "./types";
import { TraceContextStore } from "./TraceContextStore";
import { Span } from "./Span";

const DEFAULT_OPTIONS: Required<ITraceOptions> = {
    traceIdLength: 16,
    spanIdLength: 8,
    slowSpanThresholdMs: 300,
};

export class Tracer {
    private readonly options: Required<ITraceOptions>;

    constructor(
        private readonly sampler: ISampler,
        private readonly redactor: IRedactor,
        private readonly exporter: ISpanExporter,
        private readonly idGenerator: IIdGenerator,
        private readonly contextStore: TraceContextStore,
        options?: ITraceOptions,
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    start(name: string, attributes?: Record<string, unknown>): Span {
        const parent = this.get();
        const spanContext = this.createSpanContext(name, parent);
        return new Span(this, spanContext, name, attributes);
    }

    get(): ISpanContext | undefined {
        return this.contextStore.getCurrent();
    }

    run<T>(name: string, fn: () => T, attributes?: Record<string, unknown>): T {
        return this.start(name, attributes).run(fn);
    }

    runAsync<T>(name: string, fn: () => Promise<T>, attributes?: Record<string, unknown>): Promise<T> {
        return this.start(name, attributes).runAsync(fn);
    }

    createSpanContext(name: string, parent?: ISpanContext): ISpanContext {
        const traceId = parent?.traceId ?? this.idGenerator.generateTraceId(this.options.traceIdLength);
        const spanId = this.idGenerator.generateSpanId(this.options.spanIdLength);
        const sampled = this.sampler.shouldSample(name, parent?.sampled);

        return {
            traceId,
            spanId,
            parentSpanId: parent?.spanId,
            sampled,
        };
    }

    runInContext<T>(ctx: ISpanContext, fn: () => T): T {
        return this.contextStore.run(ctx, fn);
    }

    runInContextAsync<T>(ctx: ISpanContext, fn: () => Promise<T>): Promise<T> {
        return this.contextStore.runAsync(ctx, fn);
    }

    getSlowSpanThresholdMs(): number {
        return this.options.slowSpanThresholdMs;
    }

    async exportSpan(record: ISpanRecord): Promise<void> {
        if (!record.traceId || !record.spanId) return;
        const safeRecord = this.redactor.redact(record);
        await this.exporter.export([safeRecord]);
    }

    async shutdown(): Promise<void> {
        await this.exporter.shutdown?.();
    }
}

export type SpanStatus = "ok" | "error";

export interface ISpanContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    sampled: boolean;
}

export interface ISpanRecord {
    name: string;
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    startTime: number;
    endTime: number;
    durationMs: number;
    status: SpanStatus;
    attributes?: Record<string, unknown>;
    errorMessage?: string;
}

export interface ITraceOptions {
    traceIdLength?: number;
    spanIdLength?: number;
    slowSpanThresholdMs?: number;
}

export interface IIdGenerator {
    generateTraceId(length: number): string;
    generateSpanId(length: number): string;
}

export interface ISampler {
    shouldSample(name: string, parentSampled?: boolean): boolean;
}

export interface IRedactor {
    redact(record: ISpanRecord): ISpanRecord;
}

/**
 * Exporter contract similar to SpanExporter model.
 */
export interface ISpanExporter {
    export(records: ISpanRecord[]): void | Promise<void>;
    shutdown?(): void | Promise<void>;
}

export interface ISpanPersistence<TSpan = unknown> {
    append(items: TSpan[]): Promise<void> | void
    peek(count: number): Promise<TSpan[]> | TSpan[]
    remove(count: number): Promise<void> | void
    size(): Promise<number> | number
    clear?(): Promise<void> | void
}



import {ISpanExporter, ISpanRecord} from "@/core/tracing/types";
import {Logger} from "@/core/facades/Logger";

export interface IBatchSpanExporterOptions {
    maxQueueSize?: number;
    maxExportBatchSize?: number;
    scheduledDelayMs?: number;
}

/**
 * Batch exporter wrapper:
 * queues spans and exports in batches by interval/threshold.
 */
export class BatchSpanExporter implements ISpanExporter {
    private readonly maxQueueSize: number;
    private readonly maxExportBatchSize: number;
    private readonly scheduledDelayMs: number;

    private readonly queue: ISpanRecord[] = [];
    private timer?: ReturnType<typeof setInterval>| undefined;
    private flushing = false;
    private stopped = false;

    constructor(
        private readonly delegate: ISpanExporter,
        options?: IBatchSpanExporterOptions,
    ) {
        this.maxQueueSize = options?.maxQueueSize ?? 2048;
        this.maxExportBatchSize = options?.maxExportBatchSize ?? 256;
        this.scheduledDelayMs = options?.scheduledDelayMs ?? 1000;

        this.timer = setInterval(() => {
            void this.flush();
        }, this.scheduledDelayMs);
    }

    export(records: ISpanRecord[]): void {
        if (this.stopped) return;

        for (const record of records) {
            if (this.queue.length >= this.maxQueueSize) {
                this.queue.shift(); // drop oldest
                Logger.channel('Tracing.BatchSpanExporter').warn("Queue full, dropping oldest span",__location__);
            }
            this.queue.push(record);
        }

        if (this.queue.length >= this.maxExportBatchSize) {
            void this.flush();
        }
    }

    async flush(): Promise<void> {
        if (this.flushing || this.stopped) return;
        if (this.queue.length === 0) return;

        this.flushing = true;
        try {
            while (this.queue.length > 0) {
                const batch = this.queue.splice(0, this.maxExportBatchSize);
                await this.delegate.export(batch);
            }
        } catch (error) {
            Logger.channel('Tracing.BatchSpanExporter').error("flush failed", {error,__location__});
        } finally {
            this.flushing = false;
        }
    }

    async shutdown(): Promise<void> {
        this.stopped = true;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        await this.flush();
        await this.delegate.shutdown?.();
    }
}

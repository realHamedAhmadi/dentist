import {ISpanExporter, ISpanRecord} from "@/core/tracing/types";

export class InMemorySpanExporter implements ISpanExporter {
    public readonly records: ISpanRecord[] = [];

    export(records: ISpanRecord[]): void {
        this.records.push(...records);
    }

    clear(): void {
        this.records.length = 0;
    }
}

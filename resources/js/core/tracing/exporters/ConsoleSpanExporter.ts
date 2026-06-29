import { ISpanExporter, ISpanRecord } from "../types";

export class ConsoleSpanExporter implements ISpanExporter {
    async export(records: ISpanRecord[]): Promise<void> {
        // eslint-disable-next-line no-console
        console.log("[TraceExport:ConsoleSpanExporter]", records);
    }
}

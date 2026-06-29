import { IRedactor, ISpanRecord } from "./types";

export class NoopRedactor implements IRedactor {
    redact(record: ISpanRecord): ISpanRecord {
        return record;
    }
}

export class KeyBasedRedactor implements IRedactor {
    constructor(
        private readonly blockedKeys: string[] = ["password", "token", "authorization", "secret"]
    ) {}

    redact(record: ISpanRecord): ISpanRecord {
        if (!record.attributes) return record;

        const redactedAttrs: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(record.attributes)) {
            redactedAttrs[key] = this.blockedKeys.includes(key.toLowerCase()) ? "[REDACTED]" : value;
        }

        return { ...record, attributes: redactedAttrs };
    }
}

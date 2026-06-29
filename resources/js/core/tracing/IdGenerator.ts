import {generateHexId} from "@/core/tracing/utils";
import {IIdGenerator} from "@/core/tracing/types";

export class DefaultIdGenerator implements IIdGenerator {
    generateTraceId(length: number): string {
        return generateHexId(length);
    }

    generateSpanId(length: number): string {
        return generateHexId(length);
    }
}

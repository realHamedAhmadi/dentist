import { ISpanContext } from "./types";

/**
 * Instance-based context stack.
 */
export class TraceContextStore {
    private readonly stack: ISpanContext[] = [];

    getCurrent(): ISpanContext | undefined {
        return this.stack[this.stack.length - 1];
    }

    run<T>(ctx: ISpanContext, fn: () => T): T {
        this.stack.push(ctx);
        try {
            return fn();
        } finally {
            this.stack.pop();
        }
    }

    async runAsync<T>(ctx: ISpanContext, fn: () => Promise<T>): Promise<T> {
        this.stack.push(ctx);
        try {
            return await fn();
        } finally {
            this.stack.pop();
        }
    }
}

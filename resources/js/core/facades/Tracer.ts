import { Facade } from "@/core/facades/Facade"
import { Tracer as MainTracer } from "@/core/tracing/Tracer"
import type { ISpanContext, ISpanRecord } from "@/core/tracing/types"
import type { Span } from "@/core/tracing/span"

export class Tracer extends Facade {

    protected static getToken() {
        return MainTracer
    }

    // Start a new span
    public static start(name: string, attributes?: Record<string, unknown>): Span {
        return this.resolve<MainTracer>().start(name, attributes)
    }

    // Get current active span context
    public static get(): ISpanContext | undefined {
        return this.resolve<MainTracer>().get()
    }

    // Run sync function in a newly created span
    public static run<T>(name: string, fn: () => T, attributes?: Record<string, unknown>): T {
        return this.resolve<MainTracer>().run(name, fn, attributes)
    }

    // Run async function in a newly created span
    public static runAsync<T>(
        name: string,
        fn: () => Promise<T>,
        attributes?: Record<string, unknown>,
    ): Promise<T> {
        return this.resolve<MainTracer>().runAsync(name, fn, attributes)
    }

    // Build span context (useful for tests or custom flows)
    public static createSpanContext(name: string, parent?: ISpanContext): ISpanContext {
        return this.resolve<MainTracer>().createSpanContext(name, parent)
    }

    // Run function in provided context
    public static runInContext<T>(ctx: ISpanContext, fn: () => T): T {
        return this.resolve<MainTracer>().runInContext(ctx, fn)
    }

    // Run async function in provided context
    public static runInContextAsync<T>(ctx: ISpanContext, fn: () => Promise<T>): Promise<T> {
        return this.resolve<MainTracer>().runInContextAsync(ctx, fn)
    }

    // Tracing config helper
    public static getSlowSpanThresholdMs(): number {
        return this.resolve<MainTracer>().getSlowSpanThresholdMs()
    }

    // Export one span record
    public static exportSpan(record: ISpanRecord): Promise<void> {
        return this.resolve<MainTracer>().exportSpan(record)
    }

    // Shutdown exporter
    public static shutdown(): Promise<void> {
        return this.resolve<MainTracer>().shutdown()
    }
}

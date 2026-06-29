import { Tracer } from "@/core/tracing/tracer"
import { buildTraceParent } from "@/core/tracing/buildTraceParent"
import {Logger} from "@/core/facades/Logger";

/**
 * Auto instrumentation for outgoing HTTP requests.
 * Instance-based version with install/uninstall support.
 */
export class HttpTracer {
    private installed = false

    private originalFetch?: typeof globalThis.fetch
    private originalXHROpen?: XMLHttpRequest["open"]
    private originalXHRSend?: XMLHttpRequest["send"]

    constructor(
        private readonly tracer: Tracer,
    ) {}

    install(): void {
        if (this.installed) return
        this.installed = true

        this.patchFetch()
        this.patchXHR()
    }

    uninstall(): void {
        if (!this.installed) return
        this.installed = false

        // Restore fetch
        if (this.originalFetch) {
            globalThis.fetch = this.originalFetch
            this.originalFetch = undefined
        }

        // Restore XHR methods
        if (globalThis.XMLHttpRequest) {
            if (this.originalXHROpen) {
                XMLHttpRequest.prototype.open = this.originalXHROpen
                this.originalXHROpen = undefined
            }

            if (this.originalXHRSend) {
                XMLHttpRequest.prototype.send = this.originalXHRSend
                this.originalXHRSend = undefined
            }
        }
    }

    private patchFetch(): void {
        if (!globalThis.fetch) return
        if (this.originalFetch) return

        this.originalFetch = globalThis.fetch

        const tracer = this.tracer
        const originalFetch = this.originalFetch

        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const parentCtx = tracer.get()
            if (!parentCtx?.traceId) {
                return originalFetch(input, init)
            }

            const url =
                typeof input === "string"
                    ? input
                    : input instanceof URL
                        ? input.toString()
                        : input.url

            const method =
                init?.method ||
                (typeof input !== "string" && !(input instanceof URL) ? input.method : "GET")

            return tracer.runAsync(`http ${method} ${url}`, async () => {
                const ctx = tracer.get()

                if (!ctx?.traceId || !ctx?.spanId) {
                    Logger.channel('Tracing.PatchFetch').warn("Trace context lost during fetch instrumentation",__location__)
                    return originalFetch(input, init)
                }

                const traceparent = buildTraceParent(ctx.traceId, ctx.spanId)
                if (!traceparent) {
                    Logger.channel('Tracing.PatchFetch').warn("Invalid traceId/spanId for traceparent header", {
                        traceId: ctx.traceId,
                        spanId: ctx.spanId,
                        __location__
                    })
                    return originalFetch(input, init)
                }

                const headers = new Headers(init?.headers || {})
                if (!headers.has("traceparent")) {
                    headers.set("traceparent", traceparent)
                }

                return originalFetch(input, {
                    ...init,
                    headers,
                })
            })
        }
    }

    private patchXHR(): void {
        if (!globalThis.XMLHttpRequest) return
        if (this.originalXHROpen || this.originalXHRSend) return

        this.originalXHROpen = XMLHttpRequest.prototype.open
        this.originalXHRSend = XMLHttpRequest.prototype.send

        const tracer = this.tracer
        const originalOpen = this.originalXHROpen
        const originalSend = this.originalXHRSend

        XMLHttpRequest.prototype.open = function (
            method: string,
            url: string | URL,
            async: boolean = true,
            username?: string | null,
            password?: string | null
        ): void {
            ;(this as any).__trace_method = method
            ;(this as any).__trace_url = typeof url === "string" ? url : url.toString()

            return originalOpen.call(this, method, url, async, username ?? null, password ?? null)
        }

        XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null): void {
            const parentCtx = tracer.get()
            if (!parentCtx?.traceId) {
                return originalSend.call(this, body)
            }

            const method = (this as any).__trace_method || "GET"
            const url = (this as any).__trace_url || "unknown"

            tracer.run(`http ${method} ${url}`, () => {
                const ctx = tracer.get()

                if (!ctx?.traceId || !ctx?.spanId) {
                    Logger.channel('Tracing.PatchXHR').warn("Trace context lost during XHR instrumentation",__location__)
                    originalSend.call(this, body)
                    return
                }

                const traceparent = buildTraceParent(ctx.traceId, ctx.spanId)
                if (!traceparent) {
                    Logger.channel('Tracing.Patch').warn("Invalid traceId/spanId for traceparent header", {
                        traceId: ctx.traceId,
                        spanId: ctx.spanId,
                        __location__
                    })
                    originalSend.call(this, body)
                    return
                }

                try {
                    this.setRequestHeader("traceparent", traceparent)
                } catch {
                    // Ignore header mutation errors
                }

                return originalSend.call(this, body)
            })
        }
    }
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { HttpTracer } from "@/core/tracing/httpTracer"

describe("HttpTracer", () => {
    const originalFetch = globalThis.fetch
    const OriginalXHR = globalThis.XMLHttpRequest

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        globalThis.fetch = originalFetch
        globalThis.XMLHttpRequest = OriginalXHR
    })

    it("should patch and restore fetch on install/uninstall", () => {
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
        globalThis.fetch = fetchMock as any

        const tracerStub = {
            get: vi.fn(() => null),
            runAsync: vi.fn(async (_name: string, cb: any) => cb()),
            run: vi.fn((_name: string, cb: any) => cb()),
        }

        const httpTracer = new HttpTracer(tracerStub as any)
        const before = globalThis.fetch

        httpTracer.install()
        const patched = globalThis.fetch
        expect(patched).not.toBe(before)

        httpTracer.uninstall()
        expect(globalThis.fetch).toBe(before)
    })

    it("should inject traceparent header in fetch when context is valid", async () => {
        const fetchMock = vi.fn(async (_input: any, init?: RequestInit) => {
            const headers = new Headers(init?.headers)
            expect(headers.get("traceparent")).toBe(
                "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01"
            )
            return new Response(null, { status: 200 })
        })
        globalThis.fetch = fetchMock as any

        const tracerStub = {
            get: vi
                .fn()
                .mockReturnValueOnce({ traceId: "0123456789abcdef0123456789abcdef", spanId: "aaaaaaaaaaaaaaaa" })
                .mockReturnValueOnce({ traceId: "0123456789abcdef0123456789abcdef", spanId: "0123456789abcdef" }),
            runAsync: vi.fn(async (_name: string, cb: any) => cb()),
            run: vi.fn((_name: string, cb: any) => cb()),
        }

        const httpTracer = new HttpTracer(tracerStub as any)
        httpTracer.install()

        await fetch("/api/test")
        expect(fetchMock).toHaveBeenCalled()
    })

    it("should not crash when buildTraceParent is invalid path", async () => {
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
        globalThis.fetch = fetchMock as any

        const logger = { warn: vi.fn() }
        const tracerStub = {
            get: vi
                .fn()
                .mockReturnValueOnce({ traceId: "0123456789abcdef0123456789abcdef", spanId: "aaaaaaaaaaaaaaaa" })
                .mockReturnValueOnce({ traceId: "bad", spanId: "bad" }),
            runAsync: vi.fn(async (_name: string, cb: any) => cb()),
            run: vi.fn((_name: string, cb: any) => cb()),
        }

        const httpTracer = new HttpTracer(tracerStub as any, logger as any)
        httpTracer.install()

        await fetch("/api/test")
        expect(fetchMock).toHaveBeenCalled()
        expect(logger.warn).toHaveBeenCalled()
    })
})

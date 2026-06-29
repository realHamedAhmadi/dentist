import { beforeEach, describe, expect, it, vi } from "vitest"
import { Span } from "../Span"
import { Logger } from "@/core/facades/Logger"
import type { ISpanContext } from "../types"

describe("Span", () => {
    const baseContext: ISpanContext = {
        traceId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        spanId: "bbbbbbbbbbbbbbbb",
        parentSpanId: undefined,
        sampled: true,
    }

    let tracerMock: {
        runInContext: ReturnType<typeof vi.fn>
        runInContextAsync: ReturnType<typeof vi.fn>
        exportSpan: ReturnType<typeof vi.fn>
        getSlowSpanThresholdMs: ReturnType<typeof vi.fn>
    }

    beforeEach(() => {
        vi.restoreAllMocks()

        tracerMock = {
            runInContext: vi.fn((_, fn: () => unknown) => fn()),
            runInContextAsync: vi.fn(async (_, fn: () => Promise<unknown>) => fn()),
            exportSpan: vi.fn(async () => undefined),
            getSlowSpanThresholdMs: vi.fn(() => 999999), // avoid slow log by default
        }
    })

    it("run should execute function, end span with ok, and export record", () => {
        const span = new Span(tracerMock as any, baseContext, "sync-op", { a: 1 })

        const result = span.run(() => 42)

        expect(result).toBe(42)
        expect(tracerMock.runInContext).toHaveBeenCalledTimes(1)
        expect(tracerMock.exportSpan).toHaveBeenCalledTimes(1)

        const record = tracerMock.exportSpan.mock.calls[0][0]
        expect(record.name).toBe("sync-op")
        expect(record.status).toBe("ok")
        expect(record.traceId).toBe(baseContext.traceId)
        expect(record.spanId).toBe(baseContext.spanId)
        expect(record.attributes).toEqual({ a: 1 })
        expect(record.errorMessage).toBeUndefined()
        expect(record.durationMs).toBeGreaterThanOrEqual(0)
    })

    it("run should end with error and rethrow when function throws", () => {
        const span = new Span(tracerMock as any, baseContext, "sync-fail")
        const error = new Error("boom")

        expect(() => span.run(() => { throw error })).toThrow("boom")

        expect(tracerMock.exportSpan).toHaveBeenCalledTimes(1)
        const record = tracerMock.exportSpan.mock.calls[0][0]
        expect(record.status).toBe("error")
        expect(record.errorMessage).toBe("boom")
    })

    it("runAsync should execute function, endAsync with ok, and export record", async () => {
        const span = new Span(tracerMock as any, baseContext, "async-op")

        const result = await span.runAsync(async () => "done")

        expect(result).toBe("done")
        expect(tracerMock.runInContextAsync).toHaveBeenCalledTimes(1)
        expect(tracerMock.exportSpan).toHaveBeenCalledTimes(1)

        const record = tracerMock.exportSpan.mock.calls[0][0]
        expect(record.status).toBe("ok")
        expect(record.errorMessage).toBeUndefined()
    })

    it("runAsync should endAsync with error and rethrow when promise rejects", async () => {
        const span = new Span(tracerMock as any, baseContext, "async-fail")
        const error = new Error("reject")

        await expect(
            span.runAsync(async () => {
                throw error
            }),
        ).rejects.toThrow("reject")

        expect(tracerMock.exportSpan).toHaveBeenCalledTimes(1)
        const record = tracerMock.exportSpan.mock.calls[0][0]
        expect(record.status).toBe("error")
        expect(record.errorMessage).toBe("reject")
    })

    it("end should export only once even if called multiple times", async () => {
        const span = new Span(tracerMock as any, baseContext, "once")

        span.end("ok")
        span.end("error", new Error("should-ignore"))
        await span.endAsync("error", new Error("should-ignore-async"))

        expect(tracerMock.exportSpan).toHaveBeenCalledTimes(1)
        const record = tracerMock.exportSpan.mock.calls[0][0]
        expect(record.status).toBe("ok")
    })

    it("should not export when context.sampled is false", async () => {
        const unsampledContext: ISpanContext = { ...baseContext, sampled: false }
        const span = new Span(tracerMock as any, unsampledContext, "unsampled")

        span.end("ok")
        await span.endAsync("ok")

        expect(tracerMock.exportSpan).not.toHaveBeenCalled()
    })

    it("should log slow span when duration exceeds threshold", () => {
        const warnSpy = vi.spyOn(Logger, "warn").mockImplementation(() => undefined)
        tracerMock.getSlowSpanThresholdMs.mockReturnValue(0) // force slow log

        const span = new Span(tracerMock as any, baseContext, "slow-op")
        span.end("ok")

        expect(warnSpy).toHaveBeenCalledTimes(1)
        expect(warnSpy).toHaveBeenCalledWith(
            "[Tracing] Slow span detected",
            expect.objectContaining({
                name: "slow-op",
                traceId: baseContext.traceId,
                spanId: baseContext.spanId,
            }),
        )
    })

    it("should not log slow span when duration is within threshold", () => {
        const warnSpy = vi.spyOn(Logger, "warn").mockImplementation(() => undefined)
        tracerMock.getSlowSpanThresholdMs.mockReturnValue(Number.MAX_SAFE_INTEGER)

        const span = new Span(tracerMock as any, baseContext, "fast-op")
        span.end("ok")

        expect(warnSpy).not.toHaveBeenCalled()
    })
})

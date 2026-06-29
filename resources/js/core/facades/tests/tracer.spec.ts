import { describe, it, expect, beforeEach, vi } from "vitest"
import { Tracer as TracerFacade } from "@/core/facades/Tracer"
import { getApp } from "@/core/platform/application/appInstance"
import { Tracer as MainTracer } from "@/core/tracing/Tracer"
import type { ISpanContext, ISpanRecord } from "@/core/tracing/types"

vi.mock("@/core/platform/application/appInstance", () => ({
    getApp: vi.fn(),
}))

function makeContext(overrides?: Partial<ISpanContext>): ISpanContext {
    return {
        traceId: "trace-1",
        spanId: "span-1",
        parentSpanId: undefined,
        sampled: true,
        ...overrides,
    }
}

function makeRecord(overrides?: Partial<ISpanRecord>): ISpanRecord {
    const now = Date.now()
    return {
        traceId: "trace-1",
        spanId: "span-1",
        parentSpanId: undefined,
        name: "test-span",
        sampled: true,
        startTime: now,
        endTime: now + 10,
        durationMs: 10,
        status: "ok",
        attributes: {},
        error: undefined,
        ...overrides,
    }
}

describe("Tracer Facade (strict)", () => {
    const tracerMock = {
        start: vi.fn(),
        get: vi.fn(),
        run: vi.fn(),
        runAsync: vi.fn(),
        createSpanContext: vi.fn(),
        runInContext: vi.fn(),
        runInContextAsync: vi.fn(),
        getSlowSpanThresholdMs: vi.fn(),
        exportSpan: vi.fn(),
        shutdown: vi.fn(),
    }

    const appMock = {
        make: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        TracerFacade.clearResolvedInstance()

        ;(getApp as unknown as ReturnType<typeof vi.fn>).mockReturnValue(appMock)
        appMock.make.mockReturnValue(tracerMock)
    })

    it("resolves MainTracer from container only once", () => {
        tracerMock.get.mockReturnValue(undefined)

        TracerFacade.get()
        TracerFacade.get()

        expect(getApp).toHaveBeenCalledTimes(1)
        expect(appMock.make).toHaveBeenCalledTimes(1)
        expect(appMock.make).toHaveBeenCalledWith(MainTracer)
    })

    it("delegates start", () => {
        const span = { id: "span-obj" }
        tracerMock.start.mockReturnValue(span)

        const result = TracerFacade.start("test-span", { a: 1 })

        expect(tracerMock.start).toHaveBeenCalledWith("test-span", { a: 1 })
        expect(result).toBe(span)
    })

    it("delegates get", () => {
        const ctx = makeContext()
        tracerMock.get.mockReturnValue(ctx)

        const result = TracerFacade.get()

        expect(tracerMock.get).toHaveBeenCalledTimes(1)
        expect(result).toBe(ctx)
    })

    it("delegates run", () => {
        const fn = () => "value"
        tracerMock.run.mockReturnValue("ok")

        const result = TracerFacade.run("sync-op", fn, { k: "v" })

        expect(tracerMock.run).toHaveBeenCalledWith("sync-op", fn, { k: "v" })
        expect(result).toBe("ok")
    })

    it("delegates runAsync", async () => {
        const fn = async () => "value"
        tracerMock.runAsync.mockResolvedValue("async-ok")

        const result = await TracerFacade.runAsync("async-op", fn, { x: 2 })

        expect(tracerMock.runAsync).toHaveBeenCalledWith("async-op", fn, { x: 2 })
        expect(result).toBe("async-ok")
    })

    it("delegates createSpanContext", () => {
        const parent = makeContext({ spanId: "parent-1" })
        const child = makeContext({ spanId: "child-1", parentSpanId: "parent-1" })
        tracerMock.createSpanContext.mockReturnValue(child)

        const result = TracerFacade.createSpanContext("child-op", parent)

        expect(tracerMock.createSpanContext).toHaveBeenCalledWith("child-op", parent)
        expect(result).toBe(child)
    })

    it("delegates runInContext", () => {
        const ctx = makeContext()
        const fn = () => 123
        tracerMock.runInContext.mockReturnValue(123)

        const result = TracerFacade.runInContext(ctx, fn)

        expect(tracerMock.runInContext).toHaveBeenCalledWith(ctx, fn)
        expect(result).toBe(123)
    })

    it("delegates runInContextAsync", async () => {
        const ctx = makeContext()
        const fn = async () => 456
        tracerMock.runInContextAsync.mockResolvedValue(456)

        const result = await TracerFacade.runInContextAsync(ctx, fn)

        expect(tracerMock.runInContextAsync).toHaveBeenCalledWith(ctx, fn)
        expect(result).toBe(456)
    })

    it("delegates getSlowSpanThresholdMs", () => {
        tracerMock.getSlowSpanThresholdMs.mockReturnValue(300)

        const result = TracerFacade.getSlowSpanThresholdMs()

        expect(tracerMock.getSlowSpanThresholdMs).toHaveBeenCalledTimes(1)
        expect(result).toBe(300)
    })

    it("delegates exportSpan", async () => {
        const record = makeRecord()
        tracerMock.exportSpan.mockResolvedValue(undefined)

        await TracerFacade.exportSpan(record)

        expect(tracerMock.exportSpan).toHaveBeenCalledWith(record)
    })

    it("delegates shutdown", async () => {
        tracerMock.shutdown.mockResolvedValue(undefined)

        await TracerFacade.shutdown()

        expect(tracerMock.shutdown).toHaveBeenCalledTimes(1)
    })

    it("clearResolvedInstance forces re-resolve from container", () => {
        tracerMock.get.mockReturnValue(undefined)

        TracerFacade.get()
        TracerFacade.clearResolvedInstance()
        TracerFacade.get()

        expect(appMock.make).toHaveBeenCalledTimes(2)
    })
})

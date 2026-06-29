import { describe, it, expect, vi } from "vitest"
import { Tracer } from "@/core/tracing/tracer"

class FakeExporter {
    export = vi.fn(async (_spans: any[]) => {})
    flush = vi.fn(async () => {})
}

class FakeSampler {
    shouldSample = vi.fn(() => true)
}

class FakeRedactor {
    redact = vi.fn((span: any) => span)
}

class FakeIdGenerator {
    generateTraceId = vi.fn(() => "0123456789abcdef0123456789abcdef")
    generateSpanId = vi.fn(() => "0123456789abcdef")
}

describe("Tracer", () => {
    it("should run sync span and export ended span", async () => {
        const exporter = new FakeExporter()
        const tracer = new Tracer({
            exporter,
            sampler: new FakeSampler(),
            redactor: new FakeRedactor(),
            idGenerator: new FakeIdGenerator(),
        } as any)

        tracer.run("sync-op", () => {
            const ctx = tracer.get()
            expect(ctx?.traceId).toBeTruthy()
            expect(ctx?.spanId).toBeTruthy()
        })

        // Depending on your architecture export may be immediate or batched.
        expect(exporter.export).toHaveBeenCalled()
    })

    it("should run async span and preserve context", async () => {
        const exporter = new FakeExporter()
        const tracer = new Tracer({
            exporter,
            sampler: new FakeSampler(),
            redactor: new FakeRedactor(),
            idGenerator: new FakeIdGenerator(),
        } as any)

        await tracer.runAsync("async-op", async () => {
            const before = tracer.get()
            await Promise.resolve()
            const after = tracer.get()

            expect(before?.traceId).toBe(after?.traceId)
        })

        expect(exporter.export).toHaveBeenCalled()
    })

    it("should record exception if callback throws", async () => {
        const exporter = new FakeExporter()
        const tracer = new Tracer({
            exporter,
            sampler: new FakeSampler(),
            redactor: new FakeRedactor(),
            idGenerator: new FakeIdGenerator(),
        } as any)

        expect(() =>
            tracer.run("throw-op", () => {
                throw new Error("failed")
            })
        ).toThrow("failed")

        expect(exporter.export).toHaveBeenCalled()
    })
})

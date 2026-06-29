import { describe, it, expect } from "vitest"
import { Tracer } from "@/core/tracing/tracer"

describe("Async context propagation", () => {
    it("should keep same traceId across microtask and timeout", async () => {
        const tracer = new Tracer({} as any)

        await tracer.runAsync("ctx-op", async () => {
            const c1 = tracer.get()
            await Promise.resolve()
            const c2 = tracer.get()

            expect(c1?.traceId).toBe(c2?.traceId)

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    const c3 = tracer.get()
                    expect(c1?.traceId).toBe(c3?.traceId)
                    resolve()
                }, 0)
            })
        })
    })
})

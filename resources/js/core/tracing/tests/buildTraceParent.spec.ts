import { describe, it, expect } from "vitest"
import { buildTraceParent } from "@/core/tracing/buildTraceParent"

describe("buildTraceParent", () => {
    it("should build valid traceparent for valid traceId/spanId", () => {
        const traceId = "0123456789abcdef0123456789abcdef"
        const spanId = "0123456789abcdef"

        const value = buildTraceParent(traceId, spanId)

        expect(value).toBe(`00-${traceId}-${spanId}-01`)
    })

    it("should return null for invalid traceId", () => {
        const value = buildTraceParent("invalid-trace-id", "0123456789abcdef")
        expect(value).toBeNull()
    })

    it("should return null for invalid spanId", () => {
        const value = buildTraceParent(
            "0123456789abcdef0123456789abcdef",
            "invalid-span-id"
        )
        expect(value).toBeNull()
    })

    it("should return null for all-zero traceId/spanId if your validator blocks them", () => {
        const value = buildTraceParent(
            "00000000000000000000000000000000",
            "0000000000000000"
        )

        // If your implementation allows these, change this assertion accordingly.
        expect(value).toBeNull()
    })
})

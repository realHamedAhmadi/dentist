import { describe, it, expect, vi, beforeEach } from "vitest"
import { FetchSpanExporter } from "../../exporters/FetchSpanExporter"
import type { ISpanPersistence } from "../../types"

describe("FetchSpanExporter", () => {
    const endpoint = "/api/observability/spans"

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it("should export spans successfully without persistence", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 200 }),
        )

        const exporter = new FetchSpanExporter({
            endpoint,
        })

        await expect(exporter.export([{ id: "s1" }])).resolves.toBeUndefined()

        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("should append to persistence when export fails", async () => {
        const append = vi.fn()
        const persistence: ISpanPersistence = {
            append,
            peek: vi.fn().mockReturnValue([]),
            remove: vi.fn(),
            size: vi.fn().mockReturnValue(0),
        }

        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 500 }),
        )

        const exporter = new FetchSpanExporter({
            endpoint,
            persistence,
        })

        const spans = [{ id: "s1" }, { id: "s2" }]

        await expect(exporter.export(spans)).rejects.toThrow()
        expect(append).toHaveBeenCalledTimes(1)
        expect(append).toHaveBeenCalledWith(spans)
    })

    it("should replay persisted spans after a successful live export", async () => {
        const persistence: ISpanPersistence = {
            append: vi.fn(),
            size: vi.fn().mockReturnValueOnce(2).mockReturnValueOnce(0),
            peek: vi.fn().mockReturnValueOnce([{ id: "p1" }, { id: "p2" }]),
            remove: vi.fn(),
        }

        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 200 }),
        )

        const exporter = new FetchSpanExporter({
            endpoint,
            persistence,
            replayBatchSize: 50,
        })

        await exporter.export([{ id: "live-1" }])

        // 1 for live export + 1 for replay batch
        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(persistence.remove).toHaveBeenCalledWith(2)
    })

    it("should stop replay when persisted batch send fails", async () => {
        const persistence: ISpanPersistence = {
            append: vi.fn(),
            size: vi.fn().mockReturnValue(2),
            peek: vi.fn().mockReturnValue([{ id: "p1" }, { id: "p2" }]),
            remove: vi.fn(),
        }

        vi.spyOn(globalThis, "fetch")
            // live export succeeds
            .mockResolvedValueOnce(new Response(null, { status: 200 }))
            // replay fails
            .mockResolvedValueOnce(new Response(null, { status: 500 }))

        const exporter = new FetchSpanExporter({
            endpoint,
            persistence,
        })

        await exporter.export([{ id: "live-1" }])

        // remove should not be called because replay send failed
        expect(persistence.remove).not.toHaveBeenCalled()
    })

    it("flush should replay persisted spans", async () => {
        const persistence: ISpanPersistence = {
            append: vi.fn(),
            size: vi.fn().mockReturnValueOnce(1).mockReturnValueOnce(0),
            peek: vi.fn().mockReturnValueOnce([{ id: "p1" }]),
            remove: vi.fn(),
        }

        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(null, { status: 200 }),
        )

        const exporter = new FetchSpanExporter({
            endpoint,
            persistence,
            replayBatchSize: 10,
        })

        await exporter.flush()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(persistence.remove).toHaveBeenCalledWith(1)
    })
})

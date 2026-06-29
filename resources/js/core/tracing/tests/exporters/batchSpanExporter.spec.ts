import { describe, it, expect, vi } from "vitest"
import { BatchSpanExporter } from "@/core/tracing/exporters/batchSpanExporter"

describe("BatchSpanExporter", () => {
    it("should flush when queue reaches batch size", async () => {
        const transport = {
            send: vi.fn(async () => {}),
        }

        const exporter = new BatchSpanExporter({
            transport: transport as any,
            batchSize: 2,
            flushIntervalMs: 60_000,
            maxRetries: 0,
        } as any)

        await exporter.export([{ id: 1 } as any])
        expect(transport.send).not.toHaveBeenCalled()

        await exporter.export([{ id: 2 } as any])
        expect(transport.send).toHaveBeenCalledTimes(1)
    })

    it("should retry on failure and eventually succeed", async () => {
        const transport = {
            send: vi
                .fn()
                .mockRejectedValueOnce(new Error("net-1"))
                .mockRejectedValueOnce(new Error("net-2"))
                .mockResolvedValueOnce(undefined),
        }

        const exporter = new BatchSpanExporter({
            transport: transport as any,
            batchSize: 1,
            flushIntervalMs: 60_000,
            maxRetries: 2,
            backoffMs: 1,
        } as any)

        await exporter.export([{ id: 1 } as any])

        expect(transport.send).toHaveBeenCalledTimes(3)
    })

    it("flush should drain all queued spans", async () => {
        const transport = {
            send: vi.fn(async () => {}),
        }

        const exporter = new BatchSpanExporter({
            transport: transport as any,
            batchSize: 10,
            flushIntervalMs: 60_000,
        } as any)

        await exporter.export([{ id: 1 } as any, { id: 2 } as any])
        await exporter.flush()

        expect(transport.send).toHaveBeenCalledTimes(1)
    })
})

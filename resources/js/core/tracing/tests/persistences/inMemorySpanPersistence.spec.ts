import { describe, it, expect } from "vitest"
import { InMemorySpanPersistence } from "../../persistences/InMemorySpanPersistence"

describe("InMemorySpanPersistence", () => {
    it("should append and read items in FIFO order", () => {
        const store = new InMemorySpanPersistence<{ id: string }>(10)

        store.append([{ id: "1" }, { id: "2" }, { id: "3" }])

        expect(store.size()).toBe(3)
        expect(store.peek(2)).toEqual([{ id: "1" }, { id: "2" }])
    })

    it("should remove items from head (FIFO)", () => {
        const store = new InMemorySpanPersistence<{ id: string }>(10)

        store.append([{ id: "1" }, { id: "2" }, { id: "3" }])
        store.remove(2)

        expect(store.size()).toBe(1)
        expect(store.peek(10)).toEqual([{ id: "3" }])
    })

    it("should replace old items with new ones when capacity is full", () => {
        const store = new InMemorySpanPersistence<{ id: string }>(3)

        store.append([{ id: "1" }, { id: "2" }, { id: "3" }])
        store.append([{ id: "4" }, { id: "5" }])

        // Capacity = 3 => keep latest 3 items
        expect(store.size()).toBe(3)
        expect(store.peek(10)).toEqual([{ id: "3" }, { id: "4" }, { id: "5" }])
    })

    it("clear should remove all items", () => {
        const store = new InMemorySpanPersistence<{ id: string }>(3)

        store.append([{ id: "1" }, { id: "2" }])
        store.clear()

        expect(store.size()).toBe(0)
        expect(store.peek(10)).toEqual([])
    })
})

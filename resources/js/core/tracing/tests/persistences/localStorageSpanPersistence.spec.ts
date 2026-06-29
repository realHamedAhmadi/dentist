import { describe, it, expect, beforeEach } from "vitest"
import { LocalStorageSpanPersistence } from "../../persistences/LocalStorageSpanPersistence"

class FakeJsonKeyValueStore {
    private data = new Map<string, string>()

    // Simulate Web Storage API
    getItem(key: string): string | null {
        return this.data.has(key) ? this.data.get(key)! : null
    }

    setItem(key: string, value: string): void {
        this.data.set(key, value)
    }

    removeItem(key: string): void {
        this.data.delete(key)
    }

    // Helper for tests
    seed(key: string, value: unknown): void {
        this.data.set(key, JSON.stringify(value))
    }

    raw(key: string): string | null {
        return this.getItem(key)
    }
}

describe("LocalStorageSpanPersistence", () => {
    const key = "app:trace:pending"
    let store: FakeJsonKeyValueStore

    beforeEach(() => {
        store = new FakeJsonKeyValueStore()
    })

    it("should append and preserve FIFO order", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        persistence.append([{ id: "1" }, { id: "2" }])
        persistence.append([{ id: "3" }])

        expect(persistence.size()).toBe(3)
        expect(persistence.peek(10)).toEqual([{ id: "1" }, { id: "2" }, { id: "3" }])
    })

    it("should remove from head (FIFO)", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        persistence.append([{ id: "1" }, { id: "2" }, { id: "3" }])
        persistence.remove(2)

        expect(persistence.size()).toBe(1)
        expect(persistence.peek(10)).toEqual([{ id: "3" }])
    })

    it("should replace oldest items when capacity is full", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 3,
        })

        persistence.append([{ id: "1" }, { id: "2" }, { id: "3" }])
        persistence.append([{ id: "4" }, { id: "5" }])

        // Keep latest 3 items only
        expect(persistence.size()).toBe(3)
        expect(persistence.peek(10)).toEqual([{ id: "3" }, { id: "4" }, { id: "5" }])
    })

    it("should clear persisted items", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        persistence.append([{ id: "1" }, { id: "2" }])
        persistence.clear()

        expect(persistence.size()).toBe(0)
        expect(store.raw(key)).toBeNull()
    })

    it("should return empty state for missing key", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        expect(persistence.size()).toBe(0)
        expect(persistence.peek(10)).toEqual([])
    })

    it("should recover safely when stored value is invalid JSON", () => {
        // Seed invalid JSON intentionally
        store.setItem(key, "{invalid-json")

        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        expect(persistence.size()).toBe(0)
        expect(persistence.peek(10)).toEqual([])
    })

    it("should recover safely when stored value is not an array", () => {
        store.seed(key, { not: "array" })

        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        expect(persistence.size()).toBe(0)
        expect(persistence.peek(10)).toEqual([])
    })

    it("peek with non-positive count should return empty array", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        persistence.append([{ id: "1" }])

        expect(persistence.peek(0)).toEqual([])
        expect(persistence.peek(-5)).toEqual([])
    })

    it("remove with non-positive count should do nothing", () => {
        const persistence = new LocalStorageSpanPersistence<{ id: string }>({
            store,
            key,
            capacity: 10,
        })

        persistence.append([{ id: "1" }, { id: "2" }])

        persistence.remove(0)
        expect(persistence.peek(10)).toEqual([{ id: "1" }, { id: "2" }])

        persistence.remove(-1)
        expect(persistence.peek(10)).toEqual([{ id: "1" }, { id: "2" }])
    })
})

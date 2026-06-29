import type { ISpanPersistence } from "../types"

/**
 * In-memory persistence with bounded capacity.
 * When full, newest items replace oldest ones (drop-oldest policy).
 */
export class InMemorySpanPersistence<TSpan = unknown>
    implements ISpanPersistence<TSpan>
{
    private readonly capacity: number
    private items: TSpan[] = []

    constructor(capacity = 1000) {
        this.capacity = Math.max(1, capacity)
    }

    append(items: TSpan[]): void {
        if (!items.length) return
        this.items = this.items.concat(items)

        // Drop oldest when capacity exceeded
        if (this.items.length > this.capacity) {
            this.items = this.items.slice(this.items.length - this.capacity)
        }
    }

    peek(count: number): TSpan[] {
        if (count <= 0) return []
        return this.items.slice(0, count)
    }

    remove(count: number): void {
        if (count <= 0) return
        this.items = this.items.slice(count)
    }

    size(): number {
        return this.items.length
    }

    clear(): void {
        this.items = []
    }
}

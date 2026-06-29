import type { ISpanPersistence } from "../types"

export interface IJsonKeyValueStore {
    getItem(key: string): string | null
    setItem(key: string, value: string): void
    removeItem(key: string): void
}

/**
 * localStorage-backed persistence (optional adapter).
 * Exporter never depends on localStorage directly.
 */
export class LocalStorageSpanPersistence<TSpan = unknown>
    implements ISpanPersistence<TSpan>
{
    private readonly store: IJsonKeyValueStore
    private readonly key: string
    private readonly capacity: number

    constructor(options: {
        store: IJsonKeyValueStore
        key?: string
        capacity?: number
    }) {
        this.store = options.store
        this.key = options.key ?? "tracing:pending-spans"
        this.capacity = Math.max(1, options.capacity ?? 1000)
    }

    append(items: TSpan[]): void {
        if (!items.length) return
        const current = this.read()
        const merged = current.concat(items)
        const trimmed =
            merged.length > this.capacity
                ? merged.slice(merged.length - this.capacity)
                : merged
        this.write(trimmed)
    }

    peek(count: number): TSpan[] {
        if (count <= 0) return []
        return this.read().slice(0, count)
    }

    remove(count: number): void {
        if (count <= 0) return
        const current = this.read()
        this.write(current.slice(count))
    }

    size(): number {
        return this.read().length
    }

    clear(): void {
        this.store.removeItem(this.key)
    }

    private read(): TSpan[] {
        try {
            const raw = this.store.getItem(this.key)
            if (!raw) return []
            const parsed = JSON.parse(raw)
            return Array.isArray(parsed) ? (parsed as TSpan[]) : []
        } catch {
            return []
        }
    }

    private write(items: TSpan[]): void {
        this.store.setItem(this.key, JSON.stringify(items))
    }
}

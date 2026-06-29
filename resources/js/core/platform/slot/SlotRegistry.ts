import { SlotExtension } from "@/core/platform/slot/types";

type SlotComputed = {
    sorted: SlotExtension[];
};

/**
 * Registry for slot extensions.
 */
export class SlotRegistry {
    private slots = new Map<string, SlotExtension[]>();
    private computedCache = new Map<string, SlotComputed>();

    /**
     * Register a slot if it does not exist.
     */
    register(slotId: string): void {
        if (!this.slots.has(slotId)) {
            this.slots.set(slotId, []);
        }
    }

    /**
     * Add or override an extension in a slot.
     */
    extend(slotId: string, ext: SlotExtension): void {
        const list = this.slots.get(slotId) ?? [];
        const existing = list.find((e) => e.id === ext.id);

        if (existing) {
            const nextPriority = ext.priority ?? 0;
            const existingPriority = existing.priority ?? 0;

            if (ext.override && nextPriority > existingPriority) {
                const index = list.indexOf(existing);
                list[index] = ext;
            } else {
                throw new Error(`Extension conflict: ${ext.id}`);
            }
        } else {
            list.push(ext);
        }

        this.slots.set(slotId, list);
        this.computedCache.delete(slotId);
    }

    /**
     * Compute sorted slot extensions.
     */
    private compute(slotId: string): SlotComputed {
        const extensions = this.slots.get(slotId) ?? [];

        const sorted = [...extensions].sort((a, b) => {
            return (a.order ?? 0) - (b.order ?? 0);
        });

        const computed: SlotComputed = { sorted };

        this.computedCache.set(slotId, computed);

        return computed;
    }

    /**
     * Return sorted extensions.
     */
    get(slotId: string): SlotExtension[] {
        const cached = this.computedCache.get(slotId);
        if (cached) {
            return cached.sorted;
        }

        return this.compute(slotId).sorted;
    }
}

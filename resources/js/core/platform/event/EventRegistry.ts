import { EventHandlerEntry ,IEvent} from "@/core/platform/event/Event"

export class EventRegistry {

    private handlers =
        new Map<string, Set<EventHandlerEntry>>()

    /**
     * Register event handler
     */
    setHandler(
        event: string,
        handler: (event: IEvent) => any,
        pluginId: string | null
    ): void {

        if (!this.handlers.has(event)) {

            this.handlers.set(event, new Set())

        }

        this.handlers
            .get(event)!
            .add({ handler, pluginId })

    }

    /**
     * Remove event handler
     */
    removeHandler(
        event: string,
        handler: (event: IEvent) => any
    ): void {

        const entries = this.handlers.get(event)

        if (!entries) return

        for (const entry of entries) {

            // Remove matching handler
            if (entry.handler === handler) {

                entries.delete(entry)

                break

            }

        }

        // Cleanup empty events
        if (entries.size === 0) {

            this.handlers.delete(event)

        }

    }

    /**
     * Get handlers for event
     */
    getHandlersOf(
        event: string
    ): Set<EventHandlerEntry> | undefined {

        return this.handlers.get(event)

    }

    /**
     * Check if event has handlers
     */
    hasHandlerOf(event: string): boolean {

        return this.handlers.has(event)

    }

    /**
     * Get plugin owners of event handlers
     */
    getOwnersOf(event: string) {

        return this.handlers
            .get(event)
            ?.values()

    }

    /**
     * Remove event handler for plugin
     */

    removePluginHandlers(pluginId: string): void {

        for (const [event, entries] of this.handlers) {

            for (const entry of entries) {

                if (entry.pluginId === pluginId) {

                    entries.delete(entry)

                }

            }

            if (entries.size === 0) {

                this.handlers.delete(event)

            }

        }

    }


}

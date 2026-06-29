import { MessageBus } from "@/core/platform/messaging/MessageBus"
import { EventRegistry } from "@/core/platform/event/EventRegistry"
import {IDisposable, IEvent} from "@/core/platform/event/Event";

export class EventBus {

    constructor(
        private bus: MessageBus,
        private registry: EventRegistry
    ) {
        if (!bus) {
            throw new Error("EventBus requires MessageBus")
        }

        if (!registry) {
            throw new Error("EventBus requires EventRegistry")
        }
    }

    /**
     * Subscribe to event
     */
    on(
        event: string,
        handler: (event: IEvent) => any
    ): IDisposable {

        this.registry.setHandler(
            event,
            handler,
            null
        )

        return {

            dispose: () => {

                // Remove handler on dispose
                this.registry.removeHandler(
                    event,
                    handler
                )

            }

        }

    }

    /**
     * Unsubscribe from event
     */
    off(
        event: string,
        handler: (event: IEvent) => any
    ): void {

        this.registry.removeHandler(
            event,
            handler
        )

    }

    /**
     * Emit event
     */
    async emit(
        event: string,
        payload?: unknown,
        meta?: any
    ) {

        return this.bus.dispatch({

            kind: "event",

            type: event,

            payload,

            meta

        })

    }

}

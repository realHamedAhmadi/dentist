import {Facade} from "@/core/facades/Facade";
import {EventBus} from "@/core/platform/event/EventBus";

export class Event extends Facade {
    protected static getToken() {
        return EventBus
    }

    static on(event: string, handler: Function) {
        return this.resolve().on(event,handler)
    }

    static off(event: string, handler: Function) {
        return this.resolve().off(event,handler)
    }

    static emit(event: string,
                payload?: unknown,
                meta?: any) {
        return this.resolve().emit(event,payload,meta)
    }
}

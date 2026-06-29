import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";

export class QueryBus {

    constructor(
        private bus: MessageBus,
        private registry: QueryRegistry
    ) {}

    register(
        query: string,
        handler: Function
    ) {

        this.registry.setHandler(
            query,
            handler
        )

    }

    async request(
        query: string,
        payload?: unknown,
        meta?: any
    ) {

        return this.bus.dispatch({

            kind: "query",

            type: query,

            payload,

            meta

        })

    }

}

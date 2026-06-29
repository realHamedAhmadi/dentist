import {QueryHandlerEntry} from "@/core/platform/query/Query";

export class QueryRegistry {

    private handlers =
        new Map<string, QueryHandlerEntry>()

    setHandler(type:string,handler:any,pluginId:string) {
        this.handlers.set(type, {handler,pluginId});
    }

    getHandlerOf(type:string) {
        return this.handlers.get(type)?.handler;
    }

    hasHandlerOf(type:string) {
        return this.handlers.has(type);
    }

    getOwnerOf(type: string) {

        return this.handlers.get(type)?.pluginId
    }
}

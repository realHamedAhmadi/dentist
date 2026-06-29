import {CommandHandlerEntry} from "@/core/platform/command/Command";

export class CommandRegistry {

    private handlers =
        new Map<string, CommandHandlerEntry>()

    setHandler(type:string,handler:any,pluginId: string | null) {
        this.handlers.set(type,{handler,pluginId});
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

import {IPluginContext} from "@/core/platform/plugin/PluginContext";
import { createPluginLogger } from "@/core/logger/pluginLogger"
import { EventBus } from "@/core/platform/event/EventBus"
import { CommandBus } from "@/core/platform/command/CommandBus"
import { QueryBus } from "@/core/platform/query/QueryBus"
import { createPluginSlotApi } from "@/core/platform/slot/createPluginSlotApi"
import {IApplication} from "@/core/platform/application/types";

export class PluginContextFactory {

    private cache =
        new Map<string, IPluginContext>()

    constructor(
        protected app:IApplication
    ) {}

    get(pluginId: string): IPluginContext {

        const existing =
            this.cache.get(pluginId)

        if (existing) {
            return existing
        }

        const ctx: IPluginContext = Object.freeze({

            pluginId,

            logger:
                createPluginLogger(pluginId, this.coreContext.logger),

            commandBus:
                new CommandBus(this.coreContext.messageBus,this.coreContext.commands),

            eventBus:
                new EventBus(this.coreContext.messageBus,this.coreContext.events),

            queryBus:
                new QueryBus(this.coreContext.messageBus,this.coreContext.queries),

            slots:
                createPluginSlotApi(pluginId, this.coreContext.slots)

        })

        this.cache.set(pluginId, ctx)

        return ctx

    }

}

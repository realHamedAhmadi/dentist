import {EventBus} from "@/core/platform/event/EventBus";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {QueryBus} from "@/core/platform/query/QueryBus";
import {Logger} from "@/core/logger/Logger";
import {createPluginSlotApi} from "@/core/platform/slot/createPluginSlotApi"

export interface IPluginContext {
    pluginId: string

    eventBus: EventBus
    commandBus: CommandBus
    queryBus: QueryBus

    slots: createPluginSlotApi,

    logger: Logger
}

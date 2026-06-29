import {EventBus} from "@/core/platform/event/EventBus";
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {QueryBus} from "@/core/platform/query/QueryBus";
import {Logger} from "@/core/logger/Logger";
import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {SlotRegistry} from "@/core/platform/slot/SlotRegistry";
import {createPluginSlotApi} from "@/core/platform/slot/createPluginSlotApi"

export interface IPluginContext {
    pluginId: string

    eventBus: EventBus
    commandBus: CommandBus
    queryBus: QueryBus

    slots: createPluginSlotApi,

    logger: Logger
}

import {IContainer} from "@/core/platform/container/types";
import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {SlotRegistry} from "@/core/platform/slot/SlotRegistry";
import {Logger} from "@/core/logger/Logger";
import {ServiceProviderConstructor} from "@/core/platform/service-providers/types";
import {PluginRegistry} from "@/core/platform/plugin/PluginRegistry";

export type DirType= 'ltr' | 'rtl'

export type AppType= 'admin' | 'client'

export interface IApplication extends IContainer{
    readonly plugins: PluginRegistry;

    getType():string

    getLang():string

    setLang(lang:string):void

    getDir():DirType

    setDir(dir:DirType):void

    bootstrap():void

    register(provider: ServiceProviderConstructor): void
}

import {PluginDescriptor} from "@/core/platform/plugin/types";

export interface PluginGraphNode {

    id: string

    descriptor: PluginDescriptor

    dependencies: Set<string>

    dependents: Set<string>

}

import {PluginLoader} from "@/core/platform/plugin/PluginLoader";
import {PluginDependencyResolver} from "@/core/platform/plugin/PluginDependencyResolver";
import {PluginSetup} from "@/core/platform/plugin/PluginSetup";

export class PluginRuntime {

    constructor(
        private loader:PluginLoader,
        private resolver:PluginDependencyResolver,
        private setup:PluginSetup
    ) {}

    async boot(pluginPaths: string[]) {

        // 1 load
        const descriptors =
            await this.loader.load(pluginPaths)

        // 2 resolve dependency graph
        const order =
            this.resolver.resolve(descriptors)

        // 3 setup phase
        await this.setup.runSetup(order)

        // 4 start phase
        await this.setup.runStart(order)

    }

}

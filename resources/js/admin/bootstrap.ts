//bootstrap.ts
import {PluginSetup} from "@/core/platform/plugin/PluginSetup"
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {Logger} from "@/core/logger/Logger";
import {redactPasswords} from "@/core/logger/middlewares/RedactSensitiveDataMiddleware";
import {ConsoleTransport} from "@/core/logger/transports/console.transport";
import {BatchTransport} from "@/core/logger/transports/batch.transport";
import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {loggingMiddleware} from "@/core/platform/messaging/middlewares/MessageLoggingMiddleware";
import {PluginDependencyResolver} from "@/core/platform/plugin/PluginDependencyResolver";
import {PluginLoader} from "@/core/platform/plugin/PluginLoader";
import {SlotRegistry} from "@/core/platform/slot/SlotRegistry";
import {PluginRuntime} from "@/core/platform/plugin/PluginRuntime";
import {ExtensionDiscovery} from "@/core/platform/extension/ExtensionDiscovery";
import {ExtensionLoader} from "@/core/platform/extension/ExtensionLoader";
import {pluginActivationMiddleware} from "@/core/platform/messaging/middlewares/PluginActivationMiddleware";
import {PluginActivationManager} from "@/core/platform/plugin/PluginActivationManager";
import {PluginContextFactory} from "@/core/platform/plugin/PluginContextFactory";
import {Container} from "@/core/platform/container/Container";
import {Application} from "@/core/platform/application/Application";

/**
 * Bootstraps the entire plugin runtime and returns a ready-to-use instance.
 */
export async function bootstrap() {

    const app=new Application('admin');
    app.bootstrap();
    return app
    /*const eventRegistry = container.make(EventRegistry)



    const logger = container.make(Logger, {
        transports: [
            new ConsoleTransport(),
            /!*new BatchTransport(
                "/api/logs"
            )*!/
        ]
    })

    const slots = new SlotRegistry();

    const ctx: Context = {
        messageBus,

        events,
        commands,
        queries,

        slots,

        logger
    }
    const pluginContextFactory = new PluginContextFactory(ctx)
    const pluginActivationManager = new PluginActivationManager(pluginContextFactory);

    /!*logger.use(redactPasswords)
    messageBus.use(loggingMiddleware(logger))
    messageBus.use(pluginActivationMiddleware(
        pluginActivationManager,
        events,
        commands,
        queries
    ))*!/

    const extensionDiscovery = new ExtensionDiscovery();
    const extensionLoader = new ExtensionLoader(slots);
    const setup = new PluginSetup(pluginContextFactory, extensionDiscovery, extensionLoader)
    const resolver = new PluginDependencyResolver();
    const loader = new PluginLoader();
    const runtime = new PluginRuntime(loader, resolver, setup)

    await runtime.boot(
        [
            '/resources/js/plugins/client',
            '/resources/js/plugins/order'
        ]
    )

    return runtime*/
}

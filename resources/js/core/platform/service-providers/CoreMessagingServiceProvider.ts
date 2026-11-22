import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken"
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {EventBus} from "@/core/platform/event/EventBus";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {QueryBus} from "@/core/platform/query/QueryBus";

export class CoreMessagingServiceProvider extends ServiceProvider {
    boot?(): void {

    }
    register(): void {
        this.app.singleton(ServiceTokens.EVENT_REGISTRY, EventRegistry);
        this.app.singleton(ServiceTokens.COMMAND_REGISTRY, CommandRegistry);
        this.app.singleton(ServiceTokens.QUERY_REGISTRY, QueryRegistry);

        this.app.singleton(ServiceTokens.MESSAGE_BUS, () => {
            const message = new MessageBus(
                this.app.make(ServiceTokens.EVENT_REGISTRY),
                this.app.make(ServiceTokens.COMMAND_REGISTRY),
                this.app.make(ServiceTokens.QUERY_REGISTRY),
                this.app.make(ServiceTokens.PIPELINE_FACTORY)
            );
            this.setMiddlewares(message);
            return message;
        });
        this.app.singleton(ServiceTokens.EVENT_BUS, () =>
            new EventBus(
                this.app.make(ServiceTokens.MESSAGE_BUS),
                this.app.make(ServiceTokens.EVENT_REGISTRY)
            )
        );
        this.app.singleton(ServiceTokens.COMMAND_BUS, () =>
            new CommandBus(
                this.app.make(ServiceTokens.MESSAGE_BUS),
                this.app.make(ServiceTokens.COMMAND_REGISTRY)
            )
        );
        this.app.singleton(ServiceTokens.QUERY_BUS, () =>
            new QueryBus(
                this.app.make(ServiceTokens.MESSAGE_BUS),
                this.app.make(ServiceTokens.QUERY_REGISTRY)
            )
        );
    }

    protected setMiddlewares(message) {
        //message.use(new MessageLoggingMiddleware())
    }
}

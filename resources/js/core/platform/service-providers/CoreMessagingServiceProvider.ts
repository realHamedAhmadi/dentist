import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {EventRegistry} from "@/core/platform/event/EventRegistry";
import {CommandRegistry} from "@/core/platform/command/CommandRegistry";
import {QueryRegistry} from "@/core/platform/query/QueryRegistry";
import {MessageBus} from "@/core/platform/messaging/MessageBus";
import {EventBus} from "@/core/platform/event/EventBus";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {QueryBus} from "@/core/platform/query/QueryBus";
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {MessageLoggingMiddleware} from "@/core/platform/messaging/middlewares/MessageLoggingMiddleware";

export class CoreMessagingServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton(EventRegistry, EventRegistry);
        this.app.singleton(CommandRegistry, CommandRegistry);
        this.app.singleton(QueryRegistry, QueryRegistry);

        this.app.singleton(MessageBus, () => {
            const message = new MessageBus(
                this.app.make(EventRegistry),
                this.app.make(CommandRegistry),
                this.app.make(QueryRegistry),
                this.app.make(PipelineFactory)
            );
            this.setMiddlewares(message);
            return message;
        });
        this.app.singleton(EventBus, () =>
            new EventBus(
                this.app.make(MessageBus),
                this.app.make(EventRegistry)
            )
        );
        this.app.singleton(CommandBus, () =>
            new CommandBus(
                this.app.make(MessageBus),
                this.app.make(CommandRegistry)
            )
        );
        this.app.singleton(QueryBus, () =>
            new QueryBus(
                this.app.make(MessageBus),
                this.app.make(QueryRegistry)
            )
        );
    }

    protected setMiddlewares(message) {
        //message.use(new MessageLoggingMiddleware())
    }
}

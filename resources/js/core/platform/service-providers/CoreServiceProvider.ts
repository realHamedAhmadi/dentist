import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {Pipeline} from "@/core/pipeline/Pipeline";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export class CoreServiceProvider extends ServiceProvider {
    register(): void {
        this.app.bind(Pipeline,()=>
            new Pipeline(this.app)
        )
        this.app.singleton(ServiceTokens.PIPELINE_FACTORY,()=>
            new PipelineFactory(this.app)
        )
    }
}

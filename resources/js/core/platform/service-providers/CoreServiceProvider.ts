import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {Pipeline} from "@/core/pipeline/Pipeline";

export class CoreServiceProvider extends ServiceProvider {
    register(): void {
        this.app.bind(Pipeline,()=>
            new Pipeline(this.app)
        )
        this.app.singleton(PipelineFactory,()=>
            new PipelineFactory(this.app)
        )
    }
}

import {Pipeline} from "@/core/pipeline/Pipeline";
import {Pipe} from "@/core/pipeline/types";
import {IContainer} from "@/core/platform/container/types";

export class PipelineFactory<T = any, R = any> {

    private cachedPipes: Pipe<T, R>[] = [];

    constructor(private readonly container: IContainer) {}

    getPipes(): Pipe<T, R>[]  {
        // Return cached middleware stack
        return this.cachedPipes;
    }

    create(): Pipeline<T, R> {
        const pipeline = this.container.make<Pipeline<T, R>>(Pipeline);
        pipeline.through(this.cachedPipes);
        return pipeline;
    }

    register(pipe: Pipe<T, R>) {
        this.cachedPipes.push(pipe);
    }
}

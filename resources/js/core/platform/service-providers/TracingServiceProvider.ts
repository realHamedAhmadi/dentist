import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {Tracer} from "@/core/tracing/Tracer";
import {
    TRACING_EXPORTER,
    TRACING_ID_GENERATOR,
    TRACING_PERSISTENCE,
    TRACING_REDACTOR,
    TRACING_SAMPLER
} from "@/core/platform/tokens/tracing";
import {ProbabilitySampler} from "@/core/tracing/sampler";
import {KeyBasedRedactor} from "@/core/tracing/redactor";
import {BatchSpanExporter} from "@/core/tracing/exporters/BatchSpanExporter";
import {FetchSpanExporter} from "@/core/tracing/exporters/FetchSpanExporter";
import {LocalStorageSpanPersistence} from "@/core/tracing/persistences/LocalStorageSpanPersistence";
import {InMemorySpanPersistence} from "@/core/tracing/persistences/InMemorySpanPersistence";
import {DefaultIdGenerator} from "@/core/tracing/IdGenerator";
import {TraceContextStore} from "@/core/tracing/TraceContextStore";
import {AsyncPatcher} from "@/core/tracing/AsyncPatcher";
import {HttpTracer} from "@/core/tracing/HttpTracer";

export class TracingServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton(TRACING_SAMPLER,()=>
            new ProbabilitySampler(0.25)
        )
        this.app.singleton(TRACING_REDACTOR,()=>
            new KeyBasedRedactor()
        )
        const persistence = new LocalStorageSpanPersistence({
            store: window.localStorage,
            key: "app:trace:pending",
            capacity: 2000, // If full, new items replace old ones
        })
        this.app.singleton(TRACING_PERSISTENCE,()=>
            new InMemorySpanPersistence()
        )
        this.app.singleton(FetchSpanExporter,()=>
            new FetchSpanExporter('api/tracing')
        )

        this.app.singleton(TRACING_EXPORTER,()=>
            new BatchSpanExporter(
                this.app.make(FetchSpanExporter)
            )
        )
        this.app.singleton(TRACING_ID_GENERATOR,()=>
            new DefaultIdGenerator()
        )
        this.app.singleton(TraceContextStore,TraceContextStore)
        this.app.singleton(Tracer,()=>
            new Tracer(
                this.app.make(TRACING_SAMPLER),
                this.app.make(TRACING_REDACTOR),
                this.app.make(TRACING_EXPORTER),
                this.app.make(TRACING_ID_GENERATOR),
                this.app.make(TraceContextStore),
            )
        )

        this.app.singleton(HttpTracer,()=>{
            const patcher=new HttpTracer(this.app.make(Tracer))
            patcher.install();
            return patcher;
        })
        new AsyncPatcher(this.app.make(TraceContextStore)).patch();
    }
}

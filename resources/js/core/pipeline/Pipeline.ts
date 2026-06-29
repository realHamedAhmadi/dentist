import {IContainer} from "@/core/platform/container/types";
import {NextFunction, Pipe, PipeClass, PipeFunction} from "@/core/pipeline/types";

export class Pipeline<T = any, R = any> {

    private container?: IContainer
    private passable: T | null = null
    private pipes: Pipe<T, R>[] = []
    private method: string = "handle"
    private finalCallback: ((context: T) => void) | null = null

    constructor(container?: IContainer) {
        this.container = container
    }

    /**
     * Set pipeline payload
     */
    send(context: T) {
        this.passable = context
        return this
    }

    /**
     * Replace pipes
     */
    through(pipes: Pipe<T, R>[]) {
        this.pipes = pipes
        return this
    }

    /**
     * Append pipes
     */
    pipe(pipes: Pipe<T, R> | Pipe<T, R>[]) {

        const list = Array.isArray(pipes) ? pipes : [pipes]

        this.pipes.push(...list)

        return this
    }

    /**
     * Change class method name
     */
    via(method: string) {
        this.method = method
        return this
    }

    /**
     * Execute pipeline
     */
    async then(destination: NextFunction<T, R>): Promise<R> {

        if (this.passable === null) {
            throw new Error("Pipeline requires send() before then()")
        }

        const stack = this.pipes
            .slice()
            .reverse()
            .reduce<NextFunction<T, R>>(
                (next, pipe) => {
                    return async (context: T) => {
                        return this.invokePipe(pipe, context, next)
                    }
                },
                destination
            )

        try {
            return await stack(this.passable)
        } finally {

            if (this.finalCallback) {
                this.finalCallback(this.passable)
            }

            // reset state
            this.passable = null
            this.pipes = []
            this.finalCallback = null
        }
    }

    /**
     * Execute pipeline and return context
     */
    thenReturn(): Promise<T> {
        return this.then(async ctx => ctx as unknown as R)
    }

    /**
     * Finally hook
     */
    finally(callback: (context: T) => void) {
        this.finalCallback = callback
        return this
    }

    /**
     * Execute single pipe
     */
    private async invokePipe(
        pipe: Pipe<T, R>,
        context: T,
        next: NextFunction<T, R>
    ): Promise<R> {

        const instance = this.resolvePipe(pipe)

        // function middleware
        if (typeof instance === "function") {
            return instance(context, next)
        }

        // class middleware
        if (instance && typeof instance[this.method] === "function") {
            return instance[this.method](context, next)
        }

        throw new Error(`Pipeline pipe missing method "${this.method}"`)
    }

    /**
     * Resolve pipe via container
     */
    private resolvePipe(pipe: Pipe<T, R>): any {

        // functional middleware
        if (this.isFunctionPipe(pipe)) {
            return pipe
        }

        // class constructor
        if (this.isPipeClass(pipe)) {

            if (!this.container) {
                throw new Error("Container required to resolve pipe class")
            }

            return this.container.make(pipe)
        }

        // container token (string | symbol)
        if (typeof pipe === "string" || typeof pipe === "symbol") {

            if (!this.container) {
                throw new Error("Container required to resolve pipe token")
            }

            return this.container.make(pipe)
        }

        // instance middleware
        return pipe
    }

    private isPipeClass<T, R>(pipe: any): pipe is PipeClass<T, R> {
        return typeof pipe === "function" && pipe.prototype && pipe.prototype.handle
    }
    private isFunctionPipe(pipe: any): pipe is PipeFunction<any> {
        return typeof pipe === "function" && !pipe.prototype
    }
}

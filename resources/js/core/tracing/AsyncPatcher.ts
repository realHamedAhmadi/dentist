import { TraceContextStore } from "./TraceContextStore"

/**
 * Patches async/browser APIs so callbacks run with current tracing context.
 * Instance-based version (no static global context).
 */
export class AsyncPatcher {
    private isPatched = false

    constructor(private readonly contextStore: TraceContextStore) {}

    patch(): void {
        if (this.isPatched) return
        this.isPatched = true

        this.patchPromise()
        this.patchTimeout()
        this.patchInterval()
        this.patchQueueMicrotask()
        this.patchEventListener()
    }

    /**
     * Bind a callback to current context snapshot.
     */
    private bind<T extends (...args: any[]) => any>(fn: T): T {
        const current = this.contextStore.getCurrent()

        // If no active context, keep original function
        if (!current) return fn

        const wrapped = ((...args: Parameters<T>) => {
            return this.contextStore.run(current, () => fn(...args))
        }) as T

        return wrapped
    }

    private patchPromise(): void {
        const originalThen = Promise.prototype.then
        const originalCatch = Promise.prototype.catch
        const originalFinally = Promise.prototype.finally

        const bind = this.bind.bind(this)

        Promise.prototype.then = function (onFulfilled?: any, onRejected?: any) {
            const fulfilled =
                typeof onFulfilled === "function" ? bind(onFulfilled) : onFulfilled

            const rejected =
                typeof onRejected === "function" ? bind(onRejected) : onRejected

            return originalThen.call(this, fulfilled, rejected)
        }

        Promise.prototype.catch = function (onRejected?: any) {
            const rejected =
                typeof onRejected === "function" ? bind(onRejected) : onRejected

            return originalCatch.call(this, rejected)
        }

        Promise.prototype.finally = function (onFinally?: any) {
            const final = typeof onFinally === "function" ? bind(onFinally) : onFinally
            return originalFinally.call(this, final)
        }
    }

    private patchTimeout(): void {
        const original = window.setTimeout
        const bind = this.bind.bind(this)

        window.setTimeout = function (
            handler: TimerHandler,
            timeout?: number,
            ...args: any[]
        ): number {
            if (typeof handler === "function") {
                const wrapped = bind(handler as (...a: any[]) => any)
                return original(wrapped as TimerHandler, timeout, ...args)
            }

            return original(handler, timeout, ...args)
        }
    }

    private patchInterval(): void {
        const original = window.setInterval
        const bind = this.bind.bind(this)

        window.setInterval = function (
            handler: TimerHandler,
            timeout?: number,
            ...args: any[]
        ): number {
            if (typeof handler === "function") {
                const wrapped = bind(handler as (...a: any[]) => any)
                return original(wrapped as TimerHandler, timeout, ...args)
            }

            return original(handler, timeout, ...args)
        }
    }

    private patchQueueMicrotask(): void {
        const original = window.queueMicrotask
        const bind = this.bind.bind(this)

        window.queueMicrotask = function (callback: VoidFunction): void {
            const wrapped = bind(callback)
            return original(wrapped)
        }
    }

    private patchEventListener(): void {
        const original = EventTarget.prototype.addEventListener
        const bind = this.bind.bind(this)

        EventTarget.prototype.addEventListener = function (
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ): void {
            if (typeof listener === "function") {
                const wrapped = bind(listener as (...a: any[]) => any)
                return original.call(this, type, wrapped, options)
            }

            // Keep object listeners ({ handleEvent() {} }) unchanged
            return original.call(this, type, listener, options)
        }
    }
}

/**
 * Token type for service registration
 */
export type Token<T = any> = string | symbol | (new (...args: any[]) => T);



/**
 * Service lifetime options
 */
export enum Lifetime {
    Singleton = "SINGLETON",
    Transient = "TRANSIENT",
    Scoped = "SCOPED",
}


/**
 * Internal binding structure
 */
export interface Binding<T = any> {
    lifetime: Lifetime;
    implementation: any;
    instance?: T;
}

export interface IContainer {
    /**
     * Register singleton service
     */
    singleton<T>(token: Token<T>, implementation: any)
    /**
     * Register a singleton service only if it hasn't been bound yet.
     */
    singletonIf<T>(token: Token<T>, implementation: any): void
    /**
     * Register transient service
     */
    bind<T>(token: Token<T>, implementation: any)
    /**
     * Register a transient service only if it hasn't been bound yet.
     */
    bindIf<T>(token: Token<T>, implementation: any): void
    /**
     * Extend an existing binding.
     */
    extend<T>(
        token: Token<T>,
        extender: (instance: T, app: IContainer) => T
    ):void
    /**
     * Register scoped service
     */
    scoped<T>(token: Token<T>, implementation: any): void
    /**
     * Resolve dependency
     */
    resolve<T>(token: Token<T>, parameters?: Record<string, any>): T
    /**
     * Resolve the given type from the container.
     */
    make<T>(token: Token<T> | string, parameters?: Record<string, any>): T
    /**
     * Create new scope
     */
    createScope():IContainer
}

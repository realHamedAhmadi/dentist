import '@/core/libs/reflect-metadata.js';
import {isDev} from '@/core/config/env';
import {Token, Lifetime, IContainer} from './types';

/**
 * A constructable class type.
 */
type Constructor<T = any> = new (...args: any[]) => T;

/**
 * A factory that creates an instance using the container.
 */
type Factory<T = any> = (container: Container, parameters?: Record<string, any>) => T;

type BindingValue<T = any> = {
    lifetime: Lifetime;
    useValue: T;
};

type BindingClass<T = any> = {
    lifetime: Lifetime;
    useClass: Constructor<T>;
};

type BindingFactory<T = any> = {
    lifetime: Lifetime;
    useFactory: Factory<T>;
};


type Binding<T = any> = BindingValue<T> | BindingClass<T> | BindingFactory<T>;


function isObject(value: any): value is object {
    return value !== null && typeof value === 'object';
}

function hasOwn(obj: any, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Enterprise-grade Dependency Injection Container.
 * Fully token-based for modularity.
 */
export class Container implements IContainer {
    private bindings = new Map<Token, Binding>();
    private scopedInstances = new Map<Token, any>();
    private singletonInstances = new Map<Token, any>();

    private aliases = new Map<Token, Token>();
    private abstractAliases = new Map<Token, Set<Token>>();
    private reboundCallbacks = new Map<Token, Array<(instance: any) => void>>();

    private resolvingStack: Token[] = [];
    private parent?: Container;

    constructor(parent?: Container) {
        this.parent = parent;
    }

    /**
     * Register a pre-built instance (value) as a singleton.
     */
    public instance<T>(token: Token<T>, instance: T): T {
        this.removeAbstractAlias(token);
        this.aliases.delete(token);

        const alreadyBound = this.bound(token);

        this.singletonInstances.set(token, instance);
        this.bindings.set(token, {lifetime: Lifetime.Singleton, useValue: instance});

        if (alreadyBound) {
            this.triggerRebound(token);
        }

        return instance;
    }

    /**
     * Register a singleton class.
     */
    public singleton<T>(token: Token<T>, implementation: Constructor<T> | Factory<T> | T): void {
        this.storeBinding(token, Lifetime.Singleton, implementation);
    }

    public singletonIf<T>(token: Token<T>, implementation: Constructor<T> | Factory<T> | T): void {
        if (!this.bound(token)) this.singleton(token, implementation);
    }

    /**
     * Register a transient service.
     */
    public bind<T>(token: Token<T>, implementation: Constructor<T> | Factory<T> | T): void {
        this.storeBinding(token, Lifetime.Transient, implementation);
    }

    public bindIf<T>(token: Token<T>, implementation: Constructor<T> | Factory<T> | T): void {
        if (!this.bound(token)) this.bind(token, implementation);
    }

    /**
     * Extend an existing binding.
     */
    public extend<T>(
        token: Token<T>,
        extender: (instance: T, app: IContainer) => T
    ): void {

        const binding = this.getBinding(token);

        if (!binding) {
            throw new Error(`Cannot extend unregistered binding: ${this.tokenToString(token)}`);
        }

        // Remove cached instances to ensure extender runs
        this.singletonInstances.delete(token);
        this.scopedInstances.delete(token);

        // VALUE binding
        if ('useValue' in binding) {
            const original = binding.useValue;
            binding.useValue = extender(original, this);
            return;
        }

        // CLASS binding
        if ('useClass' in binding) {
            const OriginalClass = binding.useClass;

            binding.useFactory = (app: Container, parameters?: Record<string, any>) => {
                const instance = app.instantiate(OriginalClass, parameters ?? {});
                return extender(instance, app);
            };

            delete (binding as any).useClass;
            return;
        }

        // FACTORY binding
        if ('useFactory' in binding) {
            const originalFactory = binding.useFactory;

            binding.useFactory = (app: Container, parameters?: Record<string, any>) => {
                const instance = originalFactory(app, parameters);
                return extender(instance, app);
            };
            return;
        }
    }


    /**
     * Register a scoped service.
     */
    public scoped<T>(token: Token<T>, implementation: Constructor<T> | Factory<T> | T): void {
        this.storeBinding(token, Lifetime.Scoped, implementation);
    }

    /**
     * Register an alias for a token.
     */
    public alias(abstract: Token, alias: Token): void {
        if (abstract === alias) throw new Error('A token cannot be aliased to itself.');

        this.aliases.set(alias, abstract);

        const set = this.abstractAliases.get(abstract) ?? new Set<Token>();
        set.add(alias);
        this.abstractAliases.set(abstract, set);
    }

    /**
     * Determine if a token or alias is bound (this container or parents).
     */
    public bound(token: Token): boolean {
        const actual = this.getAlias(token);

        return (
            this.bindings.has(actual) ||
            this.singletonInstances.has(actual) ||
            this.scopedInstances.has(actual) ||
            this.aliases.has(token) ||
            (this.parent?.bound(actual) ?? false)
        );
    }

    /**
     * An alias for resolve().
     */
    public make<T>(token: Token<T>, parameters: Record<string, any> = {}): T {
        return this.resolve(token, parameters);
    }

    /**
     * Resolve a token from the container.
     */
    public resolve<T>(token: Token<T>, parameters: Record<string, any> = {}): T {
        token = this.getAlias(token);

        // Singleton cache lookup (this container)
        if (this.singletonInstances.has(token)) {
            return this.singletonInstances.get(token);
        }

        // Scoped cache lookup (this scope only)
        if (this.scopedInstances.has(token)) {
            return this.scopedInstances.get(token);
        }

        const binding = this.getBinding(token);

        if (!binding) {
            throw new Error(`Service not found: ${this.tokenToString(token)}`);
        }

        this.checkCircularDependency(token);
        this.resolvingStack.push(token);

        try {
            if ('useValue' in binding) {
                // Value binding: cache according to lifetime
                return this.cacheByLifetime(token, binding.lifetime, binding.useValue);
            }

            const built =
                'useClass' in binding
                    ? this.instantiate(binding.useClass, parameters)
                    : binding.useFactory(this, parameters);

            return this.cacheByLifetime(token, binding.lifetime, built);
        } finally {
            this.resolvingStack.pop();
        }
    }

    /**
     * Create a new child container (scope).
     */
    public createScope(): Container {
        return new Container(this);
    }

    /**
     * Register a rebound listener for a specific token.
     */
    public rebinding(token: Token, callback: (instance: any) => void): void {
        const actual = this.getAlias(token);
        const callbacks = this.reboundCallbacks.get(actual) ?? [];
        callbacks.push(callback);
        this.reboundCallbacks.set(actual, callbacks);
    }

    /**
     * Call a function or method and inject its dependencies (reflect-based).
     */
    public call<T = unknown>(
        callback: Function | [any, string] | string,
        parameters: Record<string, any> = {},
        defaultMethod?: string
    ): T {
        if (typeof callback === 'string') {
            const [className, method] = callback.split('@');
            const cls: any = (globalThis as any)[className];

            if (!cls) throw new Error(`Class not found: ${className}`);

            const instance = this.resolve(cls);
            const methodName = method || defaultMethod;

            if (!methodName) {
                throw new Error(`No method specified for callback: "${callback}"`);
            }

            return this.invoke(instance, methodName, parameters);
        }

        if (Array.isArray(callback)) {
            const [target, method] = callback;
            const instance = typeof target === 'function' ? this.resolve(target) : target;
            return this.invoke(instance, method, parameters);
        }

        return this.invokeFunction(callback, parameters);
    }

    /**
     * Core registration logic.
     * NOTE: We avoid heuristics. If you pass an object => useValue.
     * If you pass a function => default to useFactory UNLESS it's a class constructor (best-effort).
     * For 100% robustness, you can expose explicit APIs: bindClass/bindFactory/bindValue.
     */
    private storeBinding<T>(
        token: Token<T>,
        lifetime: Lifetime,
        implementation: Constructor<T> | Factory<T> | T
    ): void {
        this.removeAbstractAlias(token);
        this.aliases.delete(token);

        // If it's an object instance => value binding
        if (isObject(implementation)) {
            this.bindings.set(token, {lifetime, useValue: implementation});
            return;
        }

        // If it's not a function and not an object, treat as value (primitives)
        if (typeof implementation !== 'function') {
            this.bindings.set(token, {lifetime, useValue: implementation as T});
            return;
        }

        // Best-effort: treat as class if it looks like a class OR has prototype methods
        if (this.looksLikeClass(implementation)) {
            this.bindings.set(token, {lifetime, useClass: implementation as Constructor<T>});
            return;
        }

        // Otherwise treat as factory
        this.bindings.set(token, {lifetime, useFactory: implementation as Factory<T>});
    }

    private cacheByLifetime<T>(token: Token<T>, lifetime: Lifetime, value: T): T {
        switch (lifetime) {
            case Lifetime.Singleton:
                this.singletonInstances.set(token, value);
                return value;

            case Lifetime.Scoped:
                this.scopedInstances.set(token, value);
                return value;

            case Lifetime.Transient:
            default:
                return value;
        }
    }

    /**
     * Instantiate a class using reflection-based constructor injection.
     */
    private instantiate<T>(target: Constructor<T>, parameters: Record<string, any> = {}): T {
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target) || [];

        const args = paramTypes.map((paramType, index) => {
            // 1) If user provided explicit index-based parameter, use it
            const keyByIndex = String(index);
            if (hasOwn(parameters, keyByIndex)) {
                return parameters[keyByIndex];
            }

            // 2) If user provided a matching instance by type, use it
            const byType = this.findMatchingParameter(paramType, parameters);
            if (byType.found) return byType.value;

            // 3) Otherwise resolve from container
            return this.resolve(paramType);
        });

        return new target(...args);
    }

    private invoke(instance: any, method: string, parameters: Record<string, any>): any {
        const types = Reflect.getMetadata('design:paramtypes', instance, method) || [];
        const args = this.resolveCallArguments(types, parameters);
        return instance[method](...args);
    }

    private invokeFunction(fn: Function, parameters: Record<string, any>): any {
        const types = Reflect.getMetadata('design:paramtypes', fn) || [];
        const args = this.resolveCallArguments(types, parameters);
        return fn(...args);
    }

    private resolveCallArguments(types: any[], parameters: Record<string, any>): any[] {
        return types.map((type, index) => {
            const keyByIndex = String(index);
            if (hasOwn(parameters, keyByIndex)) {
                return parameters[keyByIndex];
            }

            const provided = this.findMatchingParameter(type, parameters);
            if (provided.found) return provided.value;

            return this.resolve(type);
        });
    }

    /**
     * Find a matching manual parameter for a reflected type.
     */
    private findMatchingParameter(type: any, parameters: Record<string, any>): { found: boolean; value?: any } {
        for (const value of Object.values(parameters)) {
            if (this.matchesType(value, type)) {
                return {found: true, value};
            }
        }
        return {found: false};
    }

    private matchesType(value: any, type: any): boolean {
        if (!type) return false;

        if (type === String) return typeof value === 'string';
        if (type === Number) return typeof value === 'number';
        if (type === Boolean) return typeof value === 'boolean';
        if (type === Array) return Array.isArray(value);
        if (type === Object) return value !== null && typeof value === 'object';

        // For classes
        if (typeof type === 'function') {
            try {
                return value instanceof type;
            } catch {
                return false;
            }
        }

        return false;
    }

    /**
     * Better-than-previous heuristic for "class-ness".
     * Still not perfect; for perfect behavior prefer explicit bindValue/bindClass/bindFactory APIs.
     */
    private looksLikeClass(fn: Function): boolean {
        // Native/ES classes
        const src = Function.prototype.toString.call(fn);
        if (src.startsWith('class ')) return true;

        // Functions used as constructors usually have prototype with more than 'constructor'
        const proto = (fn as any).prototype;
        if (!proto) return false;

        const keys = Object.getOwnPropertyNames(proto);
        return keys.length > 1; // constructor + methods
    }

    private getAlias(token: Token): Token {
        return this.aliases.has(token) ? this.getAlias(this.aliases.get(token)!) : token;
    }

    private getBinding<T>(token: Token<T>): Binding<T> | undefined {
        return this.bindings.get(token) ?? this.parent?.getBinding(token);
    }

    protected triggerRebound(token: Token): void {
        const actual = this.getAlias(token);
        const callbacks = this.reboundCallbacks.get(actual);
        if (!callbacks || callbacks.length === 0) return;

        const instance = this.make(actual);
        for (const cb of callbacks) cb(instance);
    }

    protected removeAbstractAlias(token: Token): void {
        const aliases = this.abstractAliases.get(token);
        if (!aliases) return;

        for (const a of aliases) this.aliases.delete(a);
        this.abstractAliases.delete(token);
    }

    private checkCircularDependency(token: Token): void {
        if (!this.resolvingStack.includes(token)) return;

        const chain = [...this.resolvingStack, token].map((t) => this.tokenToString(t)).join(' → ');
        const message = `Circular dependency detected: ${chain}`;

        if (isDev()) throw new Error(message);
        console.warn(message);
    }

    private tokenToString(token: Token): string {
        if (typeof token === 'symbol') return token.toString();
        if (typeof token === 'function' && token.name) return token.name;
        return String(token);
    }
}

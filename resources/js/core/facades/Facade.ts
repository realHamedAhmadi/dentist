import { getApp } from "@/core/platform/application/appInstance";
import { Token } from "@/core/platform/container/types";

export abstract class Facade {
    protected static instance: unknown;

    protected static abstract getToken(): Token;

    protected static resolve<T>(): T {
        if (this.instance) return this.instance as T;
        this.instance = getApp().make(this.getToken());
        return this.instance as T;
    }

    public static clearResolvedInstance(): void {
        this.instance = undefined;
    }
}

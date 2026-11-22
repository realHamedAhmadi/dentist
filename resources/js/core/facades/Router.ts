import {RouteDefinition } from "@/core/platform/router/types";
import {Facade} from "@/core/facades/Facade";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";
export class Router extends Facade{
    protected static getToken() {
        return ServiceTokens.ROUTER
    }
    static addRoute(route: RouteDefinition): void {
        this.resolve().addRoute(route);
    }

    static addRoutes(routes: RouteDefinition[]): void {
        this.resolve().addRoutes(routes);
    }

    static getRoutes(): RouteDefinition[] {
        return this.resolve().getRoutes();
    }

    static find(path: string): RouteDefinition | undefined {
        return this.resolve().resolve(path);
    }
}

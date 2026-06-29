import { IRouter, RouteDefinition } from "./types";

/**
 * Application Router
 */
export class Router implements IRouter {

    private routes: RouteDefinition[] = [];

    addRoute(route: RouteDefinition): void {

        // store route
        this.routes.push(route);

    }

    addRoutes(routes: RouteDefinition[]): void {

        // add multiple routes
        this.routes.push(...routes);

    }

    getRoutes(): RouteDefinition[] {

        // return all routes
        return this.routes;

    }

    resolve(path: string): RouteDefinition | undefined {

        // find route by path
        return this.routes.find(r => r.path === path);

    }
}

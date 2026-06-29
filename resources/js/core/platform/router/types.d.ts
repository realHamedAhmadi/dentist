import {ReactNode, ComponentType} from "react";
import * as React from "react";
import {RouteObject} from "react-router-dom";

/**
 * Route meta information
 */
export interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    permissions?: string[];
}

/**
 * Route definition
 */
export interface RouteDefinition extends RouteObject{

    index?:boolean

    name?: string;

    path?: string;

    element?: React.ReactNode | null;

    Component?: RouteObject['Component'];

    lazy?: RouteObject['lazy']

    children?: RouteDefinition[];

    layout?: ComponentType<{ children: ReactNode }>;

    guard?: () => boolean | Promise<boolean>;

    meta?: RouteMeta;
}

/**
 * Router contract
 */
export interface IRouter {

    addRoute(route: RouteDefinition): void;

    addRoutes(routes: RouteDefinition[]): void;

    getRoutes(): RouteDefinition[];

    resolve(path: string): RouteDefinition | undefined;

}

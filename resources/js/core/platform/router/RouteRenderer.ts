import { useRoutes } from "react-router-dom";
import { RouteDefinition } from "./types";

interface Props {
    routes: RouteDefinition[];
}

export function RouteRenderer({ routes }: Props) {

    return useRoutes(routes as any);
}

import React from 'react'
import { RouteDefinition } from "@/core/platform/router/types";

const routes: RouteDefinition[] = [
    {
        path:'clients',
        children:[
            {
                name:'client.index',
                index:true,
                Component:React.lazy(()=>import("@/plugins/client/admin/pages/IndexPage"))
            },
            {
                name: "clients.create",
                path: "create",
                Component: React.lazy(() => import("@/plugins/client/admin/pages/createPage"))
            }
        ]
    }
];

export default routes;

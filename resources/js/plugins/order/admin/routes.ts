import React from 'react'
import { RouteDefinition } from "@/core/platform/router/types";

const routes: RouteDefinition[] = [
    {
        path:'orders',
        children:[
            {
                name:'orders.index',
                index:true,
                Component:React.lazy(()=>import("@/plugins/order/admin/pages/IndexPage"))
            },
            {
                name: "orders.create",
                path: "create",
                Component: React.lazy(() => import("@/plugins/order/admin/pages/createPage"))
            }
        ]
    }
];

export default routes;

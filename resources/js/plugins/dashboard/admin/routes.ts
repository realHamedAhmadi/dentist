import React from 'react'
import {Navigate} from 'react-router-dom'
import {RouteDefinition} from "@/core/platform/router/types";

const routes: RouteDefinition[] = [
    {
        index: true,
        Component:() => React.createElement(Navigate, { to: 'dashboard', replace: true })
    },
    {
        path: 'dashboard',
        Component:React.lazy(()=>import('@/plugins/dashboard/admin/DashboardPage'))
    }
];

export default routes;

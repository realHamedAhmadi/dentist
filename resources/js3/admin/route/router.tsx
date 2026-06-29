import {lazy} from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import LayoutRegistry from "@/admin/layouts/LayoutRegistry";

const Dashboard=lazy(()=>import('@/admin/features/dashboard'));
//clients
const ClientIndex=lazy(()=>import('@/admin/features/client'));
const ClientCreate=lazy(()=>import('@/admin/features/client/createPage'));
//orders
const OrderIndex=lazy(()=>import('@/admin/features/order'));
const OrderCreate=lazy(()=>import('@/admin/features/order/CreatePage'));

import {NotFound} from '@/shared/components'
export default createBrowserRouter([
    {
        path:'/admin',
        element:<LayoutRegistry/>,
        children:[
            {
                index:true,
                element:<Navigate to="dashboard" replace/>
            },
            {
                path:'dashboard',
                element:<Dashboard/>
            },
            {
                path:'clients',
                children:[
                    {
                        index:true,
                        element:<ClientIndex/>
                    },{
                        path:'create',
                        element:<ClientCreate/>
                    }
                ]
            },
            {
                path:'orders',
                children:[
                    {
                        index:true,
                        element:<OrderIndex/>
                    },{
                        path:'create',
                        element:<OrderCreate/>
                    }
                ]
            },
            {
                path:'*',
                element:<NotFound/>
            }
        ]
    }
])

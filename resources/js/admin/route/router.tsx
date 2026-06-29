import {createBrowserRouter} from "react-router-dom";
import LayoutRegistry from "@/admin/layouts/LayoutRegistry";
import {NotFound} from '@/core/shared/components/error'
import {Router} from "@/core/platform/router/Router";
import {IApplication} from "@/core/platform/application/types";
import {RouteObject} from "react-router-dom";
export const createRouter=(app:IApplication)=>{

    return createBrowserRouter([
        {
            path:'/admin',
            element:<LayoutRegistry/>,
            children:[
                ...app.make(Router).getRoutes() as RouteObject
                /* {
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
                 }*/
            ]
        },
        {
            path:'*',
            element:<NotFound/>
        }
    ])
}

export default createRouter

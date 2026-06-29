import React,{Suspense} from "react";
import {RouterProvider} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'

import {router} from '@/admin/route'
import {Spinner,ErrorFallback} from '@/shared/components'
import {AppThemeProvider} from "@/shared/providers";
import {OverlayProvider} from "@/shared/adaptive/overlay/OverlayProvider";


const App:React.FC=()=>{
    return(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Spinner/>}>
                <AppThemeProvider>
                    <OverlayProvider>
                        <RouterProvider router={router}></RouterProvider>
                    </OverlayProvider>
                </AppThemeProvider>
            </Suspense>
        </ErrorBoundary>
    )
}

export default App

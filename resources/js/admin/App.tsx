import React, {Suspense, useMemo} from "react";
import {RouterProvider} from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'

import {router} from '@/admin/route'
import {Spinner,ErrorFallback} from '@/core/shared/components'
import {AppThemeProvider} from "@/core/shared/providers";
import {OverlayProvider} from "@/core/shared/adaptive/overlay/OverlayProvider";
import {useApp} from "@/admin/AppContext";
import {useAppStore} from "@/core/shared/store/useAppStore";


const App:React.FC=()=>{
    const app = useAppStore((state) => state.app);
    const browserRouter=useMemo(()=>router(app),[app]);
    return(
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Spinner/>}>
                <AppThemeProvider>
                    <OverlayProvider>
                        <RouterProvider router={browserRouter}/>
                    </OverlayProvider>
                </AppThemeProvider>
            </Suspense>
        </ErrorBoundary>
    )
}

export default App

import {configureStore} from "@reduxjs/toolkit";
import {persistStore} from 'redux-persist'
import {FLUSH, PAUSE, PERSIST, REHYDRATE,PURGE,REGISTER} from 'redux-persist'
import {persistedReducer} from "@/core/shared/store/persistConfig";

export const store =configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false/*{
            ignoreActions:[
                FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER
            ]
        }*/
    })
})

export const persistor=persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch=typeof store.dispatch

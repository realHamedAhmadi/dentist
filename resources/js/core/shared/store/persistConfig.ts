import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'
import {combineReducers} from "@reduxjs/toolkit";
import reducers from './slices'

const rootReducers=combineReducers(reducers)

const persistConfig={
    key:'root',
    storage,
    whitelist:['user']
}

export const persistedReducer=persistReducer(persistConfig,rootReducers)



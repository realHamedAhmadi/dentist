import { create } from 'zustand';
import { IApplication } from '@/core/platform/application/types';

interface AppState {
    app: IApplication | null;
    isInitialized: boolean;
    setApp: (appInstance: IApplication) => void;
}

export const useAppStore = create<AppState>((set) => ({
    app: null,
    isInitialized: false,
    setApp: (appInstance: IApplication) => set({
        app: appInstance,
        isInitialized: true
    }),
}));

export const getApp = () => useAppStore.getState().app;

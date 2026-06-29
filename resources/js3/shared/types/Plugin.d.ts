import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

export type PanelType = 'admin' | 'client';

export interface PluginMeta {
    id: string;
    title: string;
    description?: string;
    allowedPanels: PanelType[]; // which panels can use this plugin
    order?: number;             // sorting
}

export interface PanelMeta {
    id: string;
    title: string;
    description?: string;

}

export interface Plugin {
    meta: PluginMeta;
    routes?: RouteObject[];          // routes that this plugin adds
    menuItems?: ReactNode[];     // e.g. <NavLink/>s for side menu
    widgets?: ReactNode[];          // e.g. dashboard widgets
    // you can add more extension points later (toolbarItems, settings forms, etc.)
    panels:{

    }
}

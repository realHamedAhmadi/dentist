// A simple in-memory plugin registry
import { Plugin, PanelType } from '@/shared/types/Plugin';

class PluginRegistry {
    private plugins: Plugin[] = [];

    register(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    getAll() {
        return this.plugins;
    }

    getForPanel(panel: PanelType) {
        return this.plugins.filter(p => p.meta.allowedPanels.includes(panel));
    }

    getRoutesForPanel(panel: PanelType) {
        return this.getForPanel(panel).flatMap(p => p.routes ?? []);
    }

    getMenuItemsForPanel(panel: PanelType) {
        return this.getForPanel(panel).flatMap(p => p.menuItems ?? []);
    }

    getWidgetsForPanel(panel: PanelType) {
        return this.getForPanel(panel).flatMap(p => p.widgets ?? []);
    }
}

export const pluginRegistry = new PluginRegistry();

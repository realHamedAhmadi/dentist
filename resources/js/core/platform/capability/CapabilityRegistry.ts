export class CapabilityRegistry {

    private plugins = new Map()

    register(pluginId, capabilities) {
        this.plugins.set(pluginId, capabilities)
    }

    canPublishEvent(pluginId, event) {
        return this.plugins
            .get(pluginId)
            ?.events?.publish
            ?.includes(event)
    }

    canExecuteCommand(pluginId, command) {
        return this.plugins
            .get(pluginId)
            ?.commands?.execute
            ?.includes(command)
    }

    canConsumeEvent(pluginId, event) {
        return this.plugins
            .get(pluginId)
            ?.events?.consume
            ?.includes(event)
    }
}

/**
 * Global dependency injection tokens.
 */
export const ServiceTokens = {
    EVENT_REGISTRY: 'event_registry',
    COMMAND_REGISTRY: 'command_registry',
    QUERY_REGISTRY: 'query_registry',
    MESSAGE_BUS: 'message_bus',

    EVENT_BUS: 'event_bus',
    COMMAND_BUS: 'command_bus',
    QUERY_BUS: 'query_bus',
    PIPELINE_FACTORY: 'pipeline_factory',
    I18N_SERVICE: 'i18n_service',
    ROUTER: 'router',
    SLOT_REGISTRY: 'slot_registry',
    LOGGER: 'logger',
    TRACER: 'tracer',
} as const;



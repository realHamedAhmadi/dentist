export interface IEvent<T = unknown> {

    type: string

    payload: T

    meta?: {

        plugin?: string
        timestamp?: number
        correlationId?: string
    }

}

interface EventHandlerEntry {
    handler: (event: IEvent) => any

    pluginId: string | null
}

export interface IDisposable {
    dispose(): void
}

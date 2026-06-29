export interface ICommand<T = unknown> {

    type: string

    payload: T

    meta?: {

        plugin?: string
        correlationId?: string
    }

}

interface CommandHandlerEntry {
    handler: (command: ICommand) => any

    pluginId: string | null
}

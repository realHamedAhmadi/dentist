export interface IQuery<T = unknown> {

    type: string

    payload?: T

}

interface QueryHandlerEntry {
    handler: (query: IQuery) => any

    pluginId: string
}

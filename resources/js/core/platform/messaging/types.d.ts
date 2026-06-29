import {IPipe} from "@/core/pipeline/types";

export type MessageKind =
    | "event"
    | "command"
    | "query"

export interface IMessage<T = unknown> {

    kind: MessageKind

    type: string

    payload?: T

    meta?: {

        plugin?: string

        correlationId?: string

        causationId?: string

        timestamp?: number

    }

}

export type MessageMiddleware =IPipe<IMessage, unknown>


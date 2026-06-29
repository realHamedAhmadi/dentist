import { Token } from "@/core/platform/container/types"
/**
 * Next middleware function
 */
export type NextFunction<T, R = any> = (context: T) => Promise<R>

/**
 * Functional middleware
 */
export type PipeFunction<T, R = any> = (
    context: T,
    next: NextFunction<T, R>,
    ...params: any[]
) => Promise<R> | R

/**
 * Class middleware contract
 */
export interface IPipe<T = any, R = any> {
    handle(
        context: T,
        next: NextFunction<T, R>,
        ...params: any[]
    ): Promise<R> | R
}

/**
 * Pipe constructor
 */
export type PipeClass<T, R = any> = new (...args: any[]) => IPipe<T, R>

/**
 * Pipe token for container
 */
export type PipeToken<T, R = any> = Token<IPipe<T, R>>

/**
 * Supported pipe types
 */
export type Pipe<T, R = any> =
    | PipeFunction<T, R>
    | IPipe<T, R>
    | PipeClass<T, R>
    | PipeToken<T, R>

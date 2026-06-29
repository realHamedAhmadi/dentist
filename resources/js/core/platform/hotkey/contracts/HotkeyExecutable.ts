/**
 * Execution context delivered to any hotkey handler
 */
import {IApplication} from "@/core/platform/application/types";

export interface HotkeyExecutionContext {
    combo: string
    sequence: string[]
    interactionId: number
}

export type HotkeyCommandExecutablePayload={
    context:HotkeyExecutionContext,
    app:IApplication
}

/**
 * Function-based executable
 */
export type HotkeyFunctionExecutable = (
    context: HotkeyExecutionContext,
    app:IApplication
) => void | Promise<void>

/**
 * Class-based executable contract
 */
export interface HotkeyClassExecutable {
    execute(context: HotkeyExecutionContext,app:IApplication): void | Promise<void>
}

/**
 * Constructor signature for class executables
 */
export type HotkeyClassConstructor = new (...args: any[]) => HotkeyClassExecutable

/**
 * Any executable payload referenced by a hotkey entry
 */
export type HotkeyExecutable =
    | string
    | HotkeyFunctionExecutable
    | HotkeyClassConstructor

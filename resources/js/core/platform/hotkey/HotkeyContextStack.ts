import { HotkeyContext } from "./types"

/**
 * Manage active hotkey contexts
 */
export class HotkeyContextStack {

    private stack: HotkeyContext[] = ["global"]

    /**
     * Push new context
     */
    push(context: HotkeyContext): void {

        // add context on top
        this.stack.unshift(context)

    }

    /**
     * Remove context
     */
    pop(context: HotkeyContext): void {

        // remove context
        this.stack = this.stack.filter(c => c !== context)

    }

    /**
     * Get context stack
     */
    getStack(): HotkeyContext[] {

        // return stack snapshot
        return [...this.stack]

    }

}

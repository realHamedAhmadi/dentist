import { HotkeyScope } from "./types"

/**
 * Manage active hotkey scopes
 */
export class HotkeyScopeStack {

    private stack: HotkeyScope[] = ["global"]

    /**
     * Push new scope
     */
    push(scope: HotkeyScope): void {

        // add scope on top
        this.stack.unshift(scope)

    }

    /**
     * Remove scope
     */
    pop(scope: HotkeyScope): void {

        // remove scope
        this.stack = this.stack.filter(s => s !== scope)

    }

    /**
     * Get scope stack
     */
    getStack(): HotkeyScope[] {

        // return scope snapshot
        return [...this.stack]

    }

}

/**
 * Normalize keyboard event to canonical hotkey combo string.
 *
 * - Layout independent (uses event.code)
 * - Stable modifier ordering
 * - Lowercase output
 * - Prevents duplicate modifier emission
 */
export function buildKeyCombo(event: KeyboardEvent): string {

    const keys: string[] = []

    // Ignore pure modifier press (ctrl alone etc.)
    if (
        event.code === "ControlLeft" ||
        event.code === "ControlRight" ||
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight" ||
        event.code === "AltLeft" ||
        event.code === "AltRight" ||
        event.code === "MetaLeft" ||
        event.code === "MetaRight"
    ) {
        return ""
    }

    // Stable modifier order (important!)
    if (event.ctrlKey) keys.push("ctrl")
    if (event.altKey) keys.push("alt")
    if (event.shiftKey) keys.push("shift")
    if (event.metaKey) keys.push("meta")

    const key = normalizeCode(event.code)

    if (!key) {
        return ""
    }

    keys.push(key)

    return keys.join("+")
}

/**
 * Normalize KeyboardEvent.code into registry format.
 *
 * Converts:
 *  - KeyS → s
 *  - Digit1 → 1
 *  - Numpad1 → num1
 *  - ArrowUp → up
 */
function normalizeCode(code: string): string | null {

    // Letters (layout independent)
    if (code.startsWith("Key")) {
        return code.replace("Key", "").toLowerCase()
    }

    // Top row digits
    if (code.startsWith("Digit")) {
        return code.replace("Digit", "")
    }

    // Numpad digits
    if (code.startsWith("Numpad")) {
        return code.replace("Numpad", "num")
    }

    // Function keys
    if (code.startsWith("F")) {
        return code.toLowerCase()
    }

    // Special keys
    const map: Record<string, string> = {

        Enter: "enter",
        Escape: "esc",
        Space: "space",
        Tab: "tab",
        Backspace: "backspace",
        Delete: "delete",
        Insert: "insert",
        Home: "home",
        End: "end",
        PageUp: "pageup",
        PageDown: "pagedown",

        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"

    }

    return map[code] ?? null
}

/**
 * Hint item
 */
export interface HotkeyHint {

    key: string
    command?: string
    description?: string
}

/**
 * Sequence hints payload
 */
export interface SequenceHintsPayload {

    sequence: string[]
    hints: HotkeyHint[]

}

/**
 * Recording payload
 */
export interface RecordingPayload {

    sequence: string[]

}


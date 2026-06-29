export interface IHotkeyPolicy {
    preventDefaultOnPartial: boolean
    preventDefaultOnFull: boolean
    preventDefaultOnSingle: boolean
    preventDefaultOnRecording: boolean
    executeFallbackOnTimeout: boolean
}

export const DefaultHotkeyPolicy: IHotkeyPolicy = {
    preventDefaultOnPartial: true,
    preventDefaultOnFull: true,
    preventDefaultOnSingle: true,
    preventDefaultOnRecording: true,
    executeFallbackOnTimeout: true
}

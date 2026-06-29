export type OverlayType =
    | "modal"
    | "drawer"
    | "bottomSheet"
    | "popover"

export interface OverlayOptions {
    id: string
    type: OverlayType
    content: React.ReactNode
}

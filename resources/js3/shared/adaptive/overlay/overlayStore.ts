import { create } from "zustand"
import { OverlayOptions } from "./overlayTypes"

interface OverlayState {
    overlays: OverlayOptions[]

    open: (overlay: OverlayOptions) => void
    close: (id: string) => void
}

export const useOverlayStore = create<OverlayState>((set) => ({
    overlays: [],

    open: (overlay) =>
        set((state) => ({
            overlays: [...state.overlays, overlay],
        })),

    close: (id) =>
        set((state) => ({
            overlays: state.overlays.filter((o) => o.id !== id),
        })),
}))

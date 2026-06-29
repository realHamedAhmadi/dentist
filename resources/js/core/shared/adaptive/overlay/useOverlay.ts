import { useOverlayStore } from "./overlayStore"

export function useOverlay() {
    const open = useOverlayStore((s) => s.open)
    const close = useOverlayStore((s) => s.close)

    return {
        openOverlay: open,
        closeOverlay: close,
    }
}

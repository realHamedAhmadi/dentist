import { useOverlayStore } from "./overlayStore"
import { Modal, Drawer } from "@mui/material"

export function OverlayRenderer() {
    const overlays = useOverlayStore((s) => s.overlays)

    return (
        <>
            {overlays.map((overlay) => {
                if (overlay.type === "modal") {
                    return (
                        <Modal key={overlay.id} open>
                            {overlay.content}
                        </Modal>
                    )
                }

                if (overlay.type === "drawer") {
                    return (
                        <Drawer key={overlay.id} open>
                            {overlay.content}
                        </Drawer>
                    )
                }

                return null
            })}
        </>
    )
}

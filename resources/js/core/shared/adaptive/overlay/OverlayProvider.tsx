import { OverlayRenderer } from "./OverlayRenderer"

export function OverlayProvider({ children }) {
    return (
        <>
            {children}
            <OverlayRenderer />
        </>
    )
}

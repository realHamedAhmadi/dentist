import { useTheme, useMediaQuery } from "@mui/material"

export default function useEnvironment() {
    const theme = useTheme()

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"))
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))

    const hasHover = useMediaQuery("(hover: hover)")
    const isTouch = useMediaQuery("(pointer: coarse)")

    return {
        isMobile,
        isTablet,
        isDesktop,
        hasHover,
        isTouch
    }
}

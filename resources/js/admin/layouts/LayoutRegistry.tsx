import useEnvironment from "@/core/shared/adaptive/environment/useEnvironment"
import Workspace from "@/admin/layouts/shells/Workspace"
import Stacked from "@/admin/layouts/shells/Stacked"
import MasterDetail from "@/admin/layouts/shells/Master-Detail"

export default function LayoutRegistry() {
    const { isMobile, isTablet, isDesktop } = useEnvironment()

    // انتخاب هوشمند Layout بر اساس محیط
    if (isMobile) {
        return <Stacked/>
    }

    if (isTablet) {
        return <MasterDetail/>
    }

    // Default is Desktop
    return <Workspace/>
}

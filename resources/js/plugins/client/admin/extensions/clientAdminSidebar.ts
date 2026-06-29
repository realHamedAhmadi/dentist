import {SlotExtension} from "@/core/platform/slot/types";
import Sidebar from "@/plugins/client/admin/Sidebar";

export const clientAdminSidebar:SlotExtension={
    Component: Sidebar,
    id: "client.admin.sidebar",
    order: 1,
}

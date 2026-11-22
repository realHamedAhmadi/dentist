import {MenuItems} from '@/core/shared/components/ui/composites/Sidebar/MenuItems'
import {useClientTranslation} from "@/plugins/client/shared/hooks/useClientTranslation";

const sections = () => {
    const {t}=useClientTranslation('sidebar')
    return [
        {
            title: t('sections.users'),
            links: [
                {
                    text: t('users.clients.index'),
                    to: "/admin/clients",
                    component: () => import('@/plugins/client/admin/pages/IndexPage'),
                }
            ]
        }
    ]
}

export default () => <MenuItems sections={sections} />;

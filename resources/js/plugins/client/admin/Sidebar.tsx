import {MenuItems} from '@/core/shared/components/ui/composites/Sidebar/MenuItems'

const sections = (trans) => [
    {
        title: trans('sidebar.sections.users'),
        links: [
            {
                text: trans('sidebar.users.clients.index'),
                to: "/admin/clients",
                component: () => import('@/plugins/client/admin/pages/IndexPage'),
            }
        ]
    }
]

export default ({ trans }) => <MenuItems trans={trans} sections={sections} />;

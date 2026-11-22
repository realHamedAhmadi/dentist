import React from "react";
import {Link} from 'react-router-dom'
import {Drawer, IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {List, ListItemButton, ListItemText} from "@mui/material";
import {Typography} from "@mui/material";
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@/core/shared/icons/ExpandMore";
import {useSlotRenderer} from "@/core/shared/hooks/useSlotRenderer";
import {useAdminTranslation} from "@/admin/hooks/useAdminTranslation";

const sections = (trans) => [
    /* {
         title: trans('sections.users'),
         links: [
             {
                 text: trans('users.clients.index'),
                 to: "/admin/clients",
                 //component: () => import('@/admin/features/client/IndexPage'),
             }
         ]
     },*/
    {
        title: trans('sections.orders'),
        links: [
            {
                text: trans('orders.orders.create'),
                to: "/admin/orders/create",
                //component: () => import('@/plugins/order/admin/pages/CreatePage'),
            }, {
                text: trans('orders.orders.index'),
                to: "/admin/orders",
                //component: () => import('@/plugins/order/admin/pages/order'),
            },
        ]
    }
]

const LinkList = () => {
    const {t}=useAdminTranslation('sidebar')
    const renderer=useSlotRenderer();
    return (
        <List>
            <ListItemButton component={Link}
                            viewTransition
                /*onMouseEnter=''*//*{()=>import('@/admin/features/dashboard')}*/>
                <ListItemText>
                    {t('sections.dashboard')}
                </ListItemText>
            </ListItemButton>
            {renderer.render('admin.sidebar',{trans:t})}
            <Accordions trans={t}/>
        </List>
    )
}
const Accordions = ({trans}) => {
    return sections(trans).map((section, index) => {
        return (
            <Accordion key={index} sx={{boxShadow: 'none'}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails disableVerticalPadding>
                    <List disablePadding>
                        {section.links.map((item, index) => {
                            return (
                                <ListItemButton
                                    key={index}
                                    component={Link}
                                    to={item.to}
                                    viewTransition
                                    /*onMouseEnter={item.component}*/>
                                    <ListItemText>
                                        {item.text}
                                    </ListItemText>
                                </ListItemButton>
                            )
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    })
}

export const Sidebar = ({drawerState, width}) => {
    const [drawerOpen, setDrawerOpen] = drawerState ?? React.useState<Boolean>(true);
    const handelDrawerClose = () => {
        setDrawerOpen(false)
    }
    return (
        <nav>
            <Drawer open={drawerOpen} paperWidth={width} variant='persistent'>
                <IconButton color="error" onClick={handelDrawerClose}>
                    <CloseIcon/>
                </IconButton>
                <LinkList/>
            </Drawer>
        </nav>
    )
}
export default Sidebar

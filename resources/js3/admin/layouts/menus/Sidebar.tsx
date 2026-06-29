import React from "react";
import {Link} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import {Drawer, IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {List, ListItemButton, ListItemText} from "@mui/material";
import {Typography} from "@mui/material";
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@/shared/icons/ExpandMore";

const sections = (trans) => [
    {
        title: trans('sidebar.sections.users'),
        links: [
            {
                text: trans('sidebar.users.clients.index'),
                to: "/admin/clients",
                component: () => import('@/admin/features/client/IndexPage'),
            }
        ]
    },
    {
        title: trans('sidebar.sections.orders'),
        links: [
            {
                text: trans('sidebar.orders.orders.create'),
                to: "/admin/orders/create",
                component: () => import('@/admin/features/order/CreatePage'),
            },{
                text: trans('sidebar.orders.orders.index'),
                to: "/admin/orders",
                component: () => import('@/admin/features/order'),
            },
        ]
    }
]

const LinkList = () => {
    const {t} = useTranslation('admin');
    return (
        <List>
            <ListItemButton component={Link}
                            viewTransition
                            onMouseEnter={()=>import('@/admin/features/dashboard')}>
                <ListItemText>
                    {t('sidebar.sections.dashboard')}
                </ListItemText>
            </ListItemButton>
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
                        {section.links.map((item) => {
                            return (
                                <ListItemButton component={Link}
                                                to={item.to}
                                                viewTransition
                                                onMouseEnter={item.component}>
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

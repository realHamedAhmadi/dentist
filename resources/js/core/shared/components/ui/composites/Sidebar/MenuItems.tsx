import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@/core/shared/icons/ExpandMore";
import {Link} from "react-router-dom";
import React from "react";

type Sections=(trans:any)=>[
    {
        title?:string,
        titleKey?:string,
        links:[
            {
                text?:string,
                textKey?:string,
                to:string,
                component?:any
            }
        ]
    }
]

export const MenuItems = ({sections,trans}:{sections:Sections,trans?:any}) => {
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

export default MenuItems

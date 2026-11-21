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

/**
 * A single navigation link rendered inside a sidebar section.
 */
type SidebarLink = {
    text?: string;
    textKey?: string;
    to: string;
    component?: () => Promise<unknown>;
};

/**
 * A collapsible group of navigation links.
 */
type SidebarSection = {
    title?: string;
    titleKey?: string;
    links: SidebarLink[];
};

/**
 * Resolves sidebar sections using the provided translation function.
 */
type Sections = (trans: (key: string) => string) => SidebarSection[];

/**
 * Props accepted by the sidebar menu renderer.
 */
type MenuItemsProps = {
    sections: Sections;
    trans?: (key: string) => string;
};

/**
 * Renders the sidebar accordion tree from a section resolver.
 */
export const MenuItems = ({sections, trans}: MenuItemsProps) => {
    // Resolve sections once per render using the translation function
    return sections(trans as (key: string) => string).map((section, index) => {
        return (
            <Accordion key={section.titleKey ?? section.title ?? index} sx={{boxShadow: 'none'}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails disableVerticalPadding>
                    <List disablePadding>
                        {section.links.map((item) => {
                            return (
                                <ListItemButton key={item.to}
                                                component={Link}
                                                to={item.to}
                                                viewTransition
                                                onMouseEnter={() => {
                                                    // Preload the route chunk without breaking navigation on failure
                                                    void item.component?.().catch(() => undefined);
                                                }}>
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

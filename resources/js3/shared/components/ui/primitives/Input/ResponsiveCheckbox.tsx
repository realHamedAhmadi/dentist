import {Grid, GridProps, Checkbox, CheckboxProps, FormLabel} from "@mui/material";
import React from "react";

export interface ResponsiveCheckboxProps extends CheckboxProps {
    /**
     * Label for the form control.
     */
    label?: string;

    /**
     * Element placed before the children.
     */
    startLabeled?: string;

    /**
     * Grid layout properties (e.g., xs, sm, md breakpoints).
     */
    gridSize?:GridProps['size']

}
const LabelComponent=({label})=>{
    return <FormLabel component="legend" sx={{display:'inline'}}>{label}</FormLabel>
}

export default function ResponsiveCheckbox(props: ResponsiveCheckboxProps) {
    const {gridSize,fullWidth,label,size='small',startLabeled=false,...otherProps}=props

    return (
        <Grid size={gridSize}>
            {startLabeled && <LabelComponent label={label}/>}
            <Checkbox size={size} fullWidth {...otherProps}/>
            {!startLabeled && <LabelComponent label={label}/>}
        </Grid>
    )
};

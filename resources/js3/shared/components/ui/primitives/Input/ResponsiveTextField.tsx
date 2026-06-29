import {GridProps, TextFieldProps} from "@mui/material";
import {Grid, TextField} from "@mui/material";

export interface ResponsiveTextFieldProps extends TextFieldProps {
    gridSize?:GridProps['size']
}

export default function ResponsiveTextField(props: ResponsiveTextFieldProps) {
    const {gridSize,fullWidth,variant='standard',size='small',...otherProps}=props
    return (
        <Grid size={gridSize} alignContent='end'>
            <TextField fullWidth variant={variant} size={size} {...otherProps}/>
        </Grid>
    )
};

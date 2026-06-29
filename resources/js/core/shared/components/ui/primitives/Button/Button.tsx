import {Button as MuiButton, ButtonProps, Grid, GridProps} from "@mui/material";

export interface ResponsiveButtonProps extends ButtonProps {
    gridSize?: GridProps['size']
}

export default function Button({
                                   gridSize = {xs: 12, sm: 6, md: 'auto'},
                                   variant = 'contained',
                                   ...otherProps
                               }: ResponsiveButtonProps) {
    const {fullwidth, ...props} = otherProps
    return (
        <Grid item size={gridSize}>
            <MuiButton fullWidth variant={variant} {...props}/>
        </Grid>
    );
}

import React from "react";
import {
    Box,
    Chip, Grid, GridProps,
    Typography
} from "@mui/material";

const bloodGroups = [
    {id: 1, name: "A+"},
    {id: 2, name: "A-"},
    {id: 3, name: "B+"},
    {id: 4, name: "B-"},
    {id: 5, name: "AB+"},
    {id: 6, name: "AB-"},
    {id: 7, name: "O+"},
    {id: 8, name: "O-"},
];

export interface BloodGroupChipsProps {
    label?: any

    name?: string

    defaultValue?: number | null

    gridSize?: GridProps['size']
}

export default function BloodGroupChips(props: BloodGroupChipsProps) {
    const {defaultValue = null} = props
    const [value, setValue] = React.useState(defaultValue);

    return (
        <Grid size={props.gridSize}>
            <Typography fontWeight={500}>
                {props.label}
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
                {bloodGroups.map((group) => (
                    <Chip
                        key={group.id}
                        label={group.name}
                        clickable
                        color={value === group.id ? "primary" : "default"}
                        variant={value === group.id ? "filled" : "outlined"}
                        onClick={() => setValue(group.id)}
                        sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    />
                ))}
                <input type='hidden' name={props.name} value={value}/>
            </Box>
        </Grid>
    );
}

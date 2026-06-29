import React from 'react';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroupProps,
    FormControlLabelProps, RadioProps
} from '@mui/material';
import {Grid} from '@mui/material';
import {GridProps, SxProps, Theme} from '@mui/material';

// Props interface for ResponsiveRadioGroup component
export interface ResponsiveRadioGroupProps {
    /**
     * Main label for the form control.
     */
    label: string;
    /**
     * Unique name for the radio group.
     */
    name: string;
    /**
     * Default selected value. If null, no option is selected by default.
     */
    defaultValue?: string | number | null;
    /**
     * Callback function triggered when the selected value changes.
     * @param event - The change event.
     * @param value - The new selected value.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    /**
     * Grid layout properties (e.g., xs, sm, md breakpoints).
     */
    gridSize?: GridProps['size'];
    /**
     * FormControlLabel elements to be placed inside the RadioGroup.
     */
    radios: { label: any; value: string | number }[];
    /**
     * Whether the form control should take full width.
     */
    fullWidth?: boolean;
    /**
     * Optional additional RadioGroup props.
     */
    radioGroupProps?: Omit<RadioGroupProps, 'name' | 'value' | 'onChange' | 'aria-label'>;

    /**
     * If true, radios will be arranged horizontally.
     */
    horizontal?: boolean

    size?:RadioProps['size']
}

export default function ResponsiveRadioGroup({
                                                 label,
                                                 name,
                                                 onChange,
                                                 radios,
                                                 gridSize,
                                                 size = 'small',
                                                 defaultValue = null,
                                                 fullWidth = false,
                                                 horizontal = false,
                                                 radioGroupProps = {},
                                             }: ResponsiveRadioGroupProps) {

    // State to manage the currently selected value
    const [selectedValue, setSelectedValue] = React.useState<string | number | null>(defaultValue);

    // Handler for value changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setSelectedValue(value); // Update internal state
        if (onChange) {
            onChange(event, value); // Call parent's onChange if provided
        }
    };

    const radioGroupStyles: SxProps<Theme> = {
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        gap: horizontal ? 2 : 0,
        flexWrap: horizontal ? 'wrap' : 'nowrap',
    };

    const formControlLabelStyles: SxProps<Theme> = {
        ...(horizontal && {marginRight: 2}),
    };

    return (
        <Grid size={gridSize}> {/* Apply Grid props for layout */}
            <FormControl component="fieldset" fullWidth={fullWidth}>
                {/* Display label if provided */}
                {label && <FormLabel component="legend">{label}</FormLabel>}
                <RadioGroup
                    aria-label={label || name} // Use label for accessibility, fallback to name
                    name={name}
                    value={selectedValue}
                    onChange={handleChange}
                    {...radioGroupProps} // Pass down any additional RadioGroup props
                    sx={radioGroupStyles}
                >
                    {radios.map(function (radio) {
                        return <FormControlLabel key={radio.value} control={<Radio size={size}/>} label={radio.label}
                                                 value={radio.value}
                                                 sx={formControlLabelStyles}
                        />
                    })}
                </RadioGroup>
            </FormControl>
        </Grid>
    );
};

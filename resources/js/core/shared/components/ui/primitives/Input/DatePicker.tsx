import ResponsiveTextField from './ResponsiveTextField'
import {GridProps, TextField} from "@mui/material";

export interface DatePickerProps {
    // Current selected date
    value?: Date | null;

    // Triggered when date changes
    onChange?: (date: Date | null) => void;

    // Default value when component is uncontrolled
    defaultValue?: Date | null;

    // Minimum selectable date
    minDate?: Date;

    // Maximum selectable date
    maxDate?: Date;

    // Disable the picker
    disabled?: boolean;

    // Readonly input
    readOnly?: boolean;

    // Placeholder text
    placeholder?: string;

    // Display format
    format?: string;

    // Which view should open first
    openTo?: "year" | "month" | "day";

    // Allowed views in picker
    views?: Array<"year" | "month" | "day">;

    // Initial month/year when opening
    referenceDate?: Date;

    // Prevent selecting past dates
    disablePast?: boolean;

    // Prevent selecting future dates
    disableFuture?: boolean;

    // Custom validation for disabling dates
    shouldDisableDate?: (date: Date) => boolean;

    // Label for input
    label?: string;

    // Custom CSS class
    className?: string;

    gridSize?:GridProps['size']

    variant?:TextField['variant']
}

export default function DatePicker(props:DatePickerProps){
    return <ResponsiveTextField {...props}/>
}


import { Controller, Control } from "react-hook-form";
import { ResponsiveSelect, SelectOption } from "./ResponsiveSelect";

type RHFResponsiveSelectProps = {
    name: string;
    control: Control<any>;
    label: string;
    options: SelectOption[];
    loading?: boolean;
    disabled?: boolean;
    required?: boolean;
};

export function RHFResponsiveSelect({
                                        name,
                                        control,
                                        label,
                                        options,
                                        loading,
                                        disabled,
                                        required,
                                    }: RHFResponsiveSelectProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? "This field is required" : false,
            }}
            render={({ field, fieldState }) => (
                <ResponsiveSelect
                    label={label}
                    options={options}
                    value={field.value ?? null}
                    onChange={field.onChange}
                    loading={loading}
                    disabled={disabled}
                    required={required}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            )}
        />
    );
}

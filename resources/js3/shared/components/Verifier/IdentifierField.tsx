import {InputAdornment, IconButton, CircularProgress, GridProps, Tooltip} from "@mui/material";
import SendIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ResponsiveTextField, {ResponsiveTextFieldProps} from "@/shared/components/ui/primitives/Input/ResponsiveTextField";

interface IdentifierFieldProps extends ResponsiveTextFieldProps {
    identifier: string;
    onSendCode: () => void;
    isSending: boolean;
    isVerified: boolean;
}

export function IdentifierField({
                                    identifier,
                                    onChange,
                                    onSendCode,
                                    isSending,
                                    isVerified,
                                    gridSize,
                                    label = "identifier",
                                    ...otherProps
                                }: IdentifierFieldProps) {
    return (
        <ResponsiveTextField
            gridSize={gridSize}
            label={label}
            value={identifier}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {isVerified ? (
                            <CheckCircle color="success"/>
                        ) : (
                            <Tooltip title="ارسال کد تأیید">
                                <IconButton
                                    edge="end"
                                    onClick={onSendCode}
                                    disabled={identifier.length < 3 || isSending}
                                >
                                    {isSending ? (
                                        <CircularProgress size={20}/>
                                    ) : (
                                        <SendIcon/>
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </InputAdornment>
                )
            }}
            {...otherProps}
        />
    );
}

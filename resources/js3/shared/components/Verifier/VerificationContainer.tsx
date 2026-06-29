import {useEffect, useState} from "react";
import {
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Grid,
    GridProps,
    IconButton,
    Fade,
    Slide
} from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "react-i18next";

type VerificationContainerProps = {
    gridSize?: GridProps["size"];
    visible: boolean;
    onClose: () => void; // NEW: closing callback
    onVerify: (code: string) => Promise<boolean>;
    onResend: () => Promise<void>;
};

export function VerificationContainer({
                                          gridSize = {xs: 12, sm: 12, md: 12, lg: 12},
                                          visible,
                                          onClose,
                                          onVerify,
                                          onResend
                                      }: VerificationContainerProps) {

    const {t} = useTranslation('common')
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // If container should hide, we keep the animation by not returning null immediately.
    if (!visible) {
        return (
            <Fade in={false} timeout={250}>
                <div hidden/>
            </Fade>
        );
    }

    const handleVerify = async () => {
        if (!otp.trim()) return;

        setLoading(true);
        const ok = await onVerify(otp);
        setLoading(false);

        if (!ok) {
            alert("Invalid code");
        }else {
            setOtp('');
        }
    };

    const handleResend = async () => {
        setOtp('');
        await onResend();
        setTimeLeft(30);
    };

    return (
        <Grid size={gridSize} sx={{display: "flex"}} justifyContent="center">
            {/* Slide + Fade combo for smooth compact animation */}
            <Slide in={visible} direction="up" mountOnEnter unmountOnExit>
                <Fade in={visible} timeout={300}>
                    <Paper
                        variant="outlined"
                        sx={{
                            mt: 1.5,
                            px: 1.5,
                            py: 1.25,
                            borderRadius: 2,
                            width: "100%",
                            maxWidth: 360,
                            position: "relative"
                        }}
                    >
                        {/* Close button (top-right) */}
                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                padding: "3px"
                            }}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>

                        <Stack spacing={1.25}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <VerifiedOutlinedIcon
                                    color="primary"
                                    sx={{fontSize: 18}}
                                />
                                <Typography variant="body2" fontWeight={600}>
                                    {t('form.fields.VerificationCode')}
                                </Typography>
                            </Stack>

                            <TextField
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder="••••••"
                                inputProps={{
                                    maxLength: 6,
                                    inputMode: "numeric",
                                    style: {
                                        textAlign: "center",
                                        letterSpacing: "0.35em",
                                        fontSize: "0.95rem",
                                        padding: "10px 12px"
                                    }
                                }}
                            />

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleVerify}
                                    disabled={loading || otp.trim().length < 4}
                                    endIcon={
                                        loading ? (
                                            <CircularProgress size={14} color="inherit"/>
                                        ) : null
                                    }
                                    sx={{minWidth: 96}}
                                >
                                    {loading ? t('actions.checking') : t('actions.verify')}
                                </Button>

                                {timeLeft > 0 ? (
                                    <Button
                                        variant="text"
                                        size="small"
                                        disabled
                                        sx={{minWidth: 92}}
                                    >
                                        {timeLeft}s
                                    </Button>
                                ) : (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={handleResend}
                                        sx={{minWidth: 92}}
                                    >
                                        {t('actions.resend')}
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>
                </Fade>
            </Slide>
        </Grid>
    );
}

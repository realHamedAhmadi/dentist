import React from "react";
import {
    Box,
    TextField,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export type SelectOption = {
    id: number | string;
    label: string;
    description?: string;
};

type ResponsiveSelectProps = {
    label?: string;
    options: SelectOption[];
    value?: number | string | null;
    onChange?: (value: number | string | null) => void;
    loading?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    helperText?: string;
};

export function ResponsiveSelect({
                                     label,
                                     options,
                                     value,
                                     onChange,
                                     loading = false,
                                     disabled = false,
                                     required = false,
                                     error = false,
                                     helperText,
                                 }: ResponsiveSelectProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selected = options.find((o) => o.id === value);

    const filtered = React.useMemo(() => {
        if (!search.trim()) return options;
        return options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const handleSelect = (id: number | string) => {
        onChange(id);
        setOpen(false);
        setSearch("");
    };

    return (
        <>
            <TextField
                fullWidth
                label={label}
                required={required}
                disabled={disabled}
                error={error}
                helperText={helperText}
                value={selected?.label ?? ""}
                onClick={() => !disabled && setOpen(true)}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            {loading ? (
                                <CircularProgress size={18}/>
                            ) : (
                                <KeyboardArrowDownIcon/>
                            )}
                        </InputAdornment>
                    ),
                }}
            />

            <Dialog
                keepMounted
                open={open}
                onClose={() => setOpen(false)}
                fullScreen={isMobile}
                fullWidth
                maxWidth="sm"
            >
                <AppBar position="sticky">
                    <Toolbar>
                        <IconButton edge="start" onClick={() => setOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6">
                            {label}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box p={2} sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden", // prevent layout shift
                }}>
                    <TextField
                        fullWidth
                        autoFocus
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{mb: 2}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{
                        height: {
                            xs: "calc(100vh - 160px)", // mobile
                            sm: 400,                   // desktop
                        },
                        overflowY: "auto",
                    }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <List>
                                {filtered.map((item, index) => {
                                    const isSelected = item.id === value;

                                    return (
                                        <React.Fragment key={item.id}>
                                            <ListItemButton
                                                selected={isSelected}
                                                onClick={() => handleSelect(item.id)}
                                            >
                                                <ListItemText
                                                    primary={item.label}
                                                    secondary={item.description}
                                                />
                                                {isSelected && (
                                                    <CheckIcon color="primary" fontSize="small"/>
                                                )}
                                            </ListItemButton>

                                            {index < filtered.length - 1 && <Divider/>}
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}

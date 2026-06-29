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
    Fade, TextFieldProps, GridProps, Grid,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export type SelectOption = {
    id: string | number;
    label: string;
    description?: string;
};

type Props = {
    label?: string;
    name?: string;
    value?: string | number | null;
    options: SelectOption[];
    onChange?: (value: string | number) => void;
    size?: TextFieldProps['size'];
    gridSize?: GridProps['size']
};

export default function EnterpriseSelect({
                                             label,
                                             name,
                                             value,
                                             options,
                                             onChange,
                                             size = 'small',
                                             gridSize
                                         }: Props) {

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);

    const searchRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    const selected = options.find(
        o => String(o.id) === String(value)
    );

    React.useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchRef.current?.focus();
            }, 50);
        }
    }, [open]);


    const filtered = React.useMemo(() => {
        if (!search) return options;

        const s = search.toLowerCase();

        return options.filter(o =>
            o.label.toLowerCase().includes(s)
        );

    }, [search, options]);

    // scroll selected into view
    React.useEffect(() => {

        if (!open) return;

        const index = filtered.findIndex(
            o => String(o.id) === String(value)
        );

        if (index >= 0) {

            setActiveIndex(index);

            setTimeout(() => {
                const el = document.getElementById(
                    `select-item-${index}`
                );

                el?.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });

            }, 50);

        }

    }, [open]);

    const handleSelect = (id: string | number) => {

        onChange?.(id);

        setOpen(false);
        setSearch("");
    };

    // keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {

        if (!filtered.length) return;

        if (e.key === "ArrowDown") {

            e.preventDefault();

            setActiveIndex(i =>
                Math.min(i + 1, filtered.length - 1)
            );
        }

        if (e.key === "ArrowUp") {

            e.preventDefault();

            setActiveIndex(i =>
                Math.max(i - 1, 0)
            );
        }

        if (e.key === "Enter") {

            e.preventDefault();

            const option = filtered[activeIndex];

            if (option) handleSelect(option.id);
        }

        if (e.key === "Escape") {

            setOpen(false);
        }
    };

    const highlight = (text: string) => {

        if (!search) return text;

        const regex = new RegExp(`(${search})`, "gi");

        const parts = text.split(regex);

        return parts.map((part, i) =>

            part.toLowerCase() === search.toLowerCase()
                ? <strong key={i}>{part}</strong>
                : part
        );
    };

    return (
        <Grid size={gridSize} alignContent='end'>
            <TextField
                label={label}
                name={name}
                value={selected?.label || ""}
                variant='standard'
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {

                    if (e.key === "Enter") {
                        e.preventDefault();
                        setOpen(true);
                        return;
                    }
                    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        setSearch(e.key);
                        setOpen(true);
                    }

                }}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <KeyboardArrowDownIcon/>
                    )
                }}
                fullWidth
                size={size}
            />

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    height={500}
                >
                    <AppBar
                        position="static"
                        color="transparent"
                        elevation={0}
                    >
                        <Toolbar>
                            <Typography flex={1}>
                                {label}
                            </Typography>

                            <IconButton
                                onClick={() => setOpen(false)}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Toolbar>
                        <Box p={2} pt={0}>

                            <TextField
                                autoFocus
                                fullWidth
                                size={size}
                                placeholder="Search..."
                                value={search}
                                onChange={e =>
                                    setSearch(e.target.value)
                                }
                                inputRef={searchRef}
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </AppBar>
                    <Box
                        flex={1}
                        overflow="auto"
                    >
                        <List ref={listRef}>
                            {filtered.map((option, index) => {
                                const selected =
                                    String(option.id) === String(value);

                                const active =
                                    index === activeIndex;

                                return (
                                    <Fade
                                        in
                                        key={option.id}
                                        timeout={150}
                                    >
                                        <ListItemButton
                                            id={`select-item-${index}`}
                                            selected={active}
                                            onClick={() =>
                                                handleSelect(option.id)
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    highlight(option.label)
                                                }
                                                secondary={
                                                    option.description
                                                }
                                            />
                                            {selected && <CheckIcon/>}
                                        </ListItemButton>
                                    </Fade>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Dialog>
        </Grid>
    );
}

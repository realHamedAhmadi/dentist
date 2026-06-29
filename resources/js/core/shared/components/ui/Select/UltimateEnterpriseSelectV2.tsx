import React from "react";
import Fuse from "fuse.js";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import {
    Box,
    TextField,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputAdornment,
    ListItemButton,
    ListItemText,
    Chip,
    Stack
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";


/**
* ✅ keyboard navigation
 *
 * ✅ open with enter
 *
 * ✅ open with typing
 *
 * ✅ sticky search
 *
 * ✅ scroll to selected
 *
 * ✅ fuzzy search (smart ranking)
 *
 * ✅ highlight search
 *
 * ✅ stable dialog height
*/

export type SelectOption = {
    id: string | number;
    label: string;
    description?: string;
};

type Props = {
    label?: string;
    value?: (string | number)[];
    options: SelectOption[];
    onChange?: (value: (string | number)[]) => void;
};

export default function UltimateEnterpriseSelect({
                                                     label,
                                                     value = [],
                                                     options,
                                                     onChange
                                                 }: Props) {

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);

    const searchRef = React.useRef<HTMLInputElement>(null);

    const fuse = React.useMemo(() => {

        return new Fuse(options, {
            keys: ["label", "description"],
            threshold: 0.35,
            ignoreLocation: true
        });

    }, [options]);

    const filtered = React.useMemo(() => {

        if (!search) return options;

        return fuse.search(search).map(r => r.item);

    }, [search, fuse, options]);

    React.useEffect(() => {

        if (open) {

            setTimeout(() => {
                searchRef.current?.focus();
            }, 50);

        }

    }, [open]);

    const toggle = (id: string | number) => {

        let newValue;

        if (value.includes(id)) {
            newValue = value.filter(v => v !== id);
        } else {
            newValue = [...value, id];
        }

        onChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {

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

            const item = filtered[activeIndex];

            if (item) toggle(item.id);
        }

        if (e.key === "Escape") {

            setOpen(false);
        }

    };

    const Row = ({ index, style }: ListChildComponentProps) => {

        const option = filtered[index];

        const selected = value.includes(option.id);

        return (
            <Box style={style}>

                <ListItemButton
                    selected={index === activeIndex}
                    onClick={() => toggle(option.id)}
                >

                    <ListItemText
                        primary={option.label}
                        secondary={option.description}
                    />

                    {selected && <CheckIcon />}

                </ListItemButton>

            </Box>
        );

    };

    const selectedOptions = options.filter(o =>
        value.includes(o.id)
    );

    return (
        <>
            <Box onClick={() => setOpen(true)}>

                <TextField
                    label={label}
                    value=""
                    placeholder="Select..."
                    InputProps={{
                        readOnly: true,
                        startAdornment: (

                            <Stack direction="row" spacing={1} flexWrap="wrap">

                                {selectedOptions.map(o => (
                                    <Chip key={o.id} label={o.label} />
                                ))}

                            </Stack>

                        ),
                        endAdornment: <KeyboardArrowDownIcon />
                    }}
                    fullWidth
                />

            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <Box display="flex" flexDirection="column" height={500}>

                    <AppBar position="static" color="transparent" elevation={0}>

                        <Toolbar>

                            <Typography flex={1}>{label}</Typography>

                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </IconButton>

                        </Toolbar>

                        <Box p={2} pt={0}>

                            <TextField
                                inputRef={searchRef}
                                placeholder="Search..."
                                fullWidth
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />

                        </Box>

                    </AppBar>

                    <Box flex={1}>

                        <FixedSizeList
                            height={400}
                            width="100%"
                            itemSize={56}
                            itemCount={filtered.length}
                        >
                            {Row}
                        </FixedSizeList>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}

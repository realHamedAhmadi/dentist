import React from "react"
import {
    Box,
    Paper,
    Chip,
    Stack,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@mui/material"

import {useHotkeyUX} from "@/core/shared/hooks/useHotkeyUX"

/**
 * Hotkey UX overlay component
 * Shows current sequence, hints and recording state
 */
export function HotkeyOverlay() {
    const {
        hintsVisible,
        sequence = [],
        hints = [],
        recording = false
    } = useHotkeyUX()

    return (
        <Box
            sx={{
                display:(hintsVisible || recording)?'block':'none',
                position: "fixed",
                bottom: 32,
                right: 32,
                zIndex: 9999
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    p: 2,
                    minWidth: 260,
                    backdropFilter: "blur(6px)"
                }}
            >

                {recording && (
                    <Typography
                        variant="caption"
                        color="warning.main"
                        sx={{ mb: 1, display: "block" }}
                    >
                        Recording shortcut...
                    </Typography>
                )}

                {sequence.length > 0 && (
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 1, flexWrap: "wrap" }}
                    >
                        {sequence.map((key, i) => (
                            <Chip
                                key={i}
                                label={key}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                )}

                {hints.length > 0 && (
                    <>
                        <Divider sx={{ mb: 1 }} />

                        <List dense>
                            {hints.map((hint: any, i: number) => (
                                <ListItem
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <Chip
                                        label={hint.key}
                                        size="small"
                                        variant="outlined"
                                    />

                                    <ListItemText
                                        primary={hint.description}
                                        sx={{ ml: 2 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

            </Paper>
        </Box>
    )
}

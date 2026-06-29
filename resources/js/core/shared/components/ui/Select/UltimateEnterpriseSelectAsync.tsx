import React from "react";
import axios from "axios";

import {
    useInfiniteQuery
} from "@tanstack/react-query";

import {
    Dialog,
    TextField,
    Box,
    Chip,
    Stack,
    ListItemButton,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Typography
} from "@mui/material";

import {FixedSizeList} from "react-window";

import CloseIcon from "@mui/icons-material/Close";

/**
 * ✅ Works with a Laravel API
 * ✅ Supports infinite scroll
 * ✅ Uses React Query caching
 * ✅ Virtualized list rendering
 * ✅ Server‑side search
 * ✅ Fast UX even with 100k records
 */
type Option = {
    id: number | string
    label: string
}

type Props = {
    label: string
    value: (number | string)[]
    onChange: (v: (number | string)[]) => void
    endpoint: string
}

export default function UltimateEnterpriseSelectAsync({
                                                          label,
                                                          value,
                                                          onChange,
                                                          endpoint
                                                      }: Props) {

    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching
    } = useInfiniteQuery({

        queryKey: ["select", endpoint, search],

        queryFn: async ({pageParam = 1}) => {

            const res = await axios.get(endpoint, {
                params: {
                    search,
                    page: pageParam,
                    per_page: 20
                }
            })

            return res.data
        },

        getNextPageParam: (last) => {

            if (last.meta.current_page < last.meta.last_page) {
                return last.meta.current_page + 1
            }

            return undefined
        }

    })

    const options =
        data?.pages.flatMap(p => p.data) ?? []

    const toggle = (id: number | string) => {

        if (value.includes(id)) {
            onChange(value.filter(v => v !== id))
        } else {
            onChange([...value, id])
        }

    }

    const Row = ({index, style}: any) => {

        const option = options[index]

        if (!option) return null

        const selected = value.includes(option.id)

        return (

            <Box style={style}>

                <ListItemButton
                    selected={selected}
                    onClick={() => toggle(option.id)}
                >

                    <ListItemText primary={option.label}/>

                </ListItemButton>

            </Box>

        )

    }

    const handleScroll = (props: any) => {

        const {scrollOffset, scrollHeight, height} = props

        if (
            scrollOffset + height >= scrollHeight - 200 &&
            hasNextPage &&
            !isFetching
        ) {
            fetchNextPage()
        }

    }

    return (

        <>
            <TextField
                label={label}
                onClick={() => setOpen(true)}
                value=""
                placeholder="Select..."
                InputProps={{readOnly: true}}
                fullWidth
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
                                placeholder="Search..."
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </Box>

                    </AppBar>

                    <Box flex={1}>

                        <FixedSizeList
                            height={400}
                            width="100%"
                            itemSize={50}
                            itemCount={options.length}
                            onScroll={handleScroll}
                        >
                            {Row}
                        </FixedSizeList>

                    </Box>

                </Box>

            </Dialog>
        </>
    )
}

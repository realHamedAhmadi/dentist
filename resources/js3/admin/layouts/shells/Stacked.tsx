import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material"
import TaskIcon from '@mui/icons-material/Task'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import Header from "@/admin/layouts/headers/Header"
import {Outlet} from "react-router-dom";

export default function Stacked() {
    return (
        <Box sx={{ pb: 7 }}> {/* فضا برای Bottom Nav */}
            <Header/>

            <Box component="main" sx={{ p: 2 }}>
                <Outlet/>
            </Box>

            <BottomNavigation
                showLabels
                sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            >
                <BottomNavigationAction label="Tasks" icon={<TaskIcon />} />
                <BottomNavigationAction label="Search" icon={<SearchIcon />} />
                <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
            </BottomNavigation>
        </Box>
    )
}

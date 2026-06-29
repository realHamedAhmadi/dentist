import React, {useState} from 'react'
import {Outlet} from "react-router-dom";
import Sidebar from "../menus/Sidebar";
import Header from '../headers/Header';
import {Box, Container} from "@mui/material";

const MasterDetail: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState<Boolean>(true)
    const drawerWidth='250px';
    const styled=(theme)=>({
        marginLeft:'250px',
        /*transaction:theme.transaction.create('width',{
            easing:theme.transaction.easing.sharp
        }),*/
        width:`calc(100% - ${drawerWidth})`,/*
        ...(drawerOpen && ({
            transaction:theme.transaction.create('width',{
                easing:theme.transaction.easing.sharp
            }),
            width:'100%'
        }))*/
    })
    return (
        <div>
            <Sidebar drawerState={[drawerOpen, setDrawerOpen]} width={drawerWidth}/>
            <Box sx={styled}>
                <Header onDrawerToggle={() => setDrawerOpen(!drawerOpen)} drawerOpen={drawerOpen} drawerWidth={drawerWidth}/>
                <Box component={'section'} sx={{p:3}}>
                    <Outlet/>
                </Box>
            </Box>
        </div>
    )
}

export default MasterDetail

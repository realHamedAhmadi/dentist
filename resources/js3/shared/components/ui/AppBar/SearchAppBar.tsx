import * as React from 'react';
import {alpha} from '@mui/material';
import {AppBar} from '@mui/material';
import {Box} from '@mui/material';
import {Toolbar} from '@mui/material';
import {IconButton} from '@mui/material';
import {Typography} from '@mui/material';
import {InputBase} from '@mui/material';
import MenuIcon from '@/shared/icons/Menu';
import SearchIcon from '@/shared/icons/Search';
import {useTranslation} from "react-i18next";
import {AppBarProps as CoreAppBarProps} from '@mui/material'


interface AppBarProps extends CoreAppBarProps{
    search?:{
        isActive?:boolean
        placeholder?:string,
    },
    appTitle?:string,
    actions?:React.ReactNode
    menus?:React.ReactNode
    onDrawerToggle?:()=>{}
}

const Search = function ({children,isActive=true}) {
    if (!isActive){
        return null
    }
    const style = (theme) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    })
    return <Box sx={style}>{children}</Box>
}

const SearchIconWrapper = ({children}) => {
    const style = (theme) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });
    return <Box sx={style}>{children}</Box>
}

const StyledInputBase=(props)=>{
    const style=(theme)=>({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
    })
    return <InputBase sx={style} {...props}/>
}

export default function SearchAppBar(props:AppBarProps) {
    const {t}=useTranslation()
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar {...props} color='primary'>
                <Toolbar>
                    <IconButton
                        onClick={props.onDrawerToggle}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: {xs: 'none', sm: 'block'}}}
                        children={props.appTitle}
                    />
                    <Search isActive={props.search?.isActive}>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={props.search?.placeholder??t('form.placeholders.search')}
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                    <Box sx={{flexGrow: 1}}/>
                    {props.actions}
                </Toolbar>
            </AppBar>
            {props.menus}
        </Box>
    );
}

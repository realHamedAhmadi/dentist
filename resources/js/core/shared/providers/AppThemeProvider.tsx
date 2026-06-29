import {CacheProvider} from "@emotion/react";
import {ThemeProvider,CssBaseline} from "@mui/material";
import {rtlCache,ltrCache} from "@/core/shared/providers/dirCache";
import {createTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useMemo,useEffect} from "react";

export default function AppThemeProvider({children}){
    const {i18n}=useTranslation()
    const direction =i18n.language==='fa'?'rtl':'ltr'

    const theme=useMemo(()=>createTheme({direction}),[direction])

    useEffect(()=>{
        document.documentElement.dir=direction
    },[direction])

    return (
        <CacheProvider value={direction==='rtl'? rtlCache : ltrCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}

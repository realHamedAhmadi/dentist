import {useEffect} from "react";
import {useSelector} from "react-redux";
import {persistor,RootState} from "@/shared/store";

export default function (){
    const user=useSelector((state:RootState)=>state.user)

    useEffect(()=>{
        if (!user.rememberMe && user.isLoggedIn){
            persistor.purge()
        }
    },[user.rememberMe,user.isLoggedIn])

    return null
}

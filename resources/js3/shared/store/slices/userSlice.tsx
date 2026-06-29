import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import {CurrentUser} from '@/shared/models'

const initialState=new CurrentUser()

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        login(state,action:PayloadAction<Partial<CurrentUser>>){
            Object.assign(state,new CurrentUser(action.payload))
        },
        logout(state){
            Object.assign(state,initialState)
        },
        updateUser(state,action:PayloadAction<Partial<CurrentUser>>){
            Object.assign(state,new CurrentUser(action.payload))
        },
        setRememberMe(state,action:PayloadAction<boolean>){
            state.rememberMe=action.payload
        },
        updateRoles(state,action:PayloadAction<string[]>){
            state.roles=action.payload
        },
        setPanel(state,action:PayloadAction<string>){
            state.panel=action.payload
        }
    }
})

export const {login,logout,updateUser,setRememberMe,updateRoles,setPanel} = userSlice.actions
export default userSlice.reducer

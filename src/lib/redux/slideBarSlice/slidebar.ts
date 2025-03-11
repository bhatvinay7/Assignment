import React from 'react'
import { createSlice } from '@reduxjs/toolkit'
interface slide{
    slideBar:{

        isWindowOpen:boolean
    }
}
const initialState={
    isWindowOpen:false
}

const slideBarSlice= createSlice({

    name:"slideBar",
    initialState,
    reducers:{
        isOpen:(state,action)=>{
           state.isWindowOpen=action.payload
        }
    }
})

export const {isOpen}= slideBarSlice.actions
export const toggle = (state:slide) => state.slideBar.isWindowOpen;
export default slideBarSlice.reducer
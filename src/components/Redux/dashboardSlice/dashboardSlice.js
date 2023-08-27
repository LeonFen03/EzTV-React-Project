import {createSlice } from "@reduxjs/toolkit";
const dashboard = []
const options = {
    name:'dashboard',
    initialState:dashboard,
    reducers: {
        addToRender(state,action) {
            return [...state,action.payload];
        },
        renderArray(state, action){
            return action.payload;
        },
        clearArray ()  {
            return [];
        }

    }

}

export const dashboardSlice = createSlice(options);

export const dashboardSelector = (state) => {
    return state.dashboard;
}

export const {addToRender,renderArray,clearArray} = dashboardSlice.actions;
import { createStore, combineReducers } from 'redux';
import { profileSlice } from './components/Redux/profileSlice/profileSlice';
import { dashboardSlice } from './components/Redux/dashboardSlice/dashboardSlice';
export const store = createStore(combineReducers({ 
    profileSettings: profileSlice.reducer,
    dashboard: dashboardSlice.reducer
}))
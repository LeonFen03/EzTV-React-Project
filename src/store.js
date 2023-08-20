import { createStore, combineReducers } from 'redux';
import { profileSlice } from './components/Redux/profileSlice/profileSlice';
export const store = createStore(combineReducers({ 
    profileSettings: profileSlice.reducer
}))
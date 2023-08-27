import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect,useMemo } from 'react';
import './Root.css';
import MapContent from '../MapContent/Map';
import { useSelector,useDispatch } from 'react-redux';
import { addChannel,addLastWeek,addThisWeek,addRatedHighly,loadAll,assignProfileID } from '../Redux/profileSlice/profileSlice';
import {countries} from '../Redux/profileSlice/profileSlice';
import ViewMap from '../ViewMap/viewmap';
import { morphObjectData} from '../../UtilityFunctions';
import { grabCountry } from '../../UtilityFunctions';
import { addCountry } from '../Redux/profileSlice/profileSlice';
export const date = new Date();
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}



function Root() {
    const dispatch = useDispatch();
    dispatch(addCountry('United States'))
    const countrySelector = useSelector(countries);
    const currentCountry = useSelector((state) => state.currentCountry);
    return (<>
    <nav className="nav">
    <h2 id="logo">EzTv</h2>
        <ul>
            <li>
            <NavLink to="/Home" className="nav-link animate " >Home </NavLink>
            </li>
            <li>
            <NavLink to="/A-Z" className="nav-link animate " >About </NavLink>
            </li>
            <li>
            <NavLink to="/Profile" className="nav-link animate r" >Profile</NavLink>
            </li>
        </ul>
        
    </nav>
    <div className="map-center">
        <ViewMap />
    </div>
    <Outlet />
    </>)
}

export default Root;
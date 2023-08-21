import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect,useMemo } from 'react';
import './Root.css';
import MapContent from '../MapContent/Map';
import { useSelector,useDispatch } from 'react-redux';
import { addChannel,addLastWeek,addThisWeek,addRatedHighly,loadAll,assignProfileID } from '../Redux/profileSlice/profileSlice';
import {countries} from '../Redux/profileSlice/profileSlice';
import ViewMap from '../ViewMap/viewmap';
import { morphObjectData, serveObjectData } from '../../App';
const date = new Date();
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

async function mediaData() {
    const allSchedules = await fetch('https://api.tvmaze.com/schedule/full');
    return await allSchedules.json();
}    
function grabCountry(obj) {
    if (obj === null) return;
    if (obj.hasOwnProperty("_embedded")) {
        return grabCountry(obj["_embedded"]);
    }
    if (obj.hasOwnProperty("show")) {
        return grabCountry(obj["show"]);
    }
    if (obj.hasOwnProperty("network")) {
        return grabCountry(obj["network"])
    }
    if (obj.hasOwnProperty("webchannel")) {
        return grabCountry(obj["webchannel"]);
    }
    if (obj.hasOwnProperty("country")) {
        return grabCountry(obj["country"]);
    }
    if (obj.hasOwnProperty("name") &&  !(obj.hasOwnProperty("id"))) {
        return obj["name"];
    }
    return false;
}

function Root() {
    const dispatch = useDispatch();
    const countrySelector = useSelector(countries);
    const currentCountry = useSelector((state) => state.currentCountry);
    // let coords = useMemo(async ()=> {
    //     return await getCoords();
    // },[]);
    // if (!coords.length) {
    //     coords = countrySelector["US"];
    // }
    useEffect(()=>{
        
        mediaData().then((resolved) => {
            for (let element of resolved) {
                let airDate = new Date(element.airdate);
                let show = {};
                let L = false;
                try {
                    show = morphObjectData(element,'embedded');
                } catch(err) {
                    L = true;
                }
                
                let country = grabCountry(element);
                if (L) {
                    continue;
                 }
                if ((airDate - date) >= 0 && ((airDate - date) / 1000) <= 604800 && country === currentCountry) {
                    dispatch(assignProfileID({ id: show.id, profile: show, week:'thisWeek'}));
                    // console.log(element, '-This Week');
                } else if  ((airDate - date) < 0 && ((airDate - date) / 1000 ) > -604800 && country === currentCountry) {
                    dispatch(assignProfileID({ id: show.id, profile: show, week:'lastWeek'}));
                    // console.log(element, '-Last Week');
                }
            }  
            dispatch(loadAll(resolved));

    });
    },[])
    return (<>
    <nav className="nav">
    <h2 id="logo">EzTv</h2>
        <ul>
            <li>
            <NavLink cl to="/Home" className="nav-link animate " >Home </NavLink>
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
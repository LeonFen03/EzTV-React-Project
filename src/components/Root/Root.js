import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect} from 'react';
import './Root.css';
import { useDispatch } from 'react-redux';
import ViewMap from '../ViewMap/viewmap';
import { useNavigate } from 'react-router-dom';
import { addCountry } from '../Redux/profileSlice/profileSlice';
export const date = new Date();




function Root() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    dispatch(addCountry('United States'))
    useEffect(() => {
        navigate('/Home');
    },[])
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
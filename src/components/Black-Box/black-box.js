import './black-box.css';
import React from 'react';
import { useSelector } from 'react-redux';
import GoogleLogin from 'react-google-login';
function BlackBox () {
    const country = useSelector((state)=> state.profileSettings.currentCountry);
    return (<>
      <h4>Country: {country}</h4>
      <div className="controls">
            <div style={{display:'flex',flexDirection:'column'}}>
              <label style={{fontWeight:700}} >Search: </label>
                <input id="search" type="text" placeholder="shows,actors, episodes..."/>
            </div>
            <button id="searchButton">Search</button>
            <button>Most Popular</button>
            <button>Notify me</button>
            <div className="filter">
          
            </div>
      </div>
        </>)
}
export default BlackBox;
import './black-box.css';
import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { newContent } from '../../UtilityFunctions';
import { Actors } from '../../UtilityFunctions';
import { searchMedia } from '../../UtilityFunctions';
import { searchResults } from '../../UtilityFunctions';
import { searchResultsRender } from '../../UtilityFunctions';
function BlackBox ({reset}) {
    const country = useSelector((state)=> state.profileSettings.currentCountry);
    const [search,setSearch] = useState();
    const dispatch = useDispatch();
  

    return (<>
      <h4>Country: {country}</h4>
      <div className="controls">
            <div style={{display:'flex',flexDirection:'column'}}>
              <label style={{fontWeight:700}} >Search: </label>
                <input id="search" onChange={(event) => setSearch(event.target.value)} value={search} type="text" placeholder="shows/actors"/>
            </div>
            <button id="searchButton" onClick={() => { searchResultsRender(dispatch,searchResults,search)
            reset(1)
             }
            
          }>Search</button>
            <button onClick={() => { newContent(dispatch,country) 
            reset(1)
            }}>View Shows</button>
            <button onClick={() => { Actors(dispatch,searchMedia,'https://api.tvmaze.com/people')
          reset(1)
          }}>View Actors</button>
          <button >Add To My Schedule</button>
            <div className="filter">
                  <button>Clear Selected</button>
            </div>
      </div>
        </>)
}
export default BlackBox;
import './SlideRender.css';
import React, { useCallback, useMemo } from 'react';
import BlackBox from '../Black-Box/black-box';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import mediaItem from '../mediaItem/mediaItem';
import { Link } from 'react-router-dom';
import '../mediaItem/mediaItem.css';
import { motion } from 'framer-motion';
import { serveObjectData } from '../../App';
import { htmlRender } from '../../UtilityFunctions';
import { renderDashboard } from '../../UtilityFunctions';
import { sortBy } from '../../UtilityFunctions';
const date = new Date();



function Slides() {
    const current = useSelector((state)=> state.profileSettings.currentCountry)
    const thisWeek = useSelector((state)=> state.profileSettings.profileIDs.thisWeek);
    const lastWeek = useSelector((state)=> state.profileSettings.profileIDs.lastWeek);
    const [searchResults,setSearchResults] = useState('');
    const sortOrder = ['Recent', 'By Day', 'Most Popular','Oldest']
    const [sortby,setSortBy] = useState('By Day');
    const defaultArr = [];
    useEffect(()=> {
        document.querySelectorAll('#manage-content .mediaContainer').forEach((container) => {
            container.remove();
    })
    },[current]);

    for (let media in thisWeek) {
        defaultArr.push(thisWeek[media]);
    }
    for (let media in lastWeek ) {
        defaultArr.push(lastWeek[media]);
    }
    const [dashboard,setDashBoard] = useState(defaultArr);
    const dashboardRendered = useMemo(()=> {
        const [objectSortedBoolean, sortedArray] = sortBy(defaultArr,sortby);
       return   (<motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1}}
       exit={{ opacity: 0 }}
       transition={{ duration: 1.7 }}
   > {renderDashboard(sortedArray,current,searchResults,objectSortedBoolean)}</motion.span>)
    },[searchResults,current,sortby])
    return (<div className="slide-container">
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h3>My Dashboard</h3>
                        
                </div>
                <div className="searchResults">
                <div className="filter-buttons">
                    {sortOrder.map((button) => {
                        return (<button onClick={() => setSortBy(button)}>
                            {button}
                        </button>)
                    })}
                </div>
                    <input value={searchResults} placeholder=" search results"  onChange={(event)=> setSearchResults(event.target.value)} />
                </div>
                <div className="resultContainer">
                    <div onDrop={(ev) => {
                        ev.preventDefault();
                        let data = ev.dataTransfer.getData("text");
                        ev.target.appendChild(document.getElementById(data))
                       
                    }} onDragOver={(ev)=> ev.preventDefault()} >
        
                    {dashboardRendered}
                    </div>
                
                    <div id="manage-content" onDrop={(ev) => {
                        let data = ev.dataTransfer.getData("text");
                        if (ev.target.className === "channels") {
                            try {
                                document.getElementById(data).style.pointerEvents = 'none';
                                ev.target.appendChild(document.getElementById(data));
                            } catch(err) {

                            }
                        }

                    }} onDragOver={(ev)=> {
                        ev.preventDefault();
                        
                    } } className="channels">
                        
                    </div>
                </div>
            </div>
            <div>
                
                <div className="black-box">
                  <BlackBox />
                </div>
            </div>
        </div>
        
    </div>)
}
export default Slides;
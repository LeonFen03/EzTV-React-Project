import './SlideRender.css';
import React, { useMemo } from 'react';
import BlackBox from '../Black-Box/black-box';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import './EpisodeListItems.css';
import { motion } from 'framer-motion';
import { renderDashboard } from '../../UtilityFunctions';
import { sortBy } from '../../UtilityFunctions';
import { dashboardSelector } from '../Redux/dashboardSlice/dashboardSlice';
import LoadingPreset from '../../UtilityFunctions';
function TypePlaceHolder(sampleObj,sort) {
    if (sampleObj !== undefined  && (sampleObj.category === 'actorsSearch' || sampleObj.category === 'showSearch')) {
        return 'searchResults';
    } else {
        return sort;
    }
}

function dashboardLoading(dashboardData) {
    let count = 0;
    if (dashboardData === undefined || dashboardData.length === 0) return [];
    const dashboardPage = [[]];
    dashboardData.forEach((element,index)=> {
        if (index % 200 === 0) {
            count++;
            dashboardPage.push([]);
        } else {
            dashboardPage[count].push(element);
        }
    })
    return dashboardPage;
}

function Slides() {
    const current = useSelector((state)=> state.profileSettings.currentCountry)
    //Default state 
    const [page,setPage] = useState(1);
    const dashboardData = useSelector(dashboardSelector).filter(i => i.country === current || i.country === '');
    const [searchResults,setSearchResults] = useState('');
    const sortOrder = ['Recent', 'By Day', 'Oldest',"By Channels"];
    const [sortby,setSortBy] = useState('By Day');
    const pagesOfDashboard = dashboardLoading(dashboardData);
    const dashboard = useMemo(() => pagesOfDashboard.length ? pagesOfDashboard[page] : dashboardData,[[],page,dashboardData,pagesOfDashboard]);
    const dashboardRendered = useMemo(()=> {
        let sortbyCategory = (dashboard[0] !== undefined && dashboard[0].category === 'actors') ? 'bypass' : sortby;
        sortbyCategory = TypePlaceHolder(dashboard[0],sortbyCategory);
        const [objectSortedBoolean, sortedArray] = sortBy(dashboard,sortbyCategory);
       return   (<motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1}}
       exit={{ opacity: 0 }}
       transition={{ duration: 1.7 }}
   > {renderDashboard(sortedArray,searchResults,objectSortedBoolean)}</motion.span>)
    },[searchResults,sortby,dashboard,page])
        
    const loadedContent = (<div>
        <div>
            {pagesOfDashboard.filter(i => i.length > 0).map((_,index)=> {
                return <button style={{backgroundColor: index+1 === page ? 'rgb(35, 35, 90)' : 'white', color: index+1 === page ? 'white' : 'rgb(35, 35, 90)'}} onClick={() => setPage(() =>  (index + 1))} className="pages">{index + 1}</button>
            })}
        </div>
        <motion.div
initial={{ opacity: 0, transform:`scale(0.9)` }}
animate={{ opacity: 1, transform:`scale(1)`}}
exit={{ opacity: 0 }}
transition={{ duration: 1.7,type: "spring" }}
>
    {dashboardRendered}</motion.div>
    </div>);
    return (<div className="slide-container">
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h3>My Dashboard</h3>
                   
                </div>
                <div className="searchResults">
                <div className="filter-buttons">
                    {sortOrder.map((button) => {
                        return (<button key={button} style={{backgroundColor: button === sortby ? 'rgb(35, 35, 90)' : 'white', color: button === sortby ? 'white' : 'rgb(35, 35, 90)'}} onClick={() => setSortBy(button)}>
                            {button}
                        </button>)
                    })}
                    
                </div>
                    <input value={searchResults} placeholder=" search results"  onChange={(event)=> setSearchResults(event.target.value)} />
                </div>
                <div className="resultContainer">
                {pagesOfDashboard.length === 0 ? <LoadingPreset results={pagesOfDashboard} /> : loadedContent}
                
                </div>
            </div>
            <div>
                
                <div className="black-box">
                  <BlackBox reset={setPage} currentCountry={current} />
                </div>
            </div>
        </div>
        
    </div>)
}
export default Slides;
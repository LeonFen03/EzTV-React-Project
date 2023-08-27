import './SlideRender.css';
import React, { useMemo } from 'react';
import BlackBox from '../Black-Box/black-box';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import '../mediaItem/mediaItem.css';
import { motion } from 'framer-motion';
import { renderDashboard } from '../../UtilityFunctions';
import { sortBy } from '../../UtilityFunctions';
import { dashboardSelector } from '../Redux/dashboardSlice/dashboardSlice';

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
    const sortOrder = ['Recent', 'By Day', 'Most Popular','Oldest']
    const [sortby,setSortBy] = useState('By Day');
    const pagesOfDashboard = dashboardLoading(dashboardData);
    const dashboard = useMemo(() => pagesOfDashboard.length ? pagesOfDashboard[page] : dashboardData,[[],current,page]);
    const dashboardRendered = useMemo(()=> {
        let sortbyCategory = (dashboard[0] !== undefined && dashboard.category === 'actors') ? 'bypass' : sortby;
        sortbyCategory = TypePlaceHolder(dashboard[0],sortbyCategory);
        const [objectSortedBoolean, sortedArray] = sortBy(dashboard,sortbyCategory);
       return   (<motion.span
       initial={{ opacity: 0 }}
       animate={{ opacity: 1}}
       exit={{ opacity: 0 }}
       transition={{ duration: 1.7 }}
   > {renderDashboard(sortedArray,current,searchResults,objectSortedBoolean)}</motion.span>)
    },[searchResults,current,sortby,dashboard,page])
        
    return (<div className="slide-container">
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h3>My Dashboard</h3>
                        
                </div>
                <div className="searchResults">
                <div className="filter-buttons">
                    {sortOrder.map((button) => {
                        return (<button key={button} onClick={() => setSortBy(button)}>
                            {button}
                        </button>)
                    })}
                </div>
                    <input value={searchResults} placeholder=" search results"  onChange={(event)=> setSearchResults(event.target.value)} />
                </div>
                <div className="resultContainer">
                    <div>
                        <div>
                            {pagesOfDashboard.filter(i => i.length > 0).map((_,index)=> {
                                return <button onClick={() => setPage((prev) =>  (index + 1))} className="pages">{index + 1}</button>
                            })}
                        </div>
                    {dashboardRendered}
                    </div>
                
                </div>
            </div>
            <div>
                
                <div className="black-box">
                  <BlackBox currentCountry={current} />
                </div>
            </div>
        </div>
        
    </div>)
}
export default Slides;
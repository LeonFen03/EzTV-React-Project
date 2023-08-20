import './SlideRender.css';
import React, { useCallback, useMemo } from 'react';
import BlackBox from '../Black-Box/black-box';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import mediaItem from '../mediaItem/mediaItem';
import { Link } from 'react-router-dom';
import '../mediaItem/mediaItem.css';
import { serveObjectData } from '../../App';
import {GoogleLogin} from 'react-google-login';
const date = new Date();
function htmlRender(name,airdate,day,id ='d') {
    return (<div id={id}  draggable="true" style={{userSelect:'none'}} onDragStart={(ev) => ev.dataTransfer.setData("text", ev.target.id)} className="mediaContainer">
    <div className="flex">
        <Link to={`/TVGuide/${id}`}>{name} </Link>
        <div>

            {day ? day + ' ' : 'TBA '}
            <span className="airdates">{airdate}</span> 
        </div>
    </div>
    <div>

    </div>
    </div>)
}
function renderDashboard (array,current,search='') {
    // {name:element._embedded.show.name, airdate:  element.airdate}
    return array.map((element)=> {
                return [<h2 >{element[0]}</h2>,element[1].map((element)=> {
                const day = serveObjectData(element,'schedule').days[0];
                let country = serveObjectData(element,'country');
                    if (country === null) {
                        country = {name:'none'}
                }
                
                if (country.name === current && element._embedded.show.name.includes(search)) {

                   return htmlRender(element._embedded.show.name,element.airdate,day,element["id"]);
                }
                return '';
                
                }).filter(i => i !== '')]
           }).filter(i => i[1].length > 0);
    
}
// .filter(show => show[1].length > 0)
function sortBy(array,type = 'days') {
   const sortType = {
        days: {
            Monday:[],
            Tuesday:[],
            Wednesday:[],
            Thursday:[],
            Friday:[],
            Saturday:[],
            Sunday: [],
            TBA:[]
        }
   }
   if (type === 'days') {
    array.forEach((item)=> {
            const day = serveObjectData(item,'schedule').days[0];
            sortType.days[day ? day : 'TBA'].push(item);
    });
    return Object.entries(sortType.days);
   }

}
function Slides() {
    const current = useSelector((state)=> state.profileSettings.currentCountry)
    const thisWeek = useSelector((state)=> state.profileSettings.profileIDs.thisWeek);
    const lastWeek = useSelector((state)=> state.profileSettings.profileIDs.lastWeek);
    const [searchResults,setSearchResults] = useState('');
    const [sortby,setSortBy] = useState('days');
    const defaultArr = [];
    useEffect(()=> {
        document.querySelectorAll('#manage-content .mediaContainer').forEach((container) => {
            container.remove();
        })
    },[current])
    for (let media in thisWeek) {
        defaultArr.push(thisWeek[media]);
    }
    for (let media in lastWeek ) {
        defaultArr.push(lastWeek[media]);
    }
    const [dashboard,setDashBoard] = useState(defaultArr);
    const dashboardRendered = useMemo(()=> {
       return renderDashboard(sortBy(dashboard,sortby),current,searchResults);
    },[searchResults,current])
    return (<div className="slide-container">
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h3>My Dashboard</h3>
                        
                </div>
                <div className="searchResults">
                    <input value={searchResults} placeholder="search results"  onChange={(event)=> setSearchResults(event.target.value)} />
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
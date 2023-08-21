import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { serveObjectData } from '../../App';
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeRequests } from '../Redux/profileSlice/profileSlice';
import './TVGuide.css';
import { motion } from 'framer-motion';
import { morphObjectData } from '../../App';
async function grabMetaData(media,type) {
    const showProfile = await fetch(`https://api.tvmaze.com/shows/${media}`);
    const showProfileJSON = await showProfile.json();
    const shows = await fetch(`https://api.tvmaze.com/shows/${media}/seasons`);
    const seasons = await fetch(`https://api.tvmaze.com/shows/${media}/episodes`);
    const showJSON = await shows.json();
    const seasonsJSON = await seasons.json();
    return [showJSON,seasonsJSON,showProfileJSON];
}

function TVGuide() {
    const {media } = useParams();
    const recentMedia = useSelector((state) => state.profileSettings.profileIDs);
    let grabRequestsLimit = useSelector((state)=> state.profileSettings.requests)
    const dispatch = useDispatch();
    const [coolDown,setCoolDown] = useState(false);
    const [show,setShow] = useState({});
    const [season,SetSeasons] = useState({})
    const [showProfile,setShowProfile] = useState({})
    useEffect(() => {
        if (!(grabRequestsLimit <= 3)) {
            setCoolDown(true);
            const killTimer = setTimeout(()=>{
                setCoolDown(false)
               dispatch(changeRequests(0));
               clearTimeout(killTimer)
            },5000);

        }
        if (!coolDown) {
           grabMetaData(media).then((resolved) => {
                const [showJSON,seasonsJSON,showProfileJSON] = resolved;
                if (!(showJSON === show)) {
                    setShow(showJSON);
                }
               if (!(seasonsJSON === season)) {
                    SetSeasons(seasonsJSON);
                }
                if (!(showProfileJSON === season)) {
                    SetSeasons(seasonsJSON);
                }
                setShowProfile(showProfileJSON);
                dispatch(changeRequests(grabRequestsLimit++));
            });
            
        } 
        
    },[media])
    let result;
    for (let category in recentMedia) {
      if (recentMedia[category][media] ) {
        result = recentMedia[category][media] 
       break;
      } else {
        result = '';
      }
    }
    console.log(result)
    // if (serveObjectData(result,'embedded') === null) {

    // }
    //const [embedded,img,airdate] = [serveObjectData(result,'_embedded'),serveObjectData(result,'image'),serveObjectData(result,'airdate')]
    return (<motion.span
        initial={{ opacity: 0,transform:`scale(0.4)` }}
        animate={{ opacity: 1,transform:`scale(1)` }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.7,type: "spring" }}
      ><div className="profile-container">
        <div className="header">
            <div className="header-content">
                <h1>{showProfile.name}</h1>
                <p dangerouslySetInnerHTML={{__html:showProfile.summary}}></p>
                <div className="MediaClicked">
                    <p><span className="clicked">{result.episodeName}</span> episode comes out on  {result.airdate}</p>
                </div>
                <h3>Seasons:</h3>
            </div>

                <div className="img-container">
                {showProfile.image ? <img alt={showProfile.name} src={showProfile.image["medium"]} /> : ''}
                </div>

        </div>

    </div></motion.span>) 
}
export default TVGuide;
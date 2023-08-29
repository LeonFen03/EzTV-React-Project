import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect,useState,useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { changeRequests } from '../Redux/profileSlice/profileSlice';
import {  motion, useAnimationControls} from 'framer-motion';
import { grabMetaData,sortBy,episode } from '../../UtilityFunctions';
import { date } from '../Home/Home';
import GuideLayout from './GuideLayout'
import './TVGuide.css';

function episodeHTMLRender(obj) {
    return ( <div id="about-episode"><p><span className="clicked">{obj.name}</span> {new Date(obj.airdate) >= date ? `premieres` : 'premiered'} {obj.airdate}</p>
    <span dangerouslySetInnerHTML={{__html:obj.summary ? obj.summary : "<p>No Description</p>"}}></span>
    </div>)
}

function validIndex(arrayLength,index,setIndex) {
    if (index < 0) {
        setIndex(0);
        return 0;
    } else if (index <= arrayLength - 1) {
        return index;
    }  else {
        setIndex(0);
        return 0;
    }
}
 // [result, media, animatePresence, recentMedia, grabRequestsLimit, [index,setIndex], dispatch, [coolDown,setCoolDown], [show,setShow],[season,setSeasons],[showProfile,setShowProfile]]
function TVGuide() {
    // Declaration of State Variables
    let result;
    const {media } = useParams();
    const animatePresence = useAnimationControls();
    const recentMedia = useSelector((state) => state.profileSettings.profileIDs);
    let grabRequestsLimit = useSelector((state)=> state.profileSettings.requests)
    const [index, setIndex] = useState(0)
    const dispatch = useDispatch();
    const [coolDown,setCoolDown] = useState(false);
    const [show,setShow] = useState({});
    const [season,SetSeasons] = useState([])
    const [showProfile,setShowProfile] = useState({})
    // Grab profile with ID given through parameters
    for (let category in recentMedia) {
        if (recentMedia[category][media] ) {
          result = recentMedia[category][media] 
         break;
        } else {
          result = '';
        }
    }

    const [episodes,setEpisodes] = useState(result);
    const seasonRender = useMemo(()=> {
        const returnValue = episode(sortBy(season,'Seasons'),[NextSlide,PreviousSlide],setEpisodes);
        return returnValue[validIndex(returnValue.length,index,setIndex)];
    },[season,index]);
    
    const wrapperVariants = {
        bounceStart: {
            transform: 'scale(0.94)',
          transition: { type: 'spring', delay: 0.1,bounce:0.5},
        },
        bounceEnd: {
            transform: 'scale(1)',
          transition: { ease: 'easeInOut' },
        },
    };

    function NextSlide () {
        setIndex((prev) => {
            return prev+1;
        });
    }
    function PreviousSlide() {
        setIndex((prev) => {
            return prev-1;
        });
    }

    useEffect(()=> {
        animatePresence.start('bounceStart')
        const delaySpring = setTimeout(()=> {
            animatePresence.start('bounceEnd')
        },500)
        return () => {
            clearTimeout(delaySpring);
        }
    },[index,animatePresence])

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
                    SetSeasons(seasonsJSON)
                }
                if (!(showProfileJSON === showProfile)) {
                    setShowProfile(seasonsJSON);
                }
                setShowProfile(showProfileJSON);
                dispatch(changeRequests(grabRequestsLimit++));
            });

            
        } 
        
    },[media])


    return <GuideLayout result={result} episodes={episodes} showProfile={showProfile} seasonRender={seasonRender} animatePresence={animatePresence} episodeHTMLRender={episodeHTMLRender} />
}
export default TVGuide;
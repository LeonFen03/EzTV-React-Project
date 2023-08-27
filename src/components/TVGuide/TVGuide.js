import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect,useState,useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { changeRequests } from '../Redux/profileSlice/profileSlice';
import './TVGuide.css';
import {  motion, useAnimationControls} from 'framer-motion';
import { grabMetaData,sortBy,episode } from '../../UtilityFunctions';
import { date } from '../Home/Home';
import { AnimatePresence } from 'framer-motion';
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
 
function TVGuide() {
    let result;
    const {media } = useParams();
    const animatePresence = useAnimationControls();
    const recentMedia = useSelector((state) => state.profileSettings.profileIDs);
    for (let category in recentMedia) {
        if (recentMedia[category][media] ) {
          result = recentMedia[category][media] 
         break;
        } else {
          result = '';
        }
    }
    let grabRequestsLimit = useSelector((state)=> state.profileSettings.requests)
    const [index, setIndex] = useState(0)
    const dispatch = useDispatch();
    const [coolDown,setCoolDown] = useState(false);
    const [show,setShow] = useState({});
    const [season,SetSeasons] = useState([])
    const [showProfile,setShowProfile] = useState({})
    const [episodes,setEpisodes] = useState(result);
    const seasonRender = useMemo(()=> {

        const returnValue = episode(sortBy(season,'Seasons'),index,[NextSlide,PreviousSlide],setEpisodes);
        return returnValue[validIndex(returnValue.length,index,setIndex)];
    },[season,index])
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
        setTimeout(()=> {
            animatePresence.start('bounceEnd')
        },500)
    },[index])
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
    return (<motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 1.7 }}
      ><div className="profile-container">
        <div className="header">
            <div className="header-content">
            <div className="MediaClicked" style={{display:(episodes.airdate ? 'block' : 'none')}}> 
                    <h2 style={{textDecoration:'underline'}}>Episode Selected</h2>
                    <p>Channel: {result.channel}</p>
                    <AnimatePresence>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
      >{episodeHTMLRender(episodes)}</motion.div>
      </AnimatePresence>
                </div>
                <h1>{showProfile.name}</h1>
                <p dangerouslySetInnerHTML={{__html:showProfile.summary}}></p>
                
            </div>
            <div>
                <div className="img-container">
                {showProfile.image ? <img alt={showProfile.name} src={showProfile.image["medium"]} /> : ''}
                </div>
                <h3>Seasons:</h3>
                <div id="seasonContainer" className="seasons">
                    <div>
                        Seasons
                    </div>
                    <motion.div
                    variants={wrapperVariants}
        initial='bounceStart'
        animate={animatePresence} 
        exit="bounceEnd"
        transition={{ duration: 0.2 }}
      >
                    {seasonRender}</motion.div>
                </div>
            </div>
               


        </div>

    </div></motion.span>) 
}
export default TVGuide;
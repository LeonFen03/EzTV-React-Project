import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
function TVGuide() {
    const {media } = useParams();
    const recentMedia = useSelector((state) => state.profileSettings.profileIDs);
    let result;
    for (let category in recentMedia) {
      if (recentMedia[category][media] ) {
       result = recentMedia[category][media] 
       break;
      } else {
        result = '';
      }
    }
    return (<div>
        
    </div>)
}
export default TVGuide;
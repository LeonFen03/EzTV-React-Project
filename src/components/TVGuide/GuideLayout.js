import React from 'react';
import { motion } from 'framer-motion';
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
export default function GuideLayOut ({result,episodes,showProfile,seasonRender,animatePresence, episodeHTMLRender}) {
    return (<div className="profile-container">
        <div className="header">
            <div className="header-content">
            <div className="MediaClicked" style={{display:(episodes.airdate ? 'block' : 'none')}}> 
                    <h2 style={{textDecoration:'underline'}}>Episode Selected</h2>
                    <p>Channel: {result.channel}</p>
                        {episodeHTMLRender(episodes)}
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

    </div>) 
}
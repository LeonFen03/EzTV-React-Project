import React from 'react';
import {motion} from 'framer-motion';
import './About.css';
function About() {
    return(
        <motion.div
        initial={{ opacity: 0, transform:`scale(0.5)` }}
        animate={{ opacity: 1, transform:`scale(1)`}}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.7,type: "spring" }}
      ><div>
        <div className="window">
        <h2>About EzTV</h2>
        <p>

Founded with a vision to revolutionize the entertainment industry, EzTV stands at the forefront of on-demand television and media services. For years, our team has been committed to delivering high-quality content that resonates with viewers of all ages. Leveraging advanced streaming technology and a curated library of shows, films, and documentaries, we offer an unmatched viewing experience that seamlessly bridges diverse genres and cultures. At EzTV, we believe in pushing boundaries and embracing innovation, ensuring that our users always have the best seat in the house. Dive in, explore, and let us redefine your television journey.</p>
        </div>
        
    </div></motion.div>)
}

export default About;
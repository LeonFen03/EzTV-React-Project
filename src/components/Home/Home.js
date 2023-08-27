import React from 'react';
import { motion } from 'framer-motion';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Slides from '../SlidesRender/SlideRender';
import ShowListing from '../AZShowListings/ShowListings';
import './Home.css';
import { defaultScheduling } from '../../UtilityFunctions';

export const date = new Date();


function Home  () {
        const currentCountry = useSelector((state)=> state.profileSettings.currentCountry);
        const dispatch = useDispatch();
        useEffect(()=>{   
           defaultScheduling(dispatch);
        },[])
    return(<>
     <motion.span
        initial={{ opacity: 0, transform:`scale(0.5)` }}
        animate={{ opacity: 1, transform:`scale(1)`}}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.7,type: "spring" }}
      >
	<div className="control-board">
		<Slides />
    </div>
	<ShowListing />
    </motion.span>
	</>)

}
export default Home;
import React from 'react';
import { motion } from 'framer-motion';
import { useEffect,useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Slides from '../SlidesRender/SlideRender';
import ShowListing from '../AZShowListings/ShowListings';
import './Home.css';
const daySort = {
	Monday: 7,
	Tuesday:6,
	Wednesday:5,
	Thursday:4,
	Friday:3,
	Saturday:2,
	Sunday:1
	
}
function grabCountry(obj) {
    if (obj === null) return;
    if (obj.hasOwnProperty("_embedded")) {
        return grabCountry(obj["_embedded"]);
    }
    if (obj.hasOwnProperty("show")) {
        return grabCountry(obj["show"]);
    }
    if (obj.hasOwnProperty("network")) {
        return grabCountry(obj["network"])
    }
    if (obj.hasOwnProperty("webchannel")) {
        return grabCountry(obj["webchannel"]);
    }
    if (obj.hasOwnProperty("country")) {
        return grabCountry(obj["country"]);
    }
    if (obj.hasOwnProperty("name") &&  !(obj.hasOwnProperty("id"))) {
        return obj["name"];
    }
    return false;
}
function Home  () {
const currentCountry = useSelector((state)=> state.profileSettings.currentCountry);

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
import './viewmap.css';
import React from 'react';
import {countries} from '../Redux/profileSlice/profileSlice';
import { useSelector} from 'react-redux';
import { useEffect,useMemo,useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import MapContent from '../MapContent/Map';
import { animate } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addCountry } from '../Redux/profileSlice/profileSlice';
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

function ViewMap() {
    const [on,setOn] = useState('none');
    const [ctry,setCtry] = useState([37.0902, -95.7129])
    const [currentMap,setCurrentMap] = useState(false)
    const dispatch = useDispatch();
    const countrySelector = useSelector(countries);
    let coords = useMemo(async ()=> {
        return await getCoords();
    },[]);
    if (!coords.length) {
        coords = countrySelector["Spain"];
    }
    function handleChange(event) {
        setCtry(event.target.value.split(',').map(i => +i))
        for (let country of Object.entries(countrySelector)) {
            if (JSON.stringify(country[1]) === JSON.stringify(event.target.value.split(',').map(i => +i))) {
                dispatch(addCountry(country[0]));
            }
        }
    
    }
    useEffect(()=> {
        const currentLocation = document.getElementById("selectCountry");
        if (currentLocation) {
            for (let country of Object.entries(countrySelector)) {
                if (JSON.stringify(country[1]) === JSON.stringify(currentLocation.value.split(',').map(i => +i))) {
                    dispatch(addCountry(country[0]));
                }
            }
        }
    },[])
    useEffect(()=>{
        if (on === 'none') {
            animate(document.getElementById('map-container'), { width: `300px`, height:`450px`,padding:'25px'}, { duration: 0.5 })
            animate(document.getElementById('map'), { transform:`scale(1)`, opacity: 1,width: `300px`, height:`auto`, boxShadow:`box-shadow: 4px 4px 1px grey`}, { duration: 1 })
        } else {
            animate(document.getElementById('map-container'), { width: `0px`, height:`0px`,padding:'0px' }, { duration: 0.8 })
            animate(document.getElementById('map'), { transform:`scale(0.5)`, opacity: 0, width: `10px`, height:`20px`, boxShadow: `0px`}, { duration: 0.2 })
        }
    },[on,ctry])
    function toggle() {
        if (on === 'none') {
            setOn('block');
        } else {
            setOn('none');
        }
    }

    return (<div className="view">
        <button onClick={toggle} >
            Change Location 
        </button>
        <AnimatePresence>
        <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.7 }}
      >
        <div id="map-container">
            <div id="map">
                <h2>Streaming from <select id="selectCountry" name="country" onChange={handleChange}>
                    {Object.entries(countrySelector).map((country)=> {
                        if (country[0] === "United States") {
                            return <option selected="true" value={country[1]} >{country[0]}</option>
                        }
                        return <option value={country[1]} >{country[0]}</option>
                    })}
                    </select> </h2>
                <MapContent css={{borderRadius:`1000px`,width:'300px',height:'300px'}} coords={ctry} name='home' setCurrentMap={setCurrentMap} currentMap={currentMap} />
            </div>
           
        </div>
        </motion.span>
        </AnimatePresence>
    </div>)
}

export default ViewMap;
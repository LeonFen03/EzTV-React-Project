import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMemo,useEffect } from 'react';
import { useState } from 'react';
import Map from '../Redux/profileSlice/profileSlice';
import './Map.css';
function MapContent ({coords, name, css, setCurrentMap, currentMap}) {
    const emptyMap = new Map(name);
    useEffect(()=> {
        if (currentMap) {
            currentMap.remove();
        }
        const ping = setInterval(()=> {
            let activeMap = emptyMap.setUp(coords);
            if (activeMap === null) {
                emptyMap.setUp(coords);
            } else {
                console.log('close')
                setCurrentMap(activeMap);
                clearInterval(ping);
            }
        },400);
        return () => {
            clearInterval(ping);
        }
    },[coords]);
    return (<div >
        <div style={css} className="map" id={name}>
        </div>
    </div>) 
}
export default MapContent;
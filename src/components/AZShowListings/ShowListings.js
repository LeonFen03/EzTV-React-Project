import React from 'react';
import './ShowListings.css'
import { useSelector } from 'react-redux';
function ShowListing() {
    const thisWeek = useSelector((state)=> state.profileSettings.profileIDs.thisWeek);
}

export default ShowListing;
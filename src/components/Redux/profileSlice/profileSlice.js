import {createSlice } from "@reduxjs/toolkit";
import L from "leaflet";
const profileSettings = {
    currentCountry: 'United States',
    Country: {
        "Korea, Republic of": [35.9078, 127.7669],
        "Australia": [-25.2744, 133.7751],
        "United Kingdom": [55.3781, -3.4360],
        "New Zealand": [-40.9006, 174.8860],
        "Russian Federation": [61.5240, 105.3188],
        "United States": [37.0902, -95.7129],
        "Hong Kong": [22.3964, 114.1095],
        "Norway": [60.4720, 8.4689],
        "China": [35.8617, 104.1954],
        "Canada": [56.1304, -106.3468],
        "Thailand": [15.8700, 100.9925],
        "Japan": [36.2048, 138.2529],
        "Spain": [40.4637, -3.7492],
        "Turkey": [38.9637, 35.2433],
        "Germany": [51.1657, 10.4515],
        "Brazil": [-14.2350, -51.9253],
        "Denmark": [56.2639, 9.5018],
        "Israel": [31.0461, 34.8516],
        "India": [20.5937, 78.9629],
        "Portugal": [39.3999, -8.2245],
        "Taiwan, Province of China": [23.6978, 120.9605],
        "France": [46.6034, 1.8883],
        "Hungary": [47.1625, 19.5033],
        "Philippines": [12.8797, 121.7740],
        "Finland": [61.9241, 25.7482],
        "Belgium": [50.8503, 4.3517],
        "Bulgaria": [42.7339, 25.4858],
        "Sweden": [60.1282, 18.6435],
        "Italy": [41.8719, 12.5674],
        "Croatia": [45.1000, 15.2000]
    },
    requests:0,
    RenderCount:20,
    ratedHighly: {
        display:[]
    },
    All:[],
    profileIDs: {
        actors: {

        },
        show: {

        },
        thisWeek:{

        },
        lastWeek:{

        }
    }

}

export const countries = (state) => {
    return state.profileSettings.Country;
} 


const options ={
    name:'profileSettings',
    initialState:profileSettings,
    reducers: {
        addActor (state,action) {
            state.profileIDs['actors'][action.payload.id] = {...action.payload.profile, category: 'actors'};
        },
        addShow(state,action) {
            state.profileIDs['show'][action.payload.id] = {...action.payload.profile, category: 'show'};
        },
        changeRequests(state,action) {
            state.requests = action.payload;
        },
        clearProfileData (state,action) {
            state.profileIDs.thisWeek = [];
            state.profileIDs.lastWeek = [];
        },
        addCountry (state,action) {
            state.currentCountry = action.payload;
        },
        assignProfileID(state,action) {
            state.profileIDs[action.payload.week][action.payload.id] = { ...action.payload.profile, category: action.payload.week};
        },
        changeCount(state,action) {
            state.RenderCount = action.payload;
        },
        loadAll(state,action) {
            state.All = action.payload;
        },
        addRatedHighly(state,action) {
            state.thisWeek.display = action.payload;
        }
    }
}


export const profileSlice = createSlice(options);

export const {loadAll,changeRequests, addShow, addActor, addThisWeek,addLastWeek,addRatedHighly, assignProfileID, addCountry} = profileSlice.actions;

class Map {
    constructor(name) {
        this.name = name;
        this.coordinates = [];
        this.businesses = []
        this.map = null;
        this.markers = {}
        this.layer = {}
    }
    setUp(coords) {
        this.coordinates = coords;
        try {
            this.map = L.map(this.name, {
                center: this.coordinates,
                zoom: 10,
                }).setView([5,5],5);
        } catch(err) {
            this.map = null;
        }
        if (this.map === null) {
            return false;
        }
        this.map.flyTo(this.coordinates, 4)
        this.layer = L.layerGroup().addTo(this.map); 
        // add openstreetmap tiles
        L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=KS4Fxl5XDMU6CwEEsQO4').addTo(this.map)
        // create and add geolocation marker
        const marker = L.marker(this.coordinates)
        .bindPopup(`Media`)
        .addTo(this.map);
        return this.map;
    }
    addBusinesses(businessArr) {
        this.businesses = businessArr;
        this.addMarkers();
    }
    resetBusinesses() {
        this.layer.clearLayers();
    }
}
export default Map;
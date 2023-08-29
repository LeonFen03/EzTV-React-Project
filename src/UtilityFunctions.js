import React from "react"
import { Link } from "react-router-dom"
import { clearArray,addToRender } from "./components/Redux/dashboardSlice/dashboardSlice";
import { assignProfileID,loadAll } from "./components/Redux/profileSlice/profileSlice";
import { addShow } from "./components/Redux/profileSlice/profileSlice";
import { animate } from "framer-motion";
import { addActor } from "./components/Redux/profileSlice/profileSlice";
import ArrowL from './images/arrowL.svg';
import ArrowR from './images/arrowR.svg';
const date = new Date();
// Formats time
const getFormattedTime = function (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + ':' + minutes + amPm;
};

export async function mediaData(url = 'https://api.tvmaze.com/schedule/full') {
    const allSchedules = await fetch(url);
    return await allSchedules.json();
}    

export default function LoadingPreset() {
    return (<div className="loader-container">
        <p style={{position:'absolute',fontSize:'0.7em'}}>Loading...</p>
    <div className="spinner"></div>
</div>)
}

//Military time converter 
// Render HTML DashBoard Objects
export function htmlRender(showObject,key = '') {
    if (showObject.category === 'default') {
  
        return (<div key={key} id={showObject.id}   style={{userSelect:'none'}} className="mediaContainer">
        <div className="flex">
            <Link to={`/TVGuide/${showObject.id}`}>{showObject.name} -{showObject.episodeName  ? <b>{showObject.episodeName}</b> : ''} </Link>
            <div>
                {showObject.schedule.days[0] ? showObject.schedule.days[0]  + ' ' : 'TBA '}
                {showObject ? getFormattedTime(showObject.schedule.time +'') + ' ' : ''}
    <b >{showObject.airdate + ' '}</b>
                
            </div>
            <input type="checkbox" />
        </div>
        <div>
    
        </div>
        </div>)
    } else if (showObject.category === 'premiered') {
        return (<div key={key} id={showObject.id}  className="mediaContainer">
        <div className="flex">
            <Link to={`/TVGuide/${showObject.id}`}>{showObject.name}</Link>
            <div>
    
                {showObject.schedule.days[0] ? showObject.schedule.days[0]  + ' ' : 'TBA '}
    <b >{`premiered: ${showObject.airdate}`}</b>
            </div>
            <input type="checkbox" />
        </div>
        <div>
    
        </div>
        </div>)
    }  else if (showObject.category === 'episode') {
        return (<div onClick={() => showObject.setEpisode(showObject)} key={key} id={showObject.id}   style={{userSelect:'none'}} className="mediaContainer">
            <p><span style={{fontWeight:'700',fontSize:'1em'}}>{showObject.name} </span> <span>runtime: {showObject.runtime} minutes</span> <b>{`premiered: ${showObject.airdate}`}</b></p>
        <div>
        </div>
        </div>)
    } else if ( showObject.category === 'actors') {
        return (<div key={key} id={showObject.id}   style={{userSelect:'none'}} className="mediaContainer">
         <Link to={`/Actor/${showObject.id}`}><b>{showObject.name}</b></Link> <p> <span className="actor">{`Gender: ${showObject.gender}`}</span> <span className="actor">{`Birthday: ${showObject.birthday}`}</span>  <span className="actor">{showObject.deathday }</span> </p>
    <div>
    </div>
    <div>{showObject.description}</div>
    </div>)
    }
  
}

// DashBoard logic for Elements sorted through Objects or Arrays.
export function renderDashboard (array,search='',sortedWithObject = false) {
    if (sortedWithObject === true) {
        return array.map((element)=> {
            return [<h2 >{element[0]} <img src=""/> </h2>,element[1].map((element,index)=> {
            
            if (( (element.name.includes(search)) || element.episodeName.includes(search) || (element.hasOwnProperty('airdate') && element.airdate.includes(search))) ) {
               return htmlRender(element,index);
            }
            return '';
            
            }).filter(i => i !== '')]
       }).filter(i => i[1].length > 0);
    } else {
        return array.map((element,index)=> {    
            if ( element.name.includes(search)) {
               return htmlRender(element,index);
            }
            return ''
            }).filter(i => i !== '')
    }
   
    
}
// Function that render the appearance of the each episode related to it's season within the TVGuide.
export function episode(sortedArray,[Next,Previous],setEpisode) {
    return (sortedArray[1].map((element)=> {
        return <div>
            <div className="header">
                <button className="btn" onClick={Next}> {<img alt='arrow-left-logo' width="10" src={ArrowR} />}</button>
                <span style={{cursor:'pointer'}} onClick={() => {
                
                const toggleStatus = (document.getElementById(element[0]).getBoundingClientRect().height === 0);
                (toggleStatus ? animate(document.getElementById(element[0]), { height:`350px`,padding:'15px',overflow:'scroll'}, { duration: 0.5 }) : animate(document.getElementById(element[0]), { height:`0px`,padding:'0px',overflow:'none',border:'0px'}, { duration: 0.5 }))
            
            } } className="animate">{element[0]}</span>
             <button className="btn" onClick={Previous}> {<img  alt='arrow-right-logo' width="10" src={ArrowL} />} </button>
            </div>
            
        <div className="episodelist" id={element[0]}>
       {element[1].length > 0 ? element[1].map((element,index)=> {
            return htmlRender({category: 'episode', ...element, setEpisode: setEpisode},index);
        }) : 'No Episodes Found'} </div></div>
   }))
}


//Sorting Array based on preferences defined
export function sortBy(array,type = 'By Day') {
    const sortType = {
         days: {
             Monday:[],
             Tuesday:[],
             Wednesday:[],
             Thursday:[],
             Friday:[],
             Saturday:[],
             Sunday: [],
             TBA:[]
         },
         seasons: {
            
         },
         SearchResults: {
            "TV Shows": [],
            "Actors":[]
         },
         Popular: {
            "Most Popular":[],
            "UnRated":[]
         }
    }
    if (type === 'By Day') {
         array.sort((a,b) => {
             let dateA = new Date(a.airdate);
             let dateB = new Date(b.airdate);
 
             return dateA - dateB;
         })
     
         array.forEach((item)=> {
             const day = item.schedule.days[0];
             sortType.days[day ? day : 'TBA'].push(item);
         });
         return [true, Object.entries(sortType.days)];
    } else if (type === 'Recent') {
       array.sort((a,b) => {
            let dateA = new Date(a.airdate);
            let dateB = new Date(b.airdate);
            if (a.category === 'premiered' && b.category === 'premiered') {
                return dateB - dateA;
            }
            return dateA - dateB;
        })
         return [false, array];
    } else if (type === 'Oldest') {
        array.sort((a,b) => {
            let dateA = new Date(a.airdate);
            let dateB = new Date(b.airdate);
            if (a.category === 'premiered' && b.category === 'premiered') {
                return dateA - dateB;
            }
            return dateB - dateA;
        })
         return [false, array];
    } else if (type === 'Seasons') {
        array.sort((a,b) => {
            let dateA = new Date(a.airdate);
            let dateB = new Date(b.airdate);
            if (a.category === 'premiered' && b.category === 'premiered') {
                return dateA - dateB;
            }
            return dateB - dateA;
        });
        array.forEach((episode) => {
            sortType.seasons['Season: ' + episode.season] ?  sortType.seasons['Season: ' +episode.season].push(episode) :  sortType.seasons['Season: ' +episode.season] = [];
        })
        return [false, Object.entries(sortType.seasons)];
    } else if (type === 'bypass') {
        return [false, array];
    }   else if (type === "searchResults") {
        array.forEach((result) => {
            if (result.category === 'showSearch') {
                sortType.SearchResults["TV Shows"].push({...result, category: 'premiered'});
            } else if (result.category === 'actorsSearch') {
                sortType.SearchResults.Actors.push({...result, category: 'actors'});
            }
        })
        return [true,Object.entries(sortType.SearchResults)]
    } 

 
 }

 // Object Methods of extracting information from the API JSON
 export const serveObjectData = (obj,property) => {
    let layer = null;
    for (let prop in obj) {
      if (property === String(prop)) {
          return obj[property];
      }
      if (typeof(obj[prop]) === "object")
        layer = serveObjectData(obj[prop],property);
      if (layer !== null && layer !== false) {
          return layer;
      }
    }
    return layer;
}
function defaultProperty(property) {
    if (property !== null && property !== false && property !== {}) {
        return property;
    } else {
      return false;
    }
}
export const morphObjectData = (obj,type) => {
    if (obj.hasOwnProperty("_embedded") && type === 'embedded') {
        const show = serveObjectData(obj,'_embedded').show;
        return { id: defaultProperty(show["id"]), episodeName: defaultProperty(obj.name), channel:(show["network"] ? defaultProperty(show["network"].name) : defaultProperty(show['webChannel'].name)) , season: defaultProperty(obj.season), airdate: defaultProperty(obj.airdate), genres: defaultProperty(show["genres"]), name: defaultProperty(show.name), image: defaultProperty(show["image"].medium), schedule: defaultProperty(show["schedule"]), country: (show["network"] ? show["network"].country.name : show['webChannel'].country.name), runtime: defaultProperty(show.runtime)}
    } else if (type === 'show') {
      return { id: defaultProperty(obj.id), channel:defaultProperty((obj["network"] ? obj["network"].name : obj['webChannel'].name)) , rating:defaultProperty(obj.rating.average), season:defaultProperty(''), airdate: defaultProperty(obj.premiered), genres: defaultProperty(obj["genres"]), name: defaultProperty(obj.name), image: defaultProperty(obj["image"].medium), schedule: defaultProperty(obj["schedule"]), country: defaultProperty((obj["network"] ? obj["network"].country.name : obj['webChannel'].country.name)), runtime: defaultProperty(obj.runtime)}
    } else if (type === 'episode') {
        return { id: defaultProperty(obj.id), season:defaultProperty(obj.season), summary: defaultProperty(obj["summary"]), name: defaultProperty(obj.name), image:defaultProperty(obj["image"].medium), schedule: defaultProperty(obj.airtime),  runtime: defaultProperty(obj.runtime)}
    } else if (type === 'actorsSearch') {
        return { id: defaultProperty(obj.person.id), birthday: defaultProperty(obj.person.birthday), name: defaultProperty(obj.person.name), image:defaultProperty(obj.person["image"].medium), country: defaultProperty(obj.person.country.name),  deathday: defaultProperty(obj.person.deathday)}
    } else if (type === 'actors') {
        return { id: obj.id, birthday: (defaultProperty(obj.birthday) === false) ? 'Not Recorded' : defaultProperty(obj.birthday), gender: defaultProperty(obj.gender), name: defaultProperty(obj.name), image:defaultProperty(obj["image"].medium), country: defaultProperty(obj.country.name),  deathday: (defaultProperty(obj.deathday) === false) ? 'No Recorded Death Date' :  `Death: ${obj.deathday}`}
    }  else if (type === 'showSearch') {
        return { id: defaultProperty(obj.show.id), channel:defaultProperty((obj.show["network"] ? obj.show["network"].name : obj.show['webChannel'].name)) ,  season:defaultProperty(''), airdate:defaultProperty(obj.show.premiered), genres:defaultProperty(obj.show["genres"]), name: defaultProperty(obj.show.name), image:defaultProperty(''), schedule: defaultProperty(obj.show["schedule"]), country: defaultProperty(''), runtime: defaultProperty(obj.show.runtime)}// defaultProperty((obj.show["network"] ? obj.show["network"].country : obj['webChannel'].country))
    }
}

export async function grabMetaData(media) {
    const showProfile = await fetch(`https://api.tvmaze.com/shows/${media}`);
    const showProfileJSON = await showProfile.json();
    const shows = await fetch(`https://api.tvmaze.com/shows/${media}/seasons`);
    const seasons = await fetch(`https://api.tvmaze.com/shows/${media}/episodes`);
    const showJSON = await shows.json();
    const seasonsJSON = await seasons.json();
    return [showJSON,seasonsJSON,showProfileJSON];
}



export async function searchMedia(url) {
    const Listings = await fetch(url);
    return await Listings.json();
}

export function grabCountry(obj) {
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

export async function searchResults(search) {
    const showJSON = await fetch(`https://api.tvmaze.com/search/shows?q=${search}`);
    const peopleJSON = await fetch(`https://api.tvmaze.com/search/people?q=${search}`);
    const show = await showJSON.json();
    const people = await peopleJSON.json();
    return [show, people]

}

export function searchResultsRender(dispatch,media,search) {

   const searchJSON = media(search);
    searchJSON.then((resolved) => {
        dispatch(clearArray());
        for (let element of resolved[0]) {
          let show = {};
          try {
              show = morphObjectData(element,'showSearch');
             
          } catch(err) {
                continue;
          }
          dispatch(addToRender({...show, category:'showSearch'}))
          dispatch(addShow({ id: show.id, profile: {...show, category:'showSearch'}}));
        }  
        
        for (let element of resolved[1]) {
            let actor = {};
            try {
                actor = morphObjectData(element,'actorsSearch');
            } catch(err) {
                continue;
            }
        dispatch(addActor({ id: actor.id, profile: {...actor, category:'actorsSearch'}}));
        dispatch(addToRender({...actor, category:'actorsSearch'}))
         }
  })
  
  
}
export async function showListings() {
    const Listings1 = await fetch(`https://api.tvmaze.com/shows?page=1`);
    const ListingsPage1 = await Listings1.json();
    const Listings2 = await fetch(`https://api.tvmaze.com/shows?page=2`);
    const ListingsPage2 = await Listings2.json();
    return [...ListingsPage1,...ListingsPage2];
}

export function newContent(dispatch) {
    showListings().then((resolved) => {
          dispatch(clearArray());
          for (let element of resolved) {
            let show = {};
            try {
                show = morphObjectData(element,'show');
            } catch(err) {
                continue;
            }
            dispatch(addShow({ id: show.id, profile: {...show, category:'premiered'}}));
            dispatch(addToRender({...show, category:'premiered'}))
        }  
    })
  
    
  
  }

  export function Actors(dispatch,media,url = '') {
    media(url).then((resolved) => {
          dispatch(clearArray());
          for (let element of resolved) {
            let actor = {};
            try {
                actor = morphObjectData(element,'actors');
            } catch(err) {
                continue;
            }
            dispatch(addActor({ id: actor.id, profile: {...actor, category:'actors'}}));
            dispatch(addToRender({...actor, category:'actors'}))
        }  
    })
  
    
  
  }

export function defaultScheduling(dispatch) {
    dispatch(clearArray());
    mediaData().then((resolved) => {
        for (let element of resolved) {
            let airDate = new Date(element.airdate);
            let show = {};
            try {
                show = morphObjectData(element,'embedded');
            } catch(err) {
                continue;
            }
            if ((airDate - date) >= 0 && ((airDate - date) / 1000) <= 1209600) {
                dispatch(assignProfileID({ id: show.id, profile: show, week:'thisWeek'}));
                dispatch(addToRender({...show, category:'default'}))
            } else if  ((airDate - date) < 0 && ((airDate - date) / 1000 ) > -1209600) {
                dispatch(assignProfileID({ id: show.id, profile: show, week:'lastWeek'}));
                dispatch(addToRender({...show, category:'default'}))
            }
        }  
        dispatch(loadAll(resolved));

});
}
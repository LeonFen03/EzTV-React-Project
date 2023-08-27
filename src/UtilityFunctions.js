import React from "react"
import { Link } from "react-router-dom"
import { clearArray,addToRender } from "./components/Redux/dashboardSlice/dashboardSlice";
import { assignProfileID,loadAll } from "./components/Redux/profileSlice/profileSlice";
import { addShow } from "./components/Redux/profileSlice/profileSlice";
import { animate } from "framer-motion";
import { addActor } from "./components/Redux/profileSlice/profileSlice";
const date = new Date();
// let gapi = window.gapi
// const CLIENT_ID = "244966774357-lar6f93e0sisfhuj0f592j29v3dul6qv.apps.googleusercontent.com"
// const API_KEY = "AIzaSyD7dtQlkwAJFNQNJMcwFNXgTaJx_-ISeU0"
// const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
// const SCOPES = "https://www.googleapis.com/auth/calendar"

const getFormattedTime = function (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + ':' + minutes + amPm;
};


// export function handleClick() {
//     gapi.load('client:auth2', () => {
//         console.log('loaded client')
  
//         gapi.client.init({
//           apiKey: API_KEY,
//           clientId: CLIENT_ID,
//           discoveryDocs: DISCOVERY_DOCS,
//           scope: SCOPES,
//         })
  
//         gapi.client.load('calendar', 'v3', () => console.log('bam!'))
  
//         gapi.auth2.getAuthInstance().signIn().then(() => {
          
//           var event = {
//             'summary': 'NIgggies die!',
//             'location': '800 Howard St., San Francisco, CA 94103',
//             'description': 'Really great refreshments',
//             'start': {
//               'dateTime': '2020-06-28T09:00:00-07:00',
//               'timeZone': 'America/Los_Angeles'
//             },
//             'end': {
//               'dateTime': '2020-06-28T17:00:00-07:00',
//               'timeZone': 'America/Los_Angeles'
//             },
//             'recurrence': [
//               'RRULE:FREQ=DAILY;COUNT=2'
//             ],
//             'attendees': [
//               {'email': 'lpage@example.com'},
//               {'email': 'sbrin@example.com'}
//             ],
//             'reminders': {
//               'useDefault': false,
//               'overrides': [
//                 {'method': 'email', 'minutes': 24 * 60},
//                 {'method': 'popup', 'minutes': 10}
//               ]
//             }
//           }
  
//           let request = gapi.client.calendar.events.insert({
//             'calendarId': 'primary',
//             'resource': event,
//           })
  
//           request.execute(event => {
//             window.open(event.htmlLink)
//           })
        
//       })
//     })
//   }



export async function mediaData(url = 'https://api.tvmaze.com/schedule/full') {
    const allSchedules = await fetch(url);
    return await allSchedules.json();
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
         <b><Link to={`/Actor/${showObject.id}`}>{showObject.name}</Link></b> <p> <span className="actor">{`Gender: ${showObject.gender}`}</span> <span className="actor">{`Birthday: ${showObject.birthday}`}</span>  <span className="actor">{showObject.deathday }</span> </p>
    <div>
    </div>
    <div>{showObject.description}</div>
    </div>)
    }
  
}

// DashBoard logic for Elements sorted through Objects or Arrays.
export function renderDashboard (array,current = '',search='',sortedWithObject = false) {
    if (sortedWithObject === true) {
        return array.map((element)=> {
            return [<h2 >{element[0]}</h2>,element[1].map((element,index)=> {
            
            if ((element.name.includes(search) || element.episodeName.includes(search)) ) {
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

export function episode(array,listIndex,[Next,Previous],setEpisode) {
    return array[1].map((element)=> {
        return <div>
            <div className="header">
                <button className="btn" onClick={Next}> {`>`} {/*<i class="fa-solid fa-arrow-right"></i>*/}</button>
                <span onClick={() => {
                
                const toggleStatus = (document.getElementById(element[0]).getBoundingClientRect().height === 0);
                (toggleStatus ? animate(document.getElementById(element[0]), { height:`550px`,padding:'15px',overflow:'scroll'}, { duration: 0.5 }) : animate(document.getElementById(element[0]), { height:`0px`,padding:'0px',overflow:'none',border:'0px'}, { duration: 0.5 }))
            
            } }>{element[0]}</span>
             <button className="btn" onClick={Previous}> {`<`} </button>
            </div>
            
        <div className="episodelist"  id={element[0]}>
       {element[1].map((element,index)=> {
            return htmlRender({category: 'episode', ...element, setEpisode: setEpisode},index);
        })} </div></div>
   });
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
            TVShows: [],
            Actors:[]
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
                sortType.SearchResults.TVShows.push({...result, category: 'premiered'});
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
      return { id: obj.id, channel:defaultProperty((obj["network"] ? obj["network"].name : obj['webChannel'].name)) ,  season:'', airdate:obj.premiered, genres:obj["genres"], name: obj.name, image:obj["image"].medium, schedule: obj["schedule"], country: (obj["network"] ? obj["network"].country.name : obj['webChannel'].country.name), runtime: defaultProperty(obj.runtime)}
    } else if (type === 'episode') {
        return { id: obj.id, season:obj.season, summary: obj["summary"], name: obj.name, image:obj["image"].medium, schedule: obj.airtime,  runtime: defaultProperty(obj.runtime)}
    } else if (type === 'actorsSearch') {
        return { id: obj.person.id, birthday: defaultProperty(obj.person.birthday), name: obj.person.name, image:obj.person["image"].medium, country: defaultProperty(obj.person.country.name),  deathday: defaultProperty(obj.person.deathday)}
    } else if (type === 'actors') {
        return { id: obj.id, birthday: defaultProperty(obj.birthday), gender: obj.gender, name: obj.name, image:obj["image"].medium, country: defaultProperty(obj.country.name),  deathday: (defaultProperty(obj.deathday) === false) ? 'No Recorded Death Date' :  `Death: ${obj.deathday}`}
    }  else if (type === 'showSearch') {
        return { id: obj.show.id, channel:defaultProperty((obj.show["network"] ? obj.show["network"].name : obj.show['webChannel'].name)) ,  season:'', airdate:obj.show.premiered, genres:obj.show["genres"], name: obj.show.name, image:'', schedule: obj.show["schedule"], country: '', runtime: defaultProperty(obj.show.runtime)}// defaultProperty((obj.show["network"] ? obj.show["network"].country : obj['webChannel'].country))
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

export async function showListings() {
    const Listings = await fetch(`https://api.tvmaze.com/shows?page=1`);
    return await Listings.json();
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

export async function searchResults(search) { //https://api.tvmaze.com/search/shows?q=girls
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


export function newContent(dispatch,currentCountry, media = showListings,data='') {
    media(data).then((resolved) => {
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
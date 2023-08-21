import logo from './logo.svg';
import './App.css';
import {Router} from 'react-router-dom';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import { useState } from 'react';
import Home from './components/Home/Home';
import Root from './components/Root/Root';
import TVGuide from './components/TVGuide/TVGuide';
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
      return { id: obj.id, channel:defaultProperty((obj.show["network"] ? obj.show["network"].name : obj.show['webChannel'].name)) , season:obj.season, airdate:obj.airdate, genres:obj.show["genres"], name: obj.show.name, image:obj.show["image"].medium, schedule: obj.show["schedule"], country: (obj.show["network"] ? obj.show["network"].country.name : obj.show['webChannel'].country.name), runtime: defaultProperty(obj.show.runtime)}
    }
    
}
function App() {
  
  const appRouter = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}> 
      <Route path="/A-Z" element={<Home /> } />
      <Route path="/Home" element={<Home />}/>
      <Route path="/Profile" element={<Home />}/>
      <Route path="/TVGuide" element={<TVGuide />}>
        <Route path=":media" element={<Home />}/>
      </Route >
      </Route>))

  return (<div>
      <AnimatePresence mode="wait">
    <RouterProvider router={appRouter} />
    </AnimatePresence>
  </div>);
}

export default App;

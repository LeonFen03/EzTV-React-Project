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

import './App.css';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import Home from './components/Home/Home';
import Root from './components/Root/Root';
import TVGuide from './components/TVGuide/TVGuide';
import Actor from './components/TVGuide/Actor';
import About from './components/About/About';
function App() {
  
  const appRouter = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}> 
      <Route path="/Home" element={<Home />}/>
      <Route path='/About' element={<About />}/>
      <Route path="/Profile" element={<Home />}/>
      <Route path="/TVGuide" element={<TVGuide />}>
        <Route path=":media" />
      </Route >
      <Route path="Actor" element={<Actor />}>
            <Route path=":id" />
        </Route>
      </Route>))

  return (<div>
      <AnimatePresence mode="wait">
    <RouterProvider router={appRouter} />
    </AnimatePresence>
  </div>);
}

export default App;

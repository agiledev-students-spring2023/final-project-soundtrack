import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import './App.css';
import Login from './Pages/Login'; 
import Post from './Pages/Post';
import User from './Pages/User';
import Friends from './Pages/Friends';
import Browse from './Pages/Browse';
import Map from './Pages/Map';
import ForgotPassword from './Pages/ForgotPassword';
import CreateAccount from './Pages/CreateAccount';
import Settings from "./Pages/Settings";
import LocationProfile from "./Pages/LocationProfile";
import ChangePassword from "./Pages/ChangePassword";
import Privacy from "./Pages/Privacy";
import EditProfile from "./Pages/EditProfile";
import Auth from "./Pages/Auth"; 
import CheckEmail from "./Pages/CheckEmail"; 
import UserProfilePage from "./Pages/UserProfilePage";
import Following from "./Pages/Following"; 
import Followers from "./Pages/Followers"; 
import AudioContext from "./AudioContext";
import NotFoundPage from './Pages/NotFoundPage';
import Pr from './Components/Pr';


function App() {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null); 

  return (
    <div className="App">
      <AudioContext.Provider value={{ currentAudio, playing, currentTrack, setCurrentAudio, setPlaying, setCurrentTrack}}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route path="/Post" element={
              <Pr>
                <Post />
              </Pr>
            } />
            <Route path="/UserProfile/:userId" element={
              <Pr>
                <UserProfilePage />
              </Pr>
            } />
            <Route path="/User" element={
              <Pr>
                <User/>
              </Pr>
            } />
            <Route path="/Email" element={
              <Pr>
                <CheckEmail/>
              </Pr>
            } />
            <Route path="/Friends" element={
              <Pr>
                <Friends/>
              </Pr>
            } />
            <Route path="/Following" element={
              <Pr>
                <Following/>
              </Pr>
            } />
            <Route path="/Followers" element={
              <Pr>
                <Followers/>
              </Pr>
            } />
            <Route exact path="/Browse" element={<Browse />}></Route>
            <Route path="/Map" element={
              <Pr>
                <Map/>
              </Pr>
            } />
            <Route exact path="/CreateAccount" element={<CreateAccount />}></Route>
            <Route exact path="/ForgotPassword" element={<ForgotPassword />}></Route>
            <Route path="/Settings" element={
              <Pr>
                <Settings/>
              </Pr>
            } />
            <Route path="/ChangePassword" element={
              <Pr>
                <ChangePassword/>
              </Pr>
            } />
            <Route path="/Privacy" element={
              <Pr>
                <Privacy/>
              </Pr>
            } />
            <Route path="/LocationProfile/:locationID" element={
              <Pr>
                <LocationProfile/>
              </Pr>
            } />
            <Route path="/EditProfile" element={
              <Pr>
                <EditProfile/>
              </Pr>
            } />
            <Route path="/Auth" element={
              <Pr>
                <Auth/>
              </Pr>
            } />
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </div>
      </BrowserRouter>
      </AudioContext.Provider>
    </div>
  );
}

export default App;
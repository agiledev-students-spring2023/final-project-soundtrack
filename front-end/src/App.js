import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import Login from './Pages/Login';
import Post from './Pages/Post';
import Camera from './Pages/Camera';
import User from './Pages/User';
import Friends from './Pages/Friends';
import Browse from './Pages/Browse';
import Map from './Pages/Map';
import Favorites from './Pages/Favorites';
import Filter from './Pages/Filter';
import Location from './Pages/Location';
import ForgotPassword from './Pages/ForgotPassword';
import CreateAccount from './Pages/CreateAccount';
import Settings from './Pages/Settings';
import LocationProfile from './Pages/LocationProfile';
import ChangePassword from './Pages/ChangePassword';
import Privacy from './Pages/Privacy';
import EditProfile from './Pages/EditProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/Post" element={<Post />} />
            <Route exact path="/Camera" element={<Camera />} />
            <Route exact path="/Location" element={<Location />} />
            <Route exact path="/User" element={<User />} />
            <Route exact path="/Friends" element={<Friends />} />
            <Route exact path="/Browse" element={<Browse />} />
            <Route exact path="/Map" element={<Map />} />
            <Route exact path="/Favorites" element={<Favorites />} />
            <Route exact path="/Filter" element={<Filter />} />
            <Route exact path="/CreateAccount" element={<CreateAccount />} />
            <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
            <Route exact path="/Settings" element={<Settings />} />
            <Route exact path="/ChangePassword" element={<ChangePassword />} />
            <Route exact path="/Privacy" element={<Privacy />} />
            <Route exact path="/LocationProfile" element={<LocationProfile />} />
            <Route exact path="/EditProfile" element={<EditProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

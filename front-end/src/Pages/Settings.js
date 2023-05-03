import React from 'react';
import './Settings.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import {useEffect} from 'react'; 

function Settings() {
  const navigate = useNavigate(); 

  function handlePrivacy() {
    // code to handle privacy click
  }

  function handleAbout() {
    const url = `https://github.com/agiledev-students-spring-2023/final-project-soundtrack`;
    window.open(url);
  }

  function handleNotifications() {
    // code to handle notifications click
  }

  const handleLogout = async () => { 
    
    const baseURL = process.env.NODE_ENV === "production"
    ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
    : "http://localhost:5002";

    const token = Cookies.get('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/logout`);

      await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/reset`, config);
      Cookies.remove('jwt');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to log out. Please try again.');
    }
  }



  return (
    <div className="settings-page">
      <div className="settings-header"> 
        <div onClick={() => navigate("/user")} className="back-link">Back</div>
      </div>
      <div className="LogoText">
        <img 
          src={require('../Logos/soundTrackFullLogo.png')} 
          width="200px"
          height="200px"
          srcSet={require('../Logos/fullLogo.svg')} />
      </div>
      {/* <div> <SpotifyPlayer track = "spotify:track:2sLVs5iX0osogh4jcsAJkv"/> </div> */}
      <div className="option">
      <a href="#" onClick= {() => {navigate("/EditProfile") }} >Edit Profile</a>
      </div>
      <div className="option">
      <a href="#" onClick= {() => {navigate("/ChangePassword") }} >Change Password</a>
      </div>
      <div className="option">
        <a href="#" onClick={() => {navigate("/Privacy") }}>Privacy</a>
      </div>
      <div className="option">
        <a href="#" onClick={() => {navigate("/Auth") }}>Link Spotify</a>
      </div>
      <div className="option">
        <a href="#" onClick={handleAbout}>About</a>
      </div>
      <div className="option">
        <a href="#" onClick= {handleLogout} >Log Out</a>
      </div>
    </div>
    
  );
}

export default Settings;

import React from 'react';
import './Settings.css';
import {useNavigate} from "react-router-dom";

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
        <a href="#" onClick={handleAbout}>About</a>
      </div>
      <div className="option">
        <a href="#" onClick= {() => {navigate("/") }} >Log Out</a>
      </div>
    </div>
    
  );
}

export default Settings;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./User.css"; 
import Post from '../Components/UserPost';

const User = props => {
  
  return (
    <div className="user-container">

        <div className = "user-header"> 
        <a href="#" className="back-link">Back</a> 
        <a href="#" className="settings-link">Settings</a>
        </div>

      <div className="user-profile">
        <img src="image.jpeg" alt="Profile" />
        <h1 className="username">@username</h1>
        <a href="#" className="friends-link">Friends</a>
      </div>

      <div className="user-posts">
      <Post /> 
      <Post /> 
      <Post /> 
      <Post /> 
      </div>
    </div>
  );
};

export default User;
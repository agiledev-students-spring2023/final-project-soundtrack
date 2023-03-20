import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./User.css"; 
import Post from '../Components/UserPost';
import {useNavigate} from "react-router-dom"


const User = props => {
  const navigate = useNavigate(); 
  return (
    <div className="user-container">

        <div className = "user-header"> 
        <a href="#" className="back-link" onClick = {() => {navigate("/map") }}>Back</a> 
        <a href="#" className="settings-link" onClick = {() => {navigate("/settings") }}>Settings</a>
        </div>

      <div className="user-profile">
        <img src="image.jpeg" alt="Profile" />
        <h1 className="username">@username</h1>
        <a href="#" className="friends-link" onClick = {() => {navigate("/friends") }}>Friends</a>
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
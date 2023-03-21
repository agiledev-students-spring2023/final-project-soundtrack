import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./LocationProfile.css"; 
import Post from '../Components/UserPost';
import {useNavigate} from "react-router-dom"


const LocationProfile = props => {
    const navigate = useNavigate();
    return (
        <div className="location-container">

            <div className = "location-header"> 
            <a href="#" className="back-link" onClick = {() => {navigate("/map") }}>Back</a> 
            </div>

        <div className="location-profile">
            <img src="image.jpeg" alt="Profile" />
            <h1 className="locationname">@locationname</h1>
        </div>

        <div className="location-posts">
        <Post /> 
        <Post /> 
        <Post /> 
        <Post /> 
        </div>
        </div>
    );
};

export default LocationProfile;
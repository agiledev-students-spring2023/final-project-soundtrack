import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./LocationProfile.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"



const LocationProfile = props => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
        const result = await axios(
          "https://my.api.mockaroo.com/user.json?key=d0d8c110"
        );
        setData(result.data);
      
    }
    fetchData();
  }, []);
    return (
        <div className="location-container">

            <div className = "location-header"> 
            <a href="#" className="back-link" onClick = {() => {navigate("/map") }}>Back</a> 
            </div>

        <div className="location-profile">
            <img src="image.jpeg" alt="Profile" />
            <h1 className="locationname">@locationname</h1>
        </div>

        <div className="location-posts" >
        {data.posts &&
          data.posts.slice(0, data.posts.length).map((post, index) => (
            <UserPost key={index} data={data} post = {post}/>
          ))}
      </div>
        </div>
    );
};

export default LocationProfile;
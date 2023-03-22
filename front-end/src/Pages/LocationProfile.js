import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./LocationProfile.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"



const LocationProfile = (props) => {
    const locationName = props;
    console.log(locationName); 
    const navigate = useNavigate();
    const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
        const result = await axios(
          "https://my.api.mockaroo.com/browse.json?key=d0d8c110"
        );
        setData(result.data);
      
    }
    fetchData();
  }, []);

  for(let i=0; i<data.length; i++){
    data[i].location = "Location Name";
  }

    return (
        <div className="location-container">

            <div className = "location-header"> 
            <div onClick={() => navigate("/map")} className="back-link">Back</div>
            </div>

        <div className="location-profile">
            <img src="image.jpeg" alt="Profile" />
            <h1 className="locationname">@locationname</h1>
        </div>

        <div className="location-posts" >
        {data.map((post, index) => (<UserPost key={index} data={post} post={post}/>))}
      </div>
        </div>
    );
};

export default LocationProfile;
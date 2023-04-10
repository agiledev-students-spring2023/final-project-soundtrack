import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./LocationProfile.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"
import Playlist from '../Components/Playlist'; 

const LocationProfile = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/locationprofile`)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError('Failed to fetch data from the server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/recently-played`
      );
      const uniqueTracks = removeDuplicateTracks(data.items);
      setRecentlyPlayed(uniqueTracks);
      //console.log(recentlyPlayed[0]);
      
    };
    fetchData();
  }, []);

  const removeDuplicateTracks = (items) => {
    const trackIds = new Set();
    return items.filter((item) => {
      if (trackIds.has(item.track.id)) {
        return false;
      } else {
        trackIds.add(item.track.id);
        return true;
      }
    });
  };

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

        <div> <Playlist songs={recentlyPlayed} title = "@locationname's playlist" /></div>

        <div className="location-posts" >
        {data.map((post, index) => (<UserPost key={index} data={post} post={post} song = {recentlyPlayed[index]}/>))}
      </div>
        </div>
    );
};

export default LocationProfile;
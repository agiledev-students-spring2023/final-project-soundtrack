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

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/random-songs`
      );
      setSongs(data.tracks.items);
    };
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

        <div> <Playlist songs={songs} title = "@locationname's playlist" /></div>

        <div className="location-posts" >
        {data.map((post, index) => (<UserPost key={index} data={post} post={post} song = {songs[index]}/>))}
      </div>
        </div>
    );
};

export default LocationProfile;
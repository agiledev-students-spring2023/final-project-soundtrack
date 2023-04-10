import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./User.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"

const User = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`)
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


  return (
    <div className="user-container">
      {error && <p>{error}</p>}
        <div className = "user-header"> 
        <div onClick={() => navigate("/map")} className="back-link">Back</div>
        <div onClick={() => navigate("/settings")} className="settings-link">Settings</div>
        </div>

      <div className="user-profile">
        <img src={data.avatar} alt="Profile" />
        <h1 className="username">@{data.username}</h1>
        <div onClick={() => navigate("/friends")} className="friends-link">Friends</div>
      </div>
      <div className="user-posts" >
        {data.posts &&
          data.posts.slice(0, 5).map((post, index) => (
            <UserPost key={index} data={data} post = {post} song = {songs[index]}/>
          ))}
      </div>
      
    </div>
  );
};

export default User;
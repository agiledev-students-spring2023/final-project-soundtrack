import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./User.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie";



const User = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  



  const token = Cookies.get("jwt"); // Get the JWT token from the cookie

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token as a bearer token in the Authorization header
        },
      })
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError('Failed to fetch data from the server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  console.log(data);

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
        {data &&
          data.slice(0, data.length).map((post, index) => (
            <UserPost key={index} data={data} post = {post}/>
          ))}
      </div>
      
    </div>
  );
};

export default User;
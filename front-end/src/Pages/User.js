import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./User.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"


const User = () => {
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
    <div className="user-container">

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
          data.posts.slice(0, data.posts.length).map((post, index) => (
            <UserPost key={index} data={data} post = {post}/>
          ))}
      </div>
      
    </div>
  );
};

export default User;
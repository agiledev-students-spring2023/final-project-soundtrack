import "./UserPost.css"; 
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPost = ({data, post}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handlePlay = () => {
    const query = post.song;
    const url = `https://www.google.com/search?q=${query}`;
    window.open(url);
  };

  const handleLocationClick = () => {
    console.log(post.locationName);
    axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/LocationProfile/savedLocation`, { locationName: post.locationName })
    .then((result) => {
      })
      .catch((err) => {
    // Handle any errors that occur
      });
      navigate(`/locationprofile`);

  };
  
  return (
    <div className="post">
    <div className="post-header">
        <img src={data.avatar} alt="avatar" className="avatar" />
        <h3>@{post.userName}</h3>
      </div>
      <div className="location" onClick={() => handleLocationClick(post.locationName)}> {post.locationName} </div>
      <img src={post.imageURL} alt="post" className="post-image" />
      <div className="song">
        <button id="play-button" onClick={handlePlay}>Play</button>
        <div>{post.songTitle}</div>
      </div>
      <div className="post-footer">
        <button id="like-button" onClick={handleLike}>Like</button>
        <span>{likes} likes</span>
      </div>
  </div>
  );
};

export default UserPost; 
import "./UserPost.css"; 
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
  return (
    <div className="post">
    <div className="post-header">
        <img src={data.avatar} alt="avatar" className="avatar" />
        <h3>@{data.username}</h3>
      </div>
      <div className="location" onClick={() => {navigate("/map"); }}> {post.location} </div>
      <img src={post.image} alt="post" className="post-image" />
      <div className="song">
        <button id="play-button" onClick={handlePlay}>Play</button>
        <div>{post.song}</div>
      </div>
      <div className="post-footer">
        <button id="like-button" onClick={handleLike}>Like</button>
        <span>{likes} likes</span>
      </div>
  </div>
  );
};

export default UserPost; 
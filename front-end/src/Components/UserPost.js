import "./UserPost.css"; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SongPreview from '../Components/SongPreview';

const UserPost = ({data, post, song}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  return (
    <div className="post">
    <div className="post-header">
        <img src={data.avatar} alt="avatar" className="avatar" />
        <h3>@{data.username}</h3>
      </div>
      <div className="location" onClick={() => {navigate("/LocationProfile"); }}> {post.location} </div>
      <img src={post.image} alt="post" className="post-image" />
      <div className="song">
      <SongPreview track={song}/>
      </div>
      <div className="post-footer">
        <button id="like-button" onClick={handleLike}>Like</button>
        <span>{likes} likes</span>
      </div>
  </div>
  );
};

export default UserPost; 
import "./UserPost.css"; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import SongPreview from '../Components/SongPreview';
import Meatball from './Meatball';

const UserPost = ({post}) => {
  const currentPage = window.location.pathname;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      setLiked(true);
      setLikes((prevLikes) => prevLikes + 1);
    }
  };

  return (
    <div className="post">
    <div className="post-header">
        <img src={post.avatar} alt="avatar" className="avatar" />
        <h3>@{post.userName}</h3>
        <div className = "meatball">{currentPage === '/user' && <Meatball/>}</div>
      </div>
      <div className="location" onClick={() => {navigate("/LocationProfile"); }}> {post.locationName} </div>
      <img src={post.imageURL} alt="post" className="post-image" />
      <div className="song">
      {post && <SongPreview track={post.songTitle}/> }
      </div>
      <div className="post-footer">
      <button id="like-button" onClick={handleLike}>
          {liked ? (
            <FontAwesomeIcon icon={faHeart} color="red" />
          ) : (
            <FontAwesomeIcon icon={faHeart} />
          )}
        </button>
        <span>{likes} likes</span>
      </div>
  </div>
  );
};

export default UserPost; 
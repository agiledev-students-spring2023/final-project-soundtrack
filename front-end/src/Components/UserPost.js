import "./UserPost.css"; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import SongPreview from '../Components/SongPreview';
import Meatball from './Meatball';
import axios from "axios";


const UserPost = ({post, onDelete, onPrivacyChange}) => {
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

  const handleLocationClick = () => {
    console.log(post.locationName);
    axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/LocationProfile/savedLocation`, { locationName: post.locationName })
    .then((result) => {
      console.log(result.data);
      })
      .catch((err) => {
        console.log(err);      });
        navigate(`/locationprofile`);
  };

  const handlePrivacyChange = (postId, privacy) => {
    onPrivacyChange(postId, privacy);
  };

  return (
    <div className="post">
    <div className="post-header">
        <img src={post.avatar} alt="avatar" className="avatar" />
        <h3>@{post.userName}</h3>
        <div className = "meatball">{currentPage === '/user' && <Meatball post = {post} postId={post._id} onDelete={onDelete} onPrivacyChange={handlePrivacyChange}/>}</div>
      </div>
      <div className="location" onClick={() => handleLocationClick(post.locationName)}> {post.locationName} </div>
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
        <span className="privacy-status">{post.privacy} </span>
      </div>
  </div>
  );
};

export default UserPost; 
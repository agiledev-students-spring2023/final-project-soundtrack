import "./UserPost.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SongPreview from "../Components/SongPreview";
import Meatball from "./Meatball";
import axios from "axios";
import Cookies from "js-cookie";
import { faHeart, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const UserPost = ({ post, onDelete, onPrivacyChange, isCurrentUser}) => {
  const currentPage = window.location.pathname;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [meatballOpen, setMeatballOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      // Get the JWT token from the cookie
      axios
        .get(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/post/getLike/${post._id}`,
          {
            headers: {
              Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
            },
          }
        )
        .then((result) => {
          //console.log(result.data);
          setLikes(result.data.likesNumber);
          setLiked(result.data.liked);
        })
        .catch((err) => {
          console.log(err);
        });
      //without token can only view likes number, can't like or unlike
    } 
  }, []);


  async function handleLike() {
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    if (liked) {
      // Remove user from likedBy array
      //console.log("local token is" + token);
      await axios
        .patch(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/post/unlike/${post._id}`,
          {},
          {
            headers: {
              Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
            },
          }
        )
        .then((result) => {
          //console.log("Successfully removed like");
          setLikes((prevLikes) => prevLikes - 1);
          setLiked(false);
        })
        .catch((err) => console.error(err));
    } else {
      //Add user to likedBy array
      await axios
        .patch(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/post/like/${post._id}`,
          {},
          {
            headers: {
              Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
            },
          }
        )
        .then((result) => {
          //console.log("Successfully added like");
          setLikes((prevLikes) => prevLikes + 1);
          setLiked(true);
        })
        .catch((err) => console.error(err));
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (meatballOpen && !event.target.closest(".meatball")) {
        setMeatballOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [meatballOpen]);
  


  const handleLocationClick = (locationId) => {
    let locationID = locationId
    //console.log(locationID);
    navigate(`/LocationProfile/${locationID}`);
  };
  
const handleUserName = () => {
  let userID = post.userId;
  //console.log(userID);
  navigate(`/UserProfile/${userID}`);
};



  const handlePrivacyChange = (postId, privacy) => {
    onPrivacyChange(postId, privacy);
  };

  return (
    <div className="post">
      <div className="post-header">
        <img onClick={() => handleUserName(post.userName)}
          src={post.avatar}
          alt="avatar"
          className="avatar"
        />

        <h3  onClick={() => handleUserName(post.userName)}>@{post.userName}</h3>
        <div className="meatball" onClick={() => setMeatballOpen(true)}>
  {(isCurrentUser) && (
    <Meatball
    post={post}
    postId={post._id}
    onDelete={onDelete}
    onPrivacyChange={handlePrivacyChange}
    isOpen={meatballOpen}
  />  
  )}


</div>

      </div>
      <div
        className="location"
        onClick={() => handleLocationClick(post.locationName.placeId)}
      >
        <div className= "place_name"> {post.locationName.name}</div>
        <div className= "place_address"></div>{post.locationName.formatted_address}
      </div>
      
      <div className="post-image-wrapper">
      <img src={post.imageURL} alt="post" className="post-image" />
    </div>
      <div className="song">
        {post && <SongPreview track={post.songTitle} />}
      </div>
      <div className="post-footer">
        <span className="like-button" onClick={handleLike}>
          {liked ? (
            <FontAwesomeIcon icon={faHeart} color="red" />
          ) : (
            <FontAwesomeIcon icon={faHeart} />
          )}
        </span>
        <span>{likes} likes</span>
        <span className="privacy-status">
          <FontAwesomeIcon icon={post.privacy === "Public" ? faEye : faEyeSlash} />
          </span>
      </div>
    </div>
  );
};

export default UserPost;

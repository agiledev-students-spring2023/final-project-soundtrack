import "./UserPost.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import SongPreview from "../Components/SongPreview";
import Meatball from "./Meatball";
import axios from "axios";
import Cookies from "js-cookie";
import SpotifyPlayer from "../Components/SpotifyPlayer";

const UserPost = ({ post, onDelete, onPrivacyChange }) => {
  const currentPage = window.location.pathname;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

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
          console.log(result.data);
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
      console.log("local token is" + token);
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
          console.log("Successfully removed like");
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
          console.log("Successfully added like");
          setLikes((prevLikes) => prevLikes + 1);
          setLiked(true);
        })
        .catch((err) => console.error(err));
    }
  }

  const handleLocationClick = () => {
    console.log(post.locationName);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/LocationProfile/savedLocation`,
        { locationName: post.locationName }
      )
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    navigate(`/locationprofile`);
  };

  const handlePrivacyChange = (postId, privacy) => {
    onPrivacyChange(postId, privacy);
  };

  return (
    <div className="post">
      <div className="post-header">
        <img
          src={
            post.avatar.startsWith("http") || post.avatar.startsWith("https")
              ? post.avatar
              : `${process.env.REACT_APP_SERVER_HOSTNAME}/${post.avatar}`
          }
          alt="avatar"
          className="avatar"
        />

        <h3>@{post.userName}</h3>
        <div className="meatball">
          {currentPage === "/user" && (
            <Meatball
              post={post}
              postId={post._id}
              onDelete={onDelete}
              onPrivacyChange={handlePrivacyChange}
            />
          )}
        </div>
      </div>
      <div
        className="location"
        onClick={() => handleLocationClick(post.locationName)}
      >
        {" "}
        {post.locationName}{" "}
      </div>
      <img src={post.imageURL} alt="post" className="post-image" />
      <div className="song">
        {post && <SongPreview track={post.songTitle} />}
      </div>
      {/* <div> { <SpotifyPlayer track = {post.songTitle.uri}/> } </div> */}
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";
import UserPost from "../Components/UserPost";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faCog } from '@fortawesome/free-solid-svg-icons';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); //user info
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = Cookies.get("jwt"); 

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setUser(result.data);
        //console.log(result.data);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch data from the server";
        setError(errorMessage);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setData(result.data);
        //console.log(result.data);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch data from the server";
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handlePostDelete = (postId) => {
    setData((prevData) => ({
      ...prevData,
      posts: prevData.posts.filter((post) => post._id !== postId),
    }));
  };

  const handlePrivacyChange = (postId, privacy) => {
    setData((prevData) => {
      const updatedPosts = prevData.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            privacy: privacy,
          };
        } else {
          return post;
        }
      });

      return {
        ...prevData,
        posts: updatedPosts,
      };
    });
  };

  let userId;
  
  if (token) {
    try {
      const decoded = jwtDecode(token); 
      userId = decoded.id; 
    } catch (e) {
      // console.log(e); 
    }
  }

  return (
    <div className="user-container">
      {error && <p>{error}</p>}
      <div className="user-header">
        <div onClick={() => navigate("/map")} className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} />   
             </div>
             <div onClick={() => navigate("/settings")} className="settings-link">
              <FontAwesomeIcon icon={faCog} /> {/* Replaced text with icon */}
            </div>
      </div>
      <div className="user-profile">
        <img src={user.avatar} alt="Profile" />
        <h1 className="username">@{user.userName}</h1>
        {/* <div onClick={() => navigate("/friends")} className="friends-link">
          Friends
        </div> */}
      </div>
      <div className = "following-wrapper">
      <div onClick={() => navigate(`/following?userId=${userId}`)} className="friends-link">
        Following
      </div>
      <div onClick={() => navigate(`/followers?userId=${userId}`)} className="friends-link">
        Followers
      </div>
        </div>
      {loading ? (
        <div className="loading-message">
        <FontAwesomeIcon icon={faSpinner} spin /> 
      </div>
      ) : (
        <div className="user-posts">
          {data.posts.length !== 0 ? (
            <div>
              {data.posts &&
                data.posts
                  .slice(0, data.posts.length)
                  .map((post, index) => (
                    <UserPost
                      key={index}
                      post={post}
                      onDelete={handlePostDelete}
                      onPrivacyChange={handlePrivacyChange}
                      isCurrentUser={data.posts.userId = userId}
                    />
                  ))}
            </div>
          ) : (
            <div className="no-data-message" onClick={() => navigate("/post")}>
              <p>You don't have any posts yet.</p>
              <button>Click to post here</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;

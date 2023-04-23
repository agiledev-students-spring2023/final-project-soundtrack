import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserPost from "../Components/UserPost";


function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get the userName parameter from the URL
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(userId);
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/${userId}`)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);
  

  return (
    <div className="user-container">
      {error && <p>{error}</p>}
      <div className="user-header">
        <div onClick={() => navigate("/browse")} className="back-link">
          Back
        </div>
        <div onClick={() => navigate("/settings")} className="settings-link">
          Settings
        </div>
      </div>
      <div className="user-profile">
      <img src={data.avatar} alt="Profile"/>
        <h1 className="username">@{data.userName}</h1>
      </div>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          {data.posts.length !== 0 ? (
            <div className="user-posts">
              {data.posts &&
                data.posts
                  .slice(0, data.posts.length)
                  .map((post, index) => <UserPost key={index} post={post}/>)}
            </div>
          ) : (
            <div className="no-data-message" onClick={() => navigate("/post")}>
              <p>You don't have any posts yet.</p>
              <button>Click to post here</button>
              </div>
            
          )}
        </>
      )}
    </div>
  );
          }
 export default UserProfilePage;





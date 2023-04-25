import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserPost from "../Components/UserPost";

function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get the userName parameter from the URL
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(userId);
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/getUserInfo/${userId}`)
      .then((result) => {
        setUser(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch user data from the server");
      });
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/${userId}`)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch user posts from the server");
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
        <img src={user.avatar} alt="Profile" />
        <h1 className="username">@{user.userName}</h1>
      </div>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <div className="user-posts">
          {data.posts &&
            data.posts.map((post, index) => (
              <UserPost key={index} post={post} />
            ))}
          {!data.posts && (
            <div
              className="no-data-message"
              onClick={() => navigate("/post")}
            >
              <p>You don't have any posts yet.</p>
              <button>Click to post here</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;

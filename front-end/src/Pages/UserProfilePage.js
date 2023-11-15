import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserPost from "../Components/UserPost";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";
import "./User.css"

function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [isCheckingFollowStatus, setIsCheckingFollowStatus] = useState(true);
  const [isFollowing, setIsFollowing] = useState(null);

  const token = Cookies.get("jwt");
  const handleFollowClick = () => {
    setFollowActionLoading(true);
  
    const url = `${process.env.REACT_APP_SERVER_HOSTNAME}/user/${isFollowing ? 'unfollow' : 'follow'}/${userId}`;
    axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setIsFollowing(!isFollowing);
        setFollowActionLoading(false); 
      })
      .catch((err) => {
        console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user:`, err);
        setError(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
        setFollowActionLoading(false); 
      });
  };
  
    useEffect(() => {
      const checkFollowStatus = async () => {
        setIsCheckingFollowStatus(true);
    
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/checkFollow/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsFollowing(response.data.isFollowing);
          setIsCheckingFollowStatus(false);
        } catch (err) {
          console.error('Error checking follow status:', err);
          setError('Failed to check follow status');
          setIsCheckingFollowStatus(false); 
        }
    };    
      checkFollowStatus();
    }, [userId]);

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
        <FontAwesomeIcon icon={faArrowLeft} /> 
        </div>
      </div>
      <div className="user-profile">
        <img src={user.avatar} alt="Profile" />
        <h1 className="username">@{user.userName}</h1>
      </div>
      <div className = "following-wrapper">
      <div onClick={() => navigate(`/following?userId=${userId}`)} className="friends-link">
        Following
      </div>
      <div onClick={() => navigate(`/followers?userId=${userId}`)} className="friends-link">
        Followers
      </div>
        </div>
        <div className="user-profile-actions">
        <button onClick={handleFollowClick} disabled={isCheckingFollowStatus || followActionLoading}>
          {isCheckingFollowStatus || followActionLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
          )}
        </button>
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
                    />
                  ))}
            </div>
          ) : (
            <div className="no-data-message" >
              <p>This user hasn't made any posts yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;

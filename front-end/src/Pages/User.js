import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css';
import { useNavigate } from 'react-router-dom';
import UserPost from '../Components/UserPost';

function User() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError('Failed to fetch data from the server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="user-container">
      {error && <p>{error}</p>}
      <div className="user-header">
        <div onClick={() => navigate('/map')} className="back-link">Back</div>
        <div onClick={() => navigate('/settings')} className="settings-link">Settings</div>
      </div>

      <div className="user-profile">
        <img src={data.avatar} alt="Profile" />
        <h1 className="username">
          @
          {data.username}
        </h1>
        <div onClick={() => navigate('/friends')} className="friends-link">Friends</div>
      </div>
      <div className="user-posts">
        {data.posts
          && data.posts.slice(0, data.posts.length).map((post, index) => (
            <UserPost key={index} data={data} post={post} />
          ))}
      </div>

    </div>
  );
}

export default User;

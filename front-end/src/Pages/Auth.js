import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';
import {useNavigate} from "react-router-dom";

const Auth = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate(); 
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth`);
      setUrl(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (window.location.href.length > 50) {
      const {data} = axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/callback`);
      console.log(data); 
    }
  }, []);
  

  return (
    <div>
      <div className="settings-header"> 
        <div onClick={() => navigate("/settings")} className="back-link">Back</div>
        </div>
      {!token && <a href={url}>Authorize with Spotify</a>}
      {token && <p> Spotify linked. </p>}
    </div>
  );
};

export default Auth;








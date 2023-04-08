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
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/callback?code=${code}`);
        console.log("received code:" + response.data);
        setToken(response.data); 
      }
    };
    fetchData();
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








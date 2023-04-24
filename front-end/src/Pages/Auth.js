import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const Auth = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate(); 
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth`);
      setUrl(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = Cookies.get('jwt');
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/callback?code=${code}`, config);
        console.log(response.data);
        setToken(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/get-access-token`);
        setToken(true);
      } catch (err) {
        setError(`Error fetching access token: ${err.message}`);
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








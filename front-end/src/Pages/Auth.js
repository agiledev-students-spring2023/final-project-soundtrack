import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Auth = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate(); 
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = Cookies.get('jwt');
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/check-access-token`, config);
        setToken(true);
      } catch (err) {
        setError(`Error fetching access token: ${err.message}`);
      } finally {
        setIsLoading(false); // Set loading to false when token check is complete
      }
    };
    fetchData();
  }, []);

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
        //console.log(response.data);
        setToken(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = Cookies.get('jwt');
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/check-access-token`, config);
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
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : token ? (
        <p>Spotify linked.</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <a href={url}>Authorize with Spotify</a> 
      )}
    </div>
  );
};

export default Auth;








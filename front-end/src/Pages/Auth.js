import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';
import {useNavigate} from "react-router-dom";

const Auth = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth`);
      setUrl(data);
    };
    fetchData();
  }, []);


  return (
    <div>
      <div className="settings-header"> 
        <div onClick={() => navigate("/settings")} className="back-link">Back</div>
        </div>
      <a href={url}>Authorize with Spotify</a>
    </div>
  );
};

export default Auth;








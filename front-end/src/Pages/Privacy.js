import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Privacy.css';

const Privacy = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const token = Cookies.get('jwt');
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/return/privacy`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setIsPrivate(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchPrivacy();
  }, []);

  async function handleChange(e) {
    e.preventDefault();

    const token = Cookies.get('jwt');
    const newPrivacy = !isPrivate;

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/user/privacy`,
        { privacy: newPrivacy },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setIsPrivate(newPrivacy);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="page">
      <div className="settings-header">
        <div onClick={() => navigate('/settings')} className="back-link">
          Back
        </div>
      </div>
      <div>Account Privacy</div>
      <div className="switch-container">
        <label className="switch">
          <input className="switch-input" type="checkbox" checked={isPrivate} onChange={handleChange} />
          <span className="slider round"></span>
        </label>
        <div className="toggle-label">
          {isPrivate ? 'Make account public' : 'Make account private'}
        </div>
      </div>
    </div>
  );
};

export default Privacy;






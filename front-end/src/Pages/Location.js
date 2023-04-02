import React, { useState, useEffect, useRef } from 'react';
import './Location.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchLocations from '../Components/SearchLocations';
import NearbyLocations from '../Components/NearbyLocation';

function Location() {
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [privacy, setPrivacy] = React.useState('Privacy');
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null); // added state to store selected location
  const [valueFromChild, setValueFromChild] = useState('true');

  useEffect(() => {
    if (valueFromChild === 'false') {
      setShowPopup(false);
    }
  }, [valueFromChild]);

  function handleValueFromChild(value) {
    setValueFromChild(value);
  }

  function handleClick() {
    setShowPopup(true);
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  const handlePrivacy = (value) => {
    setPrivacy(value);
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://my.api.mockaroo.com/user_post.json?key=5aa92030',
      );
      setData(result.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLocationData() {
      const result = await axios(
        'https://my.api.mockaroo.com/location.json?key=0b0aecc0',
      );
      setLocationData(result.data);
    }

    fetchLocationData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef]);

  return (
    <div className="container">
      <div className="Title">
        <button className="ReturnButton" onClick={() => navigate('/Map')}>
          map
        </button>
        <h1>Finish Posting</h1>
      </div>
      <div>
        <img src={data.imageTaken} alt="no Image" />
      </div>

      <div className="choose">
        <div className="songNameContainer">
          <div className="songName">
            chooseSong:
            {data.songName}
          </div>
        </div>

        <div className="SearchLocation" onClick={handleClick}>
          Location
          {showPopup && (
            <div className="popup" ref={popupRef}>
              <div className="popup-inner">
                <NearbyLocations onValueFromChild={handleValueFromChild} />
              </div>
            </div>
          )}
        </div>

        <div className="dropdown">
          <div className="dropdownTitle" onClick={handleOpen}>
            {privacy}
          </div>
          {open ? (
            <ul className="privacy">
              <li className="privacy-item">
                <button onClick={() => handlePrivacy('Private')}>
                  Private
                </button>
              </li>
              <li className="privacy-item">
                <button onClick={() => handlePrivacy('Public')}>
                  Public
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      <button
        onClick={() => {
          navigate('/map');
        }}
        className="next-btn"
      >
        Post
      </button>
    </div>
  );
}

export default Location;

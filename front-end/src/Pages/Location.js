import React, { useState, useEffect, useRef } from 'react';
import './Location.css';
import axios from "axios";
import SearchLocations from '../Components/SearchLocations';
import {useNavigate} from "react-router-dom"





const Location = () => {
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [privacy, setPrivacy] = React.useState('Privacy');
  const navigate = useNavigate(); 

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
        "https://my.api.mockaroo.com/user_post.json?key=5aa92030"
      );
      setData(result.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLocationData() {
      const result = await axios(
        "https://my.api.mockaroo.com/search_locations.json?key=76409ff0"
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
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  return (
    <div className='container'>
      <div className='Title'>
        <button className="ReturnButton" onClick={() => navigate("/Map")}>
        map
        </button>
        <h1>Finish Posting</h1>
      </div>
      <div>
        {<img src={data.imageTaken} alt='no Image' />}
      </div>

      <div className="choose">
        <div className = "songNameContainer">
         <div className="songName">
          chooseSong:{data.songName}
         </div>
        </div>

        <div className='SearchLocation' onClick={() => setShowPopup(true)}>
          Location
          {showPopup && (
            <div className="popup" ref={popupRef}>
              <div className="popup-inner">
                <SearchLocations placeholder="Search Locations" data={locationData} />
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
      <button onClick = {() => {
            navigate("/map")
            }}className='next-btn'> Post</button>
    </div>
  );
};

export default Location;

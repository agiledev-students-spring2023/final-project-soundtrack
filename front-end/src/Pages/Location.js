import React, { useState, useEffect, useRef } from 'react';
import './Location.css';
import axios from "axios";
import SearchLocations from '../Components/SearchLocations';

const Location = () => {
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        "https://my.api.mockaroo.com/user_post.json?key=6f6ae4c0"
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
        <h1>Finish Posting</h1>
      </div>
      <div>
        {<img src={data.imageTaken} alt='no Image' />}
      </div>

      <div className="choose">
        <div className="songName">
          chooseSong:{data.songName}
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
        <div className='Privacy'>
          Privacy
        </div>
      </div>

      <button>Finished Posting</button>
    </div>
  );
};

export default Location;

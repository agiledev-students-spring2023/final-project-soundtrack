import React, { useState, useEffect, useRef } from 'react';
import './Confirmation.css';
import axios from "axios";
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie";


const Confirmation = ({songTitle, imageURL,locationName}) => {
  const [open, setOpen] = useState(false);
  const [privacy, setPrivacy] = useState('Public');
  const navigate = useNavigate(); 

  const handleSendPost = () => {
    const postItem = { songTitle, imageURL, locationName, privacy };
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    axios
      .post(`http://localhost:5002/Post/savePost`, { postItem }, {
        headers: {
          Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  
    navigate("/map");
  };
  
  const handleOpen = () => {
    setOpen(!open);
  };

  const handlePrivacy = (value) => {
    setPrivacy(value);
    setOpen(false);
  };


  return (
    <div className='container'>
      <div className='imageContainer'>
      {<img src={imageURL} alt='no Image'/>}
      </div>

      <div className="choose">
        <div className = "songNameContainer">
          <div className="songName">
            chooseSong:{songTitle.track.name}
          </div>
        </div>

        <div className='SearchLocation'>
          Location: {locationName}  
        </div>

        <div className="dropdown">
          <div className="dropdownTitle" onClick={handleOpen}>
            {privacy}
          </div>
          {open ? (
            <ul className="privacy">
              <li className="privacy-item">
                <button onClick={() => handlePrivacy("Private")}>Private</button>
              </li>
              <li className="privacy-item">
                <button onClick={() => handlePrivacy("Public")}>Public</button>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      <button onClick={handleSendPost} className='next-btn'>
        Post
      </button>
    </div>
  );
};

export default Confirmation;
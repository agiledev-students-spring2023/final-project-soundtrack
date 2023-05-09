import React, { useState, useRef, useEffect } from 'react';
import './Meatball.css';
import axios from "axios"; 
import Cookies from "js-cookie";

function Meatball({post, postId, onDelete, onPrivacyChange}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = Cookies.get("jwt"); 
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);

    try {
      const response = await axios.delete(`${process.env.REACT_APP_SERVER_HOSTNAME}/post/deletePost/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.data;
      //console.log(data);
      onDelete(postId);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrivacyClick = async () => {
    setIsMenuOpen(false);
  
    const privacy = post.privacy === "Public" ? "Private" : "Public";
  
    try {
      const response = await axios.patch(`${process.env.REACT_APP_SERVER_HOSTNAME}/post/updatePrivacy/${postId}`, {
        privacy
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.data;
      //console.log(data);
      onPrivacyChange(postId, privacy);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="meatball-menu" ref={menuRef}>
      <button className="meatball-menu__btn" onClick={toggleMenu}> • • • </button>
      {isMenuOpen && (
        <ul className="meatball-menu__options">
          <li>
          <a onClick={handlePrivacyClick}>
              {post.privacy === "Public" ? "Make private" : "Make public"}
            </a>
          </li>
          <li>
            <a onClick={handleDeleteClick}>Delete</a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Meatball;

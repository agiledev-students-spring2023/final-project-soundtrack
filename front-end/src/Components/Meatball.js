import React, { useState } from 'react';
import './Meatball.css';

function Meatball(onDelete) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false); 
  };

  const handleShareClick = () => {
    setIsMenuOpen(false); 
  };

  return (
    <div className="meatball-menu">
      <button className="meatball-menu__btn" onClick={toggleMenu}> • • • </button>
      {isMenuOpen && (
        <ul className="meatball-menu__options">
          <li>
            <a onClick={handleDeleteClick}>Delete</a>
          </li>
          <li>
          <a onClick={handleShareClick}>Share</a>
          </li>
          <li>
          <a onClick={handleShareClick}>Make private</a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Meatball;

// Add an icon indicating that the post is private / public 
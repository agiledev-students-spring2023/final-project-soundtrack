import "./FavoriteLocation.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const FavoriteLocation = ({ favoritedLocation }) => {
  const navigate = useNavigate();

  // Check if favoritedLocation exists before proceeding
  if (!favoritedLocation) {
    return null; // or return a loading spinner, or some placeholder text, etc.
  }

  const handleLocationClick = (locationId) => {
    let locationID = locationId;
    navigate(`/LocationProfile/${locationID}`);
  };

  console.log("placeId", favoritedLocation?.placeId);

  return (
    <div
      className="location"
      style={{ backgroundColor: '#f4f4f4', 
      margin: '10px',
      padding: '20px', 
      borderRadius:'5px'}} 
      onClick={() => handleLocationClick(favoritedLocation?.placeId)}
    >
      <div className="place_name"> {favoritedLocation?.name}</div>
      <div className="place_address">{favoritedLocation?.formatted_address}</div>
    </div>
  );
};

// Set default props
FavoriteLocation.defaultProps = {
  favoritedLocation: {},
};

export default FavoriteLocation;

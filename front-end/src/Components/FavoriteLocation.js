import "./FavoriteLocation.css";
import React from "react";
import { useNavigate } from "react-router-dom";


const FavoriteLocation = ({ favoritedLocation }) => {
    const navigate = useNavigate();

    const handleLocationClick = (locationId) => {
        let locationID = locationId;
        console.log(locationID);
        navigate(`/LocationProfile/${locationID}`);
    };

    console.log("placeId", favoritedLocation.placeId);

    return (
        <div
            className="location"
            onClick={() => handleLocationClick(favoritedLocation.placeId)}
        >
            <div className= "place_name"> {favoritedLocation.name}</div>
            <div className= "place_address"></div>{favoritedLocation.formatted_address}
        </div>
    );
};

export default FavoriteLocation;
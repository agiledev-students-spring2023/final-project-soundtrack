import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LocationProfile.css";
import UserPost from "../Components/UserPost";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Playlist from "../Components/Playlist";
import { useLoadScript } from "@react-google-maps/api";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const LocationProfile = () => {
  const navigate = useNavigate();
  const { locationID } = useParams(); // Get the userName parameter from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [locationProfile, setLocationProfile] = useState({});
  const libraries = ["places"];
  const [service, setService] = useState(null); // create a state variable for PlacesService
  const [favorited, setFavorited] = useState(false);


  // useLoadScript hook to load the Google Maps JavaScript API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries,
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    if (isLoaded) {
      setService(
        new window.google.maps.places.PlacesService(
          document.createElement("div")
        )
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && service) {
      const request = {
        placeId: locationID,
        fields: ["name", "formatted_address", "photos"],
      };
      service.getDetails(request, (place, status) => {
        if (status === "OK" && place) {
          const profile = {
            name: place.name,
            formatted_address: place.formatted_address,
            placeId: locationID,
          };
          if (place.photos && place.photos.length) {
            profile.photo = place.photos[0].getUrl();
          } else {
            profile.photo =
              "https://www.freeiconspng.com/uploads/no-image-icon-4.png";
          }
          setLocationProfile(profile);
        }
      });
    }
  }, [isLoaded, locationID, service]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/locationprofile/${locationID}`
      )
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [locationID]);

  //console.log(data); // should now print the location name fetched from the backend

  useEffect(() => {
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/favorite`, {
        headers: {
          Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
        },
      })
      .then((result) => {
        console.log(result.data);
        if(result.data){  
        for (let i = 0; i < result.data.length; i++) {  
          if (result.data[i].favoritedLocation.placeId === locationID) 
            setFavorited(true);
          }
        }
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      });
  }, []); // Only run this effect once when the component mounts
  
  useEffect(() => {
    console.log("favorited: ", favorited);
  }, [favorited]); // Log the updated value of `favorited`
  

  const songs = [];
  if (data.posts && data.posts.length) {
    for (let i = 0; i < data.posts.length; i++) {
      songs.push(data.posts[i].songTitle);
    }
  }
  //console.log(songs);


  const handleFavoriteLocation = () => {
    const favoritedLocation = locationProfile;
    console.log("favoritedLocation: ", favoritedLocation);
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";

    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/Favorite/saveFavorite`,
        { favoritedLocation },
        {
          headers: {
            Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        //console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnfavoritedLocation = () => {
    const favoritedLocation = locationProfile;
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";

    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/Favorite/removeFavorite`,
        { favoritedLocation },
        {
          headers: {
            Authorization: `JWT ${token}`, 
          },
        }
      )
      .then((res) => {
        //console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function handleChange() {
    // Toggle the favorite state first
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);
  
    if (newFavoritedState) {
      await handleFavoriteLocation();
    } else {
      await handleUnfavoritedLocation();
    }
  }

  return (
    <div className="location-container">
      <div className="location-header">
        <div onClick={() => navigate("/map")} className="back-link" aria-label="Go back to map">
          Back
        </div>
        
        <div className="bookmark-container" onClick={handleChange} aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}>
          <FontAwesomeIcon icon={favorited ? solidBookmark : regularBookmark} size="2x" />
        </div>
      </div>
  
      {locationProfile ? (
        <div className="location-profile">
          <img src={locationProfile.photo} alt="Location profile" />
          <h1 className="locationName">{locationProfile.name}</h1>
          <h2 className="locationAddress">
            {locationProfile.formatted_address}
          </h2>
        </div>
      ) : (
        <div>Loading...</div>
      )}
  
      <div className="playList">
        {songs && (
          <Playlist songs={songs} title="Enjoy the location playlist!" />
        )}
      </div>
  
      <div className="location-posts">
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <>
            {data.posts && data.posts.length > 0 ? (
              data.posts.map((post, index) => (
                <UserPost key={index} post={post} />
              ))
            ) : (
              <div
                className="no-data-message"
                onClick={() => navigate("/post")}
              >
                No one has posted a song at this location. Click to post your
                song here.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )};
  
  

export default LocationProfile;

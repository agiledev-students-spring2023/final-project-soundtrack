import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationProfile.css";
import UserPost from "../Components/UserPost";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Playlist from "../Components/Playlist";
import { useLoadScript } from "@react-google-maps/api";
import Cookies from "js-cookie";

const LocationProfile = () => {
  const navigate = useNavigate();
  const { locationID } = useParams(); // Get the userName parameter from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [locationProfile, setLocationProfile] = useState({});
  const libraries = ["places"];
  const [service, setService] = useState(null); // create a state variable for PlacesService

  // useLoadScript hook to load the Google Maps JavaScript API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB1D7Olh84_bINSSNaJ5N9nsU6bq933y0U",
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

  console.log(data); // should now print the location name fetched from the backend

  const songs = [];
  if (data.posts && data.posts.length) {
    for (let i = 0; i < data.posts.length; i++) {
      songs.push(data.posts[i].songTitle);
    }
  }
  console.log(songs);

  const handleFavoriteLocation = () => {
    const locationName = locationProfile.name;
    const token = Cookies.get("jwt"); // Get the JWT token from the cookie
    axios
      .post(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/Favorite/saveFavorite`,
        { locationName },
        {
          headers: {
            Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="location-container">
      <div className="location-header">
        <div onClick={() => navigate("/map")} className="back-link">
          Back
        </div>
        <div
          onClick={handleFavoriteLocation}
          className="favorite-button"
        >
          Favorite
        </div>
      </div>

      {locationProfile ? (
        <div className="location-profile">
          <img src={locationProfile.photo} alt="Profile" />
          <h1 className="locationName">@{locationProfile.name}</h1>
          <h2 className="locationAddress">
            {locationProfile.formatted_address}
          </h2>
        </div>
      ) : (
        <div>loading...</div>
      )}

      <div className="playList">
        {" "}
        {songs && (
          <Playlist songs={songs} title="Enjoy the location playlist!" />
        )}
      </div>


      <div className="location-posts">
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <>
            {data.posts.length !== 0 ? (
              <div className="location-posts">
                {data.posts.map((post, index) => (
                  <UserPost key={index} post={post} />
                ))}
              </div>
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
  );
};

export default LocationProfile;

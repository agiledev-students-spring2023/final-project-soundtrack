import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationProfile.css";
import UserPost from "../Components/UserPost";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Playlist from "../Components/Playlist";

const LocationProfile = () => {
  const navigate = useNavigate();
  const { locationID } = useParams(); // Get the userName parameter from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({});

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

  return (
    <div className="location-container">
      <div className="location-header">
        <div onClick={() => navigate("/map")} className="back-link">
          Back
        </div>
        <div onClick = {() => {console.log("Location Favorited")}} className="favorite-button">
          Favorite
        </div>
      </div>

      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="location-profile">
          <img src={data.posts[0].locationName.name} alt="Profile" />
          <h1 className="locationName">@{data.posts[0].locationName.name}</h1>
          <h2 className="locationAddress">
            {data.posts[0].locationName.formatted_address}
          </h2>
        </div>
      )}

      <div>
        {" "}
        {songs && <Playlist songs={songs} title="Enjoy the location playlist!" />}
      </div>

      <div className="location-posts">
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <>
            {data.posts ? (
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

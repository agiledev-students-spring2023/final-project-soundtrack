import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationProfile.css";
import UserPost from "../Components/UserPost";
import { useNavigate } from "react-router-dom";
import Playlist from "../Components/Playlist";

const LocationProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/locationprofile`)
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
      </div>

      <div className="location-profile">
        <img src="image.jpeg" alt="Profile" />
        <h1 className="locationname">@{data.locationName}</h1>
      </div>

      <div>
        {" "}
        {songs && <Playlist songs={songs} title="@locationname's playlist" />}
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
                No one has posted a song at this location. Click to post your song here.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationProfile;

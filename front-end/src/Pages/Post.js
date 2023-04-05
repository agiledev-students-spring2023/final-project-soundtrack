import "./Post.css";
import ChooseSong from "../Components/ChooseSong";
import Camera from "../Components/Camera";
import Confirmation from "../Components/Confirmation";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NearbyLocation from "../Components/NearbyLocation";


const Post = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [activeComponent, setActiveComponent] = useState("ChooseSong");
  const [selectedSongTitle, setSelectedSongTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [locationName, setLocationName] = useState("");



  useEffect(() => {
    async function fetchData() {
      console.log("Fetching data from Api");
      const result = await axios(
        "https://my.api.mockaroo.com/choose_song.json?key=0b0aecc0"
      );
      setData(result.data);
    }

    fetchData();
  }, []);

  const handleChooseSongNext = (songTitle) => {
    setSelectedSongTitle(songTitle);
    setActiveComponent("Camera");
  };

  const handleCameraBack = () => {
    setActiveComponent("ChooseSong");
  };

  const handleCameraNext = (imageSrc) => {
    setImageURL(imageSrc);
    setActiveComponent("Location");
  };

  const handleLocationBack = () => {
    setActiveComponent("Camera");
  };
  

  const handleLocationNext = (locationName) => {
    setLocationName(locationName);
    setActiveComponent("Confirmation");
  };


  const handleError = (error) => {
    console.error(error);
  };


  return (
    <header>
      <div className="Title">
        <button className="ReturnButton" onClick={() => navigate("/Map")}>
          Back
        </button>
        <h1>Create Your Post</h1>
      </div>

      <div>
        {activeComponent === "ChooseSong" && (
          <ChooseSong
            placeholder={"Search Song"}
            data={data}
            onNext={handleChooseSongNext}
          />
        )}
        {activeComponent === "Camera" && (
        <Camera onBack={handleCameraBack} onNext={handleCameraNext} />
        )}

        {activeComponent === "Location" && (
        <NearbyLocation onBack={handleLocationBack} onNext={handleLocationNext} />
        )}


        {activeComponent === "Confirmation" && (
          <Confirmation
            onBack={handleLocationBack}
            onNext={handleLocationNext}
            imageURL = {imageURL}
            songTitle = {selectedSongTitle}
            locationName={locationName}
            onError={handleError}
          />
        )}
      </div>
    </header>
  );
};

export default Post;

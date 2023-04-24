import "./ChooseSong.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SongPreview from "../Components/SongPreview";
import {useNavigate} from "react-router-dom"


function ChooseSong({ placeholder, data, onNext }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/recently-played`
        );
        const uniqueTracks = removeDuplicateTracks(data.items);
        setRecentlyPlayed(uniqueTracks);
      } catch (error) {
        //console.error(error);
      }
    };
    fetchData();
  }, []);

  // client credentials flow
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/client`
      );
      //console.log(response);
      setToken(response.data);
    };
    fetchToken();
  }, []);

  const removeDuplicateTracks = (items) => {
    const trackIds = new Set();
    return items.filter((item) => {
      if (trackIds.has(item.track.id)) {
        return false;
      } else {
        trackIds.add(item.track.id);
        return true;
      }
    });
  };
  const handleFilter = async (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    if (searchWord === "") {
      setFilteredData([]);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/client/search-song?q=${searchWord}`
      );
      const searchResults = response.data;
      console.log(searchResults);
      setFilteredData(searchResults);
    } catch (error) {
      console.log(error);
    }
  };
  //display song object in console.log
  const handleSearchSong = (song) => {
    //console.log("selected track is " + song.track.name);
    setSelectedSong(song);
  };

  const handleRecentSong = (song) => {
    console.log(song.track);
    setSelectedSong(song.track);
  };

  const handleClearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleNext = () => {
    if (selectedSong) {
      onNext(selectedSong);
    }
  };

  return (
      <div className="search">
        <div className="searchInputs">
          <input
            type="text"
            placeholder={placeholder}
            value={wordEntered}
            onChange={handleFilter}
          />
          <button id="clearButton" onClick={handleClearInput}>
            X
          </button>
        </div>
    
        {filteredData.length !== 0 ? (
          <div className="dataResultBlock">
            <h2 className="title">Search Result</h2>
            <div className="dataResult">
              {filteredData.slice(0, 15).map((value, key) => (
                <div
                  key={key}
                  className="dataItem"
                  onClick={() => handleSearchSong(value)}
                >
                  {<SongPreview track={value} />}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="recentListenBlock">
            {recentlyPlayed.length !== 0 ? (
              <div>
                <h2 className="title">Recently Listened</h2>
                <div className="recentListen">
                  {recentlyPlayed.slice(0, 10).map((item, index) => (
                    <div
                      key={index}
                      className="dataItem"
                      onClick={() => handleRecentSong(item)}
                    >
                      {<SongPreview track={item.track} />}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className = "auth" onClick={() => navigate("/Auth")} >Please authenticate with Spotify first.</p>
            )}
          </div>
        )}
    
        <button className="nextButton" onClick={handleNext}>
          Next
        </button>
      </div>
    );
    
}

export default ChooseSong;

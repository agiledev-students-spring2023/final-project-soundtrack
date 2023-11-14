import "./ChooseSong.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SongPreview from "../Components/SongPreview";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function ChooseSong({ placeholder, data, onNext }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("top global");
  const [topSongs, setTopSongs] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isLoadingTopGlobal, setIsLoadingTopGlobal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("jwt");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/refresh`,
        config
      );
      //console.log("spotify access refreshed");
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingRecent(true);
      const token = Cookies.get("jwt");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/recently-played`,
          config
        );
        const uniqueTracks = removeDuplicateTracks(data.items);
        setRecentlyPlayed(uniqueTracks);
        if (uniqueTracks.length === 0) {
          setActiveTab("top global");
        }
      } catch (error) {
        console.error("Error fetching recently played:", error.response);
        setActiveTab("top global");
      }
      setIsLoadingRecent(false);
    };
    fetchData();
  }, []);

  // Fetch top global songs
  useEffect(() => {
    if (activeTab === "top global") {
      setIsLoadingTopGlobal(true);
      const fetchTopSongs = async () => {
        try {
          const playlistId = "37i9dQZEVXbMDoHDwVN2tF";
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_HOSTNAME}/client/playlist/${playlistId}`
          );
          setTopSongs(response.data);
        } catch (error) {
          console.error(
            "Error fetching top global songs:",
            error.response || error
          );
        }
        setIsLoadingTopGlobal(false);
      };

      fetchTopSongs();
    }
  }, [activeTab]);

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

  const switchTab = (tabName) => {
    setFilteredData([]);
    setWordEntered("");

    setActiveTab(tabName);
    if (
      tabName === "recent" &&
      recentlyPlayed.length === 0 &&
      !isLoadingRecent
    ) {
      // fetchData();
    } else if (
      tabName === "top global" &&
      topSongs.length === 0 &&
      !isLoadingTopGlobal
    ) {
      // fetchTopGlobalSongs();
    }
  };

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
      //console.log(searchResults);
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
    //console.log(song.track);
    setSelectedSong(song);
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
    <div className="choose-song">
      <div className="search-inputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        {/* {wordEntered && (
        <button onClick={handleClearInput} className="clear-input">
          Clear
        </button>
      )} */}
      </div>

      <div className="tab-selection">
        <button
          onClick={() => switchTab("recent")}
          className={activeTab === "recent" ? "active-tab" : ""}
        >
          Recently Played
        </button>
        <button
          onClick={() => switchTab("top global")}
          className={activeTab === "top global" ? "active-tab" : ""}
        >
          Top Global
        </button>
      </div>

      {filteredData.length !== 0 && (
        <div className="data-result-block">
          <div className="title">Search Results</div>
          <div className="data-result">
            {filteredData.slice(0, 15).map((value, key) => (
              <div
                key={key}
                className={`data-item ${
                  selectedSong && selectedSong.id === value.id
                    ? "selected-song"
                    : ""
                }`}
                onClick={() => handleSearchSong(value)}
              >
                <SongPreview track={value} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "recent" &&
        !isLoadingRecent &&
        recentlyPlayed.length === 0 && (
          <div className="no-content-message">
            No recently played songs available. Check out the Top global hits.
          </div>
        )}
      {activeTab === "recent" && recentlyPlayed.length !== 0 && (
        <div className="recent-listen-block">
          <div className="title">Recently Played</div>
          <div className="recent-listen">
            {recentlyPlayed.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className={`data-item ${
                  selectedSong && selectedSong.id === item.track.id
                    ? "selected-song"
                    : ""
                }`}
                onClick={() => handleRecentSong(item.track)}
              >
                <SongPreview track={item.track} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "top global" &&
        !isLoadingTopGlobal &&
        topSongs.length === 0 && (
          <div className="no-content-message">
            No top global tracks available. Try again later.
          </div>
        )}

      {activeTab === "top global" &&
        Array.isArray(topSongs) &&
        topSongs.length > 0 && (
          <div className="recent-listen-block">
            <div className="title">Top Global</div>
            <div className="recent-listen">
              {topSongs.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className={`data-item ${
                    selectedSong && selectedSong.id === item.track.id
                      ? "selected-song"
                      : ""
                  }`}
                  onClick={() => handleRecentSong(item.track)}
                >
                  <SongPreview track={item.track} />
                </div>
              ))}
            </div>
          </div>
        )}

      {isLoadingRecent && (
        <div className="loader">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}
      {isLoadingTopGlobal && (
        <div className="loader">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}

      <button
        className="next-button"
        onClick={handleNext}
        disabled={!selectedSong}
      >
        Next
      </button>
    </div>
  );
}

export default ChooseSong;

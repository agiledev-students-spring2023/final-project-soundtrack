import React, { useState } from "react";
import "./SearchBar.css"
import axios from 'axios';
import {useNavigate} from "react-router-dom";


function SearchBar({placeholder, data}) {
  // console.log("rendering searchbar")
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [selectedSongTitle, setSelectedSongTitle] = useState("");
  const navigate = useNavigate();

  // filter through data
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.song_title.toLowerCase().includes(searchWord.toLowerCase());
    });
    
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleSelectSong = (songTitle) => {
    setSelectedSongTitle(songTitle);
  };

  const handleSendSelectedSong = () => {
    if (selectedSongTitle) {
      axios
        .post(`http://localhost:5002/Post/savesong`, {songTitle: selectedSongTitle})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    navigate("/Camera");
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
        <button id="clearButton" onClick={clearInput}>
          X
        </button>
      </div>

      {filteredData.length !== 0 ? (
        <div className="dataResultBlock">
          <h2>Search Result</h2>
          <div className="dataResult">
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <div key={key} className="dataItem" onClick={() => handleSelectSong(value.song_title)}>
                  <img src={value.image} alt={"no image"} />
                  <div className="songDetails">
                    <p className="songTitle">{value.song_title}</p>
                    <p className="artistName">{value.artist}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (wordEntered.length === 0 && (
        <div className="recentListenBlock">
          <h2>Recently Listened</h2>
          <div className="recentListen">
            {data.slice(0, 5).map((value, key) => {
              return (
                <div key={key} className="dataItem" onClick={() => handleSelectSong(value.song_title)}>
                  <img src={value.image} alt={"no image"} crossOrigin="anonymous" />
                  <div className="songDetails">
                    <p className="songTitle">{value.song_title}</p>
                    <p className="artistName">{value.artist}</p>
                  </div>
                </div>
              )
              
            })}
          </div>
        </div>
      ))}
      
    <button className="nextButton" onClick={handleSendSelectedSong}>
      Song Choosen
    </button>
    </div>
  );
}

export default SearchBar

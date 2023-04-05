import React, { useState } from "react";
import "./ChooseSong.css";

function ChooseSong({ placeholder, data, onNext }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) =>
      value.song_title.toLowerCase().includes(searchWord.toLowerCase())
    );

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  const handleClearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleNext = () => {
    if (selectedSong) {
      onNext(selectedSong.song_title);
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
          <h2 className = "title">Search Result</h2>
          <div className="dataResult">
            {filteredData.slice(0, 15).map((value, key) => (
              <div
                key={key}
                className="dataItem"
                onClick={() => handleSelectSong(value)}
              >
                <img src={value.image} alt="No image" />
                <div className="songDetails">
                  <p className="songTitle">{value.song_title}</p>
                  <p className="artistName">{value.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : wordEntered.length === 0 ? (
        <div className="recentListenBlock">
          <h2 className = "title">Recently Listened</h2>
          <div className="recentListen">
            {data.slice(0, 5).map((value, key) => (
              <div
                key={key}
                className="dataItem"
                onClick={() => handleSelectSong(value)}
              >
                <img src={value.image} alt="No image" crossOrigin="anonymous" />
                <div className="songDetails">
                  <p className="songTitle">{value.song_title}</p>
                  <p className="artistName">{value.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="noResultBlock">
          <p>No results found</p>
        </div>
      )}

      <button className="nextButton" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default ChooseSong;

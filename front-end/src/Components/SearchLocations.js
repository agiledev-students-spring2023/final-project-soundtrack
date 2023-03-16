import React, { useState } from "react";
import "./SearchLocations.css"

function SearchLocations({placeholder, data}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  // filter through data
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
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
          <div className="dataResult">
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <div key={key} className="dataItem">
                  <img src={value.image} alt={"no image"} />
                  <div className="locationDetails">
                    <p className="name">{value.name}</p>
                    <p className="address">{value.address}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (wordEntered.length === 0 && (
        <div className="recentListenBlock">
          <div className="recentListen">
            {data.slice(0, 5).map((value, key) => {
              return (
                <div key={key} className="dataItem">
                  <img src={value.image} alt={"no image"} />
                  <div className="locationDetails">
                    <p className="name">{value.name}</p>
                    <p className="address">{value.address}</p>
                  </div>
                </div>
              )
              
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchLocations;

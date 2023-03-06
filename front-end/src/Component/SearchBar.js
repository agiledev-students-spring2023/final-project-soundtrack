import React, { useState } from "react";
import "./SearchBar.css"

function SearchBar({placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  //filter through data
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
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
  <div className = "dataResultBlock">
     <p10>
      Rearch Result
    </p10>
  <div className="dataResult">
    {filteredData.slice(0, 15).map((value, key) => {
      return <div  id = "test" className="dataItem">{value.title}</div>
    })}
  </div>
  </div>
) : (wordEntered.length === 0 && (
  <div className="recentListenBlock">
    <p10>
      Recently Listening
    </p10>
    <div className="recentListen">
      {data.slice(0, 5).map((value, key) => {
        return <div  id = "test" className="recentItem">{value.title}</div>
      })}
    </div>
  </div>
))}
    </div>
  );
}

function SearchResult({ filteredData }) {
  return (
    <div className="dataResult">
      {filteredData.slice(0, 15).map((value, key) => {
        return <div  id = "test" className="dataItem">{value.title}</div>
      })}
    </div>
  );
}

export default SearchBar;

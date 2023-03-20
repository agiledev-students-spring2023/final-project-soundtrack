import './Post.css';
import SearchBar from "../Components/SearchBar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";

const Post = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    // a nested function that fetches the data
    async function fetchData() {
      console.log("Fetching data from Api");
      // axios is a 3rd-party module for fetching data from servers
      const result = await axios(
        // retrieving some mock data about animals for sale
        "https://my.api.mockaroo.com/choose_song.json?key=6f6ae4c0"
      );
      // set the state variable
      // this will cause a re-render of this component
      setData(result.data);
    }

    // fetch the data!
    fetchData();

    // the blank array below causes this callback to be executed only once on component load
  }, []);

  return (
    <header>
      <div className="Title">
        <h1>
          Start Posting, Choose a Song
        </h1>
      </div>

      <SearchBar placeholder={"Search Song"} data={data} />

        <button className="Button" onClick = {() => {
            navigate("/Camera")
          }}>
          Next
        </button>
    </header>
  );
};

export default Post;

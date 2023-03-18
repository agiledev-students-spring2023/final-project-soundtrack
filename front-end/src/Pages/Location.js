import React, { useState, useEffect } from 'react';
import './Location.css';
import axios from "axios";
import SearchLocations from '../Components/SearchLocations';



const Location = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // a nested function that fetches the data
    async function fetchData() {
      console.log("Fetching data from Api");
      // axios is a 3rd-party module for fetching data from servers
      const result = await axios(
        // retrieving some mock data about animals for sale
        "https://my.api.mockaroo.com/user_post.json?key=6f6ae4c0"
      );
      // set the state variable to the image URL
      setData(result.data);
    }

    // fetch the data!
    fetchData();

    // the blank array below causes this callback to be executed only once on component load
  }, []);
  console.log("Rendering Location");

  return (
    <div>
      
      <div className='Title'>
        <h1>Finish Posting</h1>
      </div>
      <div>
        {<img src={data.imageTaken} alt='Uploaded Image' />}
      </div>

      <div className="choose">
        <div className="artistName">
          chooseSong:{data.songName}
        </div>
        <div className='SearchLocation'>
          Location
        </div>
        <div className='Privacy'>
          Privacy
        </div>

      </div>



      <button>Finished Posting</button>
    </div>
  );
};

export default Location;
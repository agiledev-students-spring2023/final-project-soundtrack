import './Favorites.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';

function Favorites() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // a nested function that fetches the data
    async function fetchData() {
      console.log('Fetching data from Api');
      // axios is a 3rd-party module for fetching data from servers
      const result = await axios(
        // retrieving some mock data about animals for sale
        'https://my.api.mockaroo.com/search_locations.json?key=76409ff0',
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
        My Favorites
      </div>

      {data.slice(0, 5).map((value, key) => (
        <div key={key} className="dataItem">
          <img src={value.image} alt="no image" />
          <div className="locationDetails">
            <p className="name">{value.name}</p>
            <p className="address">{value.address}</p>
          </div>
        </div>
      ))}

      <button
        className="filterByFavButton"
        onClick={() => {
          navigate('/map');
        }}
      >
        Filter by Favorites
      </button>
    </header>
  );
}

export default Favorites;

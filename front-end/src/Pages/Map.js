import './Map.css';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';
import SearchLocations from '../Components/SearchLocations';
import axios from "axios";
import React, { useState, useEffect } from "react";

function Map() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // a nested function that fetches the data
        async function fetchData() {
        console.log("Fetching data from Api");
        // axios is a 3rd-party module for fetching data from servers
        const result = await axios(
            // retrieving some mock data about animals for sale
            "https://my.api.mockaroo.com/search_locations.json?key=76409ff0"
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
            <HeaderBrowseMap/>

            <SearchLocations placeholder={"Search Location"} data={data}/>


        </header>

    );
}

export default Map;
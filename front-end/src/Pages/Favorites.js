import './Favorites.css';
import HeaderBrowseMap from '../Components/HeaderBrowseMap';
import axios from "axios";
import React, { useState, useEffect } from "react";


function Favorites() {
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

            <div className="Title">
                My Favorites
            </div>

            <div className="Button">
                <button>
                Filter by Favorites
                </button>
            </div>

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
        </header>
    );
}

export default Favorites;
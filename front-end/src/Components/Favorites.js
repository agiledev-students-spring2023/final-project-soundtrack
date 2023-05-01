import React, { useState, useEffect, useCallback } from "react";
import './Favorites.css';
import axios from "axios";


function Favorites() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/favorite`)
          .then((result) => {
            console.log(result.data);
            setData(result.data);
          })
          .catch((err) => {
            setError('Failed to fetch data from the server');
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    return (

        //     {/* <button className="filterByFavButton" onClick = {() => {
        //         navigate("/map")
        //     }}>
        //         Filter by Favorites
        //     </button> */}

        <div className="FavoritesContainer">
            <div className="Title">Favorites</div>

            <div>
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        {data.map((favorite) => (favorite.locationName))};
                    </>
                )}
            </div>
        </div>
    );
}

export default Favorites;
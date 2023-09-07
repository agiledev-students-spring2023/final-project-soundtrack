import React, { useState, useEffect } from "react";
import './Favorites.css';
import FavoriteLocation from './FavoriteLocation.js';
import axios from "axios";
import Cookies from "js-cookie";

function Favorites() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = Cookies.get("jwt"); // Get the JWT token from the cookie
        axios
            .get(
                `${process.env.REACT_APP_SERVER_HOSTNAME}/favorite`,
                {
                    headers: {
                      Authorization: `JWT ${token}`, // Include the token as a bearer token in the Authorization header
                    },
                }
            )
            .then((result) => {
                //console.log(result.data);
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
        <div className="FavoritesContainer">
            <div className="Title">Favorites</div>

            <div>
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : data.length === 0 ? (
                    <div className="no-favorites-message">You don't have any favorite locations.</div>
                ) : (
                    <div>
                        {data.map((favorite) => (
                            <FavoriteLocation key={favorite._id} favoritedLocation={favorite.favoritedLocation} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favorites;

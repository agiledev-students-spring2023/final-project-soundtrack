import React, { useState } from "react";
import axios from "axios";


import AddFriendSearchBarStyles from "./AddFriendSearchBarStyles.module.css";
import Cookies from "js-cookie";

const AddFriendSearchBar = ({setDisplayAlert}) => {

    const [query, setQuery] = useState("");
    const [error, setError] = useState();

    const baseURL = process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";
  

    const handleFriendRequestSubmit = (e) => {
        e.preventDefault();

        // if(query.length > 0 && query.charAt[0] == '@') {
        //     setQuery(query.substring(1, query.length));
        // }

        const token = Cookies.get("jwt");
        axios
            .post(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends/newfriendrequest`, {toUser: query}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data);
                setDisplayAlert([true, false]);
            })
            .catch((err) => {
                setDisplayAlert([true, true]);
            });
    }

    return(
        <form onSubmit={handleFriendRequestSubmit}> 
            <div className={AddFriendSearchBarStyles.MainBox}>
                <input
                    type="friendSearch"
                    name="friendSearchInput"
                    placeholder="Add a friend..."
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <button
                    title="Send"
                    type="friendSearchSubmit"
                />
            </div>
        </form>
    )
}

export default AddFriendSearchBar;
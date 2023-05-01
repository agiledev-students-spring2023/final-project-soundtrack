import React, { useState } from "react";
import axios from "axios";


import AddFriendSearchBarStyles from "./AddFriendSearchBarStyles.module.css";
import Cookies from "js-cookie";

const AddFriendSearchBar = () => {

    const [query, setQuery] = useState("");

    const baseURL = process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";
  

    const handleFriendRequestSubmit = (e) => {
        e.preventDefault();
        const token = Cookies.get("jwt");
        axios
            .post(`${baseURL}/friends/newfriendrequest`, {toUser: query}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
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
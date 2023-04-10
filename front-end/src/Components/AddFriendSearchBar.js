import React, { useState } from "react";
import axios from "axios";


import AddFriendSearchBarStyles from "./AddFriendSearchBarStyles.module.css";
import Cookies from "js-cookie";

const AddFriendSearchBar = () => {

    const [query, setQuery] = useState("");

    const handleSubmit = () => {
        const token = Cookies.get("jwt");
        axios
            .post(`http://localhost:5002/friends/newfriendrequest`, {toUser: query}, {
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
        <form onSubmit={handleSubmit}> 
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
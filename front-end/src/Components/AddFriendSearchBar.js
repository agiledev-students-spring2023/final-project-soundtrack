import React from "react";

import AddFriendSearchBarStyles from "./AddFriendSearchBarStyles.module.css";

const AddFriendSearchBar = () => {

    const handleSubmit = () => {
        //send post request to server with incoming friend request to user
    }

    return(
        <form onSubmit={handleSubmit}> 
            <div className={AddFriendSearchBarStyles.MainBox}>
                <input type="friendSearch" name="friendSearchInput" placeholder="Add a friend..." required/>
                <button
                    title="Send"
                    type="friendSearchSubmit"
                />
            </div>
        </form>
    )
}

export default AddFriendSearchBar;
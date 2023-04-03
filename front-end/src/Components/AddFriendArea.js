import React from "react";

import AddFriendSearchBar from "./AddFriendSearchBar";

import "./AddFriendArea.css";

const AddFriendArea = () => {

    return(
        <div className="AddFriendArea">
            <div className="AddFriendTitle">
                Add Friends
            </div>

            <div>
                <AddFriendSearchBar/>
            </div>
        </div>
    );
}


export default AddFriendArea;
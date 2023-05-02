import React from "react";

import AddFriendSearchBar from "./AddFriendSearchBar";

import "./AddFriendArea.css";

const AddFriendArea = ({setDisplayAlert}) => {

    return(
        <div className="AddFriendArea">
            <div className="AddFriendTitle">
                Add Friends
            </div>

            <div>
                <AddFriendSearchBar setDisplayAlert={setDisplayAlert}/>
            </div>
        </div>
    );
}


export default AddFriendArea;
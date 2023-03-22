import React from "react";
import "./FriendProfileChip.css";

const FriendProfileChip = ({data}) => {

    return(
        <div className="MainBox">
            <div className="PictureAndUsername">

                <img src={data.avatar} alt="avatar" className="Avatar" /> 
                <div> @{data.username}</div>

            </div>

            <div>
                
            </div>
        </div>

    );
}

export default FriendProfileChip;
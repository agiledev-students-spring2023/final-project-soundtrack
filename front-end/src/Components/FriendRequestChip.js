import React from "react";

import "./FriendRequestChip.css";

const FriendRequestChip = ({data}) => {

    return(
        <div className="MainBox">
            {/* left aligned */}
            <div className="PictureAndUsername">
                <img src={data.avatar} alt="avatar" className="Avatar" /> 
                <div> @{data.username}</div>
            </div>

            {/* right aligned (buttons) */}
            <div className="Buttons">
                <div> ✓ </div>
                <div> X </div>
            </div>

        </div>
    );
}

export default FriendRequestChip;
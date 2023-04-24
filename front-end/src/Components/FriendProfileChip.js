import React, { useEffect } from "react";
import "./FriendProfileChip.css";
import {useNavigate} from "react-router-dom";


const FriendProfileChip = ({data}) => {
    const navigate = useNavigate();

    // const thisUserId = data.

    console.log("data from chip:");
    console.log(data);

    return(
        <div className="MainBox" onClick={() => {
            navigate("/User")
            }}>
            <div className="PictureAndUsername">

                <img src={/*data.avatar*/null} alt="avatar" className="Avatar" /> 
                <div> @{data.userAId}</div>

            </div>

        </div>

    );
}

export default FriendProfileChip;
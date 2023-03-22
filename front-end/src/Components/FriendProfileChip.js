import React from "react";
import "./FriendProfileChip.css";
import {useNavigate} from "react-router-dom";


const FriendProfileChip = ({data}) => {
    const navigate = useNavigate(); 

    return(
        <div className="MainBox" onClick={() => {
            navigate("/User")
            }}>
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
import React from "react";

import "./FriendRequestStatusAlert.css";

const FriendRequestStatusAlert = ({success}) => {
    
    let message = "";
    let boxColor = "FriendRequestStatusAlertGreen";
    success == true ? message = "Request sent successfully" : message = "Error sending request";
    success == true ? boxColor = "FriendRequestStatusAlertGreen" : boxColor = "FriendRequestStatusAlertRed";

    return(
        <div className={boxColor}>
            <div className = "FriendRequestStatusAlert">
                {message}
            </div>
        </div>
    );
}


export default FriendRequestStatusAlert;
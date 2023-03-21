import React from "react";
import "./Friends.css";
import {useNavigate} from "react-router-dom"


const Friends = () => {
  const navigate = useNavigate(); 
    return(
        <div className="FriendsMainContainer">
            {/* header goes here? */}

            <div className="FriendsItemsDisplayColumn">
            <div className = "user-header"> 
                <a href="#" className="back-link" onClick = {() => {navigate("/map") }}>Back</a> 
            </div>
            <h2>Friends</h2>
                {/* friend items go here. these are placeholders */}
                <div> LOREM IPSUM 1 LOREM IPSUM 1 LOREM IPSUM 1 LOREM IPSUM 1 LOREM IPSUM 1 LOREM IPSUM 1 </div>

                <div> LOREM IPSUM 2 LOREM IPSUM 2 LOREM IPSUM 2 LOREM IPSUM 2 LOREM IPSUM 2 LOREM IPSUM 2 </div>

            </div>
        </div>
    );
}

export default Friends;
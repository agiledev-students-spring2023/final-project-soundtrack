import React from "react";
import "./HeaderBrowseMap.css";

const HeaderBrowseMap = () => {
    return(
        <main>
            <div className="LogoPostAndProfile">
                <div className="SquareButton1">
                    Post
                </div>

                <div className="LogoText">
                    SoundTrack
                </div>

                <div className="SquareButton1">
                    Profile
                </div>
            </div>
            <div className="BrowseAndMapRow">
                <div className="SquareButton2">
                    Browse
                </div>

                <div className="SquareButton2">
                    |
                </div>
                
                <div className="SquareButton2">
                    Map
                </div>
            </div>
        </main>
        
        
    );
}

export default HeaderBrowseMap;
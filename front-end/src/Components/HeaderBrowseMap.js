import React from "react";
import "./HeaderBrowseMap.css";
import {useNavigate} from "react-router-dom"


const HeaderBrowseMap = () => {
    const navigate = useNavigate(); 
    return(
        <main>
            <div className="LogoPostAndProfile">
                <div onClick = {() => {navigate("/post") }} className="SquareButton1">
                    Post
                </div>

                <div className="LogoText">
                    SoundTrack
                </div>

                <div onClick = {() => {navigate("/user") }}className="SquareButton1">
                    Profile
                </div>
            </div>
            <div className="BrowseAndMapRow">
                <div onClick = {() => {navigate("/browse") }}className="SquareButton2">
                    Browse
                </div>

                <div className="SquareButton2">
                    |
                </div>
                
                <div  onClick = {() => {navigate("/map") }} className="SquareButton2">
                    Map
                </div>
            </div>
        </main>
        
        
    );
}

export default HeaderBrowseMap;
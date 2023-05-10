import React from "react";
import "./HeaderBrowseMap.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";

const HeaderBrowseMap = () => {
  const navigate = useNavigate();
  return (
    <main>
      <div className="LogoPostAndProfile">
        <div
          onClick={() => {
            navigate("/post");
          }}
          className="SquareButton1"
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>

        <div className="LogoText">
          <img
            src={require("../Logos/soundTrackFullLogo.png")}
            width="200px"
            height="200px"
            srcSet={require("../Logos/fullLogo.svg")}
          />
        </div>
        <div
          onClick={() => {
            navigate("/user");
          }}
          className="SquareButton1"
        >
          <FontAwesomeIcon icon={faUser}/>
        </div>
      </div>


      
      <div className="BrowseAndMapRow">
        <div
          onClick={() => {
            navigate("/browse");
          }}
          className="SquareButton2"
        >
          Recent
        </div>

        <div className="SquareButton2">|</div>

        <div
          onClick={() => {
            navigate("/map");
          }}
          className="SquareButton2"
        >
          Map
        </div>
      </div>
    </main>
  );
};

export default HeaderBrowseMap;

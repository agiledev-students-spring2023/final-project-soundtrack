import React, {useState, useEffect} from "react";
import axios from "axios";

import {useNavigate} from "react-router-dom"

import IncomingFriendsPopup from "../Components/IncomingFriendsPopup";
import "./Friends.css";
import FriendProfileChip from "../Components/FriendProfileChip";

const Friends = () => {

    const [data, setData] = useState([]);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends`)
          .then((result) => {
            setData(result.data);
          })
          .catch((err) => {
            setError('Failed to fetch data from the server');
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);

    return(
        <div>
          <div className="LogoPostAndProfile">
              <div className="LogoText">
                Friends
              </div>
              
              <div onClick = {() => {navigate("/user") }} className="SquareButton1">
                Back
              </div>

            </div>

          <div className="FriendsMainContainer">
            <IncomingFriendsPopup/>
              <div className="FriendsItemsDisplayColumn">
                {data.map((chip, index) => (<FriendProfileChip key={index} data={chip}/>))} 
              </div>
          </div>
        </div>
    );
}

export default Friends;
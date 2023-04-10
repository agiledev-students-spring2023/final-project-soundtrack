import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import {useNavigate} from "react-router-dom"

import "./Friends.css";

import IncomingFriendsPopup from "../Components/IncomingFriendsPopup";
import FriendProfileChip from "../Components/FriendProfileChip";
import AddFriendArea from "../Components/AddFriendArea";

const Friends = () => {

    const [data, setData] = useState([]);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = Cookies.get("jwt");
        axios
          .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends/friendlist`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
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
            <AddFriendArea/>
            <IncomingFriendsPopup/>
              <div className="FriendsItemsDisplayColumn">
                {data.map((chip, index) => (<FriendProfileChip key={index} data={chip}/>))} 
              </div>
          </div>
        </div>
    );
}

export default Friends;
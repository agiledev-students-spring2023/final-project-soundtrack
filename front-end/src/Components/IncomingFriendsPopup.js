import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

import FriendProfileChip from "./FriendProfileChip";
import FriendRequestChip from "./FriendRequestChip";

import "./IncomingFriendsPopup.css";
import Cookies from "js-cookie";

const IncomingFriendsPopup = () => {

    const [data, setData] = useState([]);
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

    if(!Object.keys(data).length == 0) { //only display popup if the user has friend requests (check if our api data has entries)
        return(
            <div className="MainContainer">
                <h3>Incoming Requests</h3>
                {data.map((chip, index) => (<FriendRequestChip key={index} data={chip}/>))} 
            </div>
        );
    } else { //otherwise don't
        return null;
    }

}

export default IncomingFriendsPopup;
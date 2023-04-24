import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

import FriendProfileChip from "./FriendProfileChip";
import FriendRequestChip from "./FriendRequestChip";

import "./IncomingFriendsPopup.css";
import Cookies from "js-cookie";

const IncomingFriendsPopup = () => {

    const [data, setData] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        const token = Cookies.get("jwt");
        axios
          .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends/getfriendrequests`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((result) => {
            setData(result.data);
          })
          .catch((err) => {
            setError('Failed to fetch data from the server');
          });
      }, []);

    if(data.incomingRequests && !Object.keys(data.incomingRequests).length == 0) { //only display popup if the user has friend requests (check if our api data has entries)
        return(
            <div className="MainContainer">
                <h3>Incoming Requests</h3>
                {data.incomingRequests
                .slice(0, data.length)
                .map((request, index) => (<FriendRequestChip key={index} data={request}/>))}
            </div>
        );
    } else { //otherwise don't
        return null;
    }

}

export default IncomingFriendsPopup;
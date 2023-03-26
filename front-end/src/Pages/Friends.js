import React, {useState, useEffect} from "react";
import axios from "axios";

import {useNavigate} from "react-router-dom"

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
        <div className="FriendsMainContainer">
            {/* header goes here? */}

            <div className = "user-header"> 
                <a href="#" className="back-link" onClick = {() => {navigate("/user") }}>Back</a> 
            </div>

            <div className="FriendsItemsDisplayColumn">

                
                <h2>Friends</h2>
                    {/* friend items go here. these are placeholders */}
                    
                    {data.map((chip, index) => (<FriendProfileChip key={index} data={chip}/>))}
            </div>
        </div>
    );
}

export default Friends;
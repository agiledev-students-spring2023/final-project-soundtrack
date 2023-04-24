import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FriendProfileChip.css";
import {useNavigate} from "react-router-dom";


const FriendProfileChip = ({data}) => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // const thisUserId = data.

    //get data for avatar & username
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/getUserInfo/${data.userBId}`) //have to change this to always be other user
            .then((result) => {
                setUserData(result.data);
            })
            .catch((err) => {
                setError('Failed to fetch data from the server');
            })          
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return(
        <div className="MainBox" onClick={() => {
            navigate("/User")
            }}>
            <div className="PictureAndUsername">

                <img src={userData.avatar} alt="avatar" className="Avatar" /> 
                <div> @{loading ? "Loading..." : userData.userName}</div>

            </div>

        </div>

    );
}

export default FriendProfileChip;
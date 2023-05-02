import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./FriendProfileChip.css";
import {useNavigate} from "react-router-dom";


const FriendProfileChip = ({data}) => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("jwt"); // Get the JWT token from the cookie


    //get data for avatar & username
    useEffect(() => {
        //check to see if this is userA or userB, and get info for the opposite (bc we want to display your friends, not your name)
        //get logged in user's (via token) username
        axios
          .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/userInfo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((result) => {
            setUser(result.data);

          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message || "Failed to fetch data from the server";
            setError(errorMessage);
          });

      }, [token]);

    
    // console.log(loggedInId);
    // console.log(data.userBId);
    // if(loggedInId == data.userBId)
    //   console.log("true");

    let loggedInId = user.userId;
    
    useEffect(() => {

        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/getUserInfo/${
                (loggedInId == data.userBId) ? data.userAId : data.userBId
            }`) 
            
            .then((result) => {
                setUserData(result.data);
            })
            .catch((err) => {
                setError('Failed to fetch data from the server');
            })          
            .finally(() => {
                setLoading(false);
            });
    }, [user]);


    

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
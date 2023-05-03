import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import "./FriendRequestChip.css";

import Cookies from "js-cookie";


const FriendRequestChip = ({data}) => {
    const navigate = useNavigate();

    const [fromUserData, setFromUserData] = useState([]);
    const [fromUserProfileData, setFromUserProfileData] = useState([]);
    const [error, setError] = useState('');
    const [profileDataError, setProfileDataError] = useState("");
    const [loadingProfileData, setLoadingProfileData] = useState(true);

    const baseURL = process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";
  

    //TODO: this should be getting avatar and username
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`)
            .then((result) => {
            setFromUserData(result.data);
            })
            .catch((err) => {
            setError('Failed to fetch data from the server');
            });
    }, []);

    //get data for avatar & username
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/getUserInfo/${data.fromUserId}`) //have to change this to always be other user
            .then((result) => {
                setFromUserProfileData(result.data);
            })
            .catch((err) => {
                setError('Failed to fetch data from the server');
            })     
            .finally(() => {
                setLoadingProfileData(false);
            });
    }, []);
    

    //accept friend request
    const acceptFunction = () => {
        //post new relationship
        const token = Cookies.get("jwt");
        axios
            .post(`${process.env.REACT_APP_SERVER_HOSTNAME}/relationships/newrelationship`, {userAId: data.toUserId, userBId: data.fromUserId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        
        //delete now-accepted and thus expired friend request
        axios
            .delete(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends/rejectfriendrequest`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    fromUserId: data.fromUserId,
                    toUserId: data.toUserId
                }
            })
            .then((res) => {
                //console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        window.location.reload();
    }

    const rejectFunction = () => {
        //console.log("rejected");
        const token = Cookies.get("jwt");
        axios
            .delete(`${process.env.REACT_APP_SERVER_HOSTNAME}/friends/rejectfriendrequest`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    fromUserId: data.fromUserId,
                    toUserId: data.toUserId
                }
            })
            .then((res) => {
                //console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        window.location.reload();
    }

    return(
        <div className="MainBox">
            {/* left aligned */}
            <div className="PictureAndUsername" onClick={() => {
                navigate(`/UserProfile/${data.fromUserId}`)
            }}>
                <img src={fromUserProfileData.avatar} alt="avatar" className="Avatar" /> 
                <div> @{loadingProfileData ? "Loading..." : fromUserProfileData.userName}</div>
            </div>

            {/* right aligned (buttons) */}
            <div className="Buttons">
                <div onClick={acceptFunction}> ✓ </div>
                <div onClick={rejectFunction}> X </div>
            </div>

        </div>
    );
}

export default FriendRequestChip;
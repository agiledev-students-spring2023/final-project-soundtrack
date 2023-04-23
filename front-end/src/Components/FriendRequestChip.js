import React, {useState, useEffect} from "react";
import axios from "axios";

import "./FriendRequestChip.css";

import Cookies from "js-cookie";


const FriendRequestChip = ({data}) => {

    const [fromUserData, setFromUserData] = useState([]);
    const [error, setError] = useState('');

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
    

    //accept friend request
    const acceptFunction = () => {
        console.log("accepted");
        //post new relationship
        const token = Cookies.get("jwt");
        axios
            .post(`http://localhost:5002/relationships/newrelationship`, {userAId: data.toUserId, userBId: data.fromUserId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const rejectFunction = () => {
        console.log("rejected");
    }

    return(
        <div className="MainBox">
            {/* left aligned */}
            <div className="PictureAndUsername">
                <img src={data.avatar} alt="avatar" className="Avatar" /> 
                <div> @{data.fromUserId}</div>
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
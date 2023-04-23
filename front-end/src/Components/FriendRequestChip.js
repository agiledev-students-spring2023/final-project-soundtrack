import React, {useState, useEffect} from "react";
import axios from "axios";

import "./FriendRequestChip.css";

const FriendRequestChip = ({parentData}) => {

    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`)
            .then((result) => {
            setData(result.data);
            })
            .catch((err) => {
            setError('Failed to fetch data from the server');
            });
    }, []);

    return(
        <div className="MainBox">
            {/* left aligned */}
            <div className="PictureAndUsername">
                <img src={data.avatar} alt="avatar" className="Avatar" /> 
                <div> @{data.username}</div>
            </div>

            {/* right aligned (buttons) */}
            <div className="Buttons">
                <div> ✓ </div>
                <div> X </div>
            </div>

        </div>
    );
}

export default FriendRequestChip;
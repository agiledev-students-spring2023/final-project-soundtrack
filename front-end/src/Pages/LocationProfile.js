import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./LocationProfile.css"; 
import UserPost from '../Components/UserPost';
import {useNavigate} from "react-router-dom"

const LocationProfile = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true); // set loading to true before fetching data
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/locationprofile`, {})
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

    for(let i=0; i<data.length; i++){
        data[i].location = "Location Name";
    }

    return (
        <div className="location-container">
            <div className="location-header"> 
                <div onClick={() => navigate("/map")} className="back-link">Back</div>
            </div>
            <div className="location-profile">
                <img src="image.jpeg" alt="Profile" />
                <h1 className="locationname">@{data[0]?.locationName}</h1>
            </div>
            {loading ? (
                <div className="loading-message">Loading...</div>
            ) : (
                <>
                    {data[0].songTitle ?
                        <div className="location-posts">
                            {data.map((post, index) => (<UserPost key={index} data={post} post={post}/>))}
                        </div>
                        :
                        <div className="no-data-message" onClick ={() => navigate("/post")} >
                            No one has posted a song at this location. Click to post your song here.
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default LocationProfile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Followers.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Followers = ({ userId }) => {
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/${userId}/followers`);
                setFollowers(response.data);
            } catch (error) {
                console.error('Error fetching followers:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFollowers();
        }
    }, [userId]);

    const handleUserClick = (followerId) => {
        navigate(`/UserProfile/${followerId}`);
    };

    return (
        <div className="followers-page">
            <div className="user-header">
                <div onClick={() => navigate("/user")} className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> 
                </div>
            </div>
            <h2>Followers</h2>
            {loading ? (
                <div className="followers-loading">
                    <FontAwesomeIcon icon={faSpinner} spin /> 
                </div>
            ) : followers.length > 0 ? (
                <ul className="followers-list">
                    {followers.map(follower => (
                        <li key={follower._id}>
                            <img src={follower.avatar} alt={follower.userName} />
                            <span onClick={() => handleUserClick(follower.userId)} className="follower-username">
                                {follower.userName}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No followers.</p> 
            )}
        </div>
    );
};

export default Followers;




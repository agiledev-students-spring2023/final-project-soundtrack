import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Following.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from "react-router-dom";

const Following = () => {
    const navigate = useNavigate();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    useEffect(() => {
        const fetchFollowing = async () => {
            if (!userId) {
                console.error('No user ID found');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/${userId}/following`);
                setFollowing(response.data);
            } catch (error) {
                console.error('Error fetching following:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFollowing();
        }
    }, [userId]);

    const handleUserClick = (followingUserId) => {
        navigate(`/UserProfile/${followingUserId}`);
    };

    return (
        <div className="following-page">
            <div className="user-header">
                <div onClick={() => navigate("/user")} className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> 
                </div>
            </div>
            <h2>Following</h2>
            {loading ? (
                <div className="following-loading">
                    <FontAwesomeIcon icon={faSpinner} spin /> 
                </div>
            ) : (
                <ul className="following-list">
                    {following.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.userName} />
                            <span onClick={() => handleUserClick(user.userId)} className="following-username">
                                {user.userName}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Following;


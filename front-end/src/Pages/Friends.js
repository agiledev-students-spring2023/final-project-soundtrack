import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import './Friends.css';
import FriendProfileChip from '../Components/FriendProfileChip';

function Friends() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        // temporarily using the browse mockaroo for the data
        'https://my.api.mockaroo.com/browse.json?key=d0d8c110',
      );
      setData(result.data);
    }
    fetchData();
  }, []);

  return (
    <div className="FriendsMainContainer">
      {/* header goes here? */}

      <div className="user-header">
        <a href="#" className="back-link" onClick={() => { navigate('/user'); }}>Back</a>
      </div>

      <div className="FriendsItemsDisplayColumn">

        <h2>Friends</h2>
        {/* friend items go here. these are placeholders */}

        {data.map((chip, index) => (<FriendProfileChip key={index} data={chip} />))}
      </div>
    </div>
  );
}

export default Friends;

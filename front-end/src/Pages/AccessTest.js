import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AccessTest.css';
import SongPreview from '../Components/SongPreview';

const Auth = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/recently-played`
      );
      //console.log(data.items[0]);
      const uniqueTracks = removeDuplicateTracks(data.items);
      setRecentlyPlayed(uniqueTracks);
    };
    fetchData();
  }, []);

  const removeDuplicateTracks = (items) => {
    const trackIds = new Set();
    return items.filter((item) => {
      if (trackIds.has(item.track.id)) {
        return false;
      } else {
        trackIds.add(item.track.id);
        return true;
      }
    });
  };

  return (
    <div className="recently-played-container">
      {recentlyPlayed.slice(0, 10).map((item, index) => (
        <SongPreview track={item.track}/>
      ))}
    </div>
  );
};

export default Auth;







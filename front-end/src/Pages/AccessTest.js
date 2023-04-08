import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/recently-played`);
      const uniqueTracks = removeDuplicateTracks(data.items);
      setRecentlyPlayed(uniqueTracks);
    };
    fetchData();
  }, []);

  const removeDuplicateTracks = (items) => {
    const trackIds = new Set();
    return items.filter(item => {
      if (trackIds.has(item.track.id)) {
        return false;
      } else {
        trackIds.add(item.track.id);
        return true;
      }
    });
  }

  return (
    <div>
      <h1>Recently Played Tracks</h1>
      <ul>
        {recentlyPlayed.map((item, index) => (
          <li key={index}>
            <img src={item.track.album.images[0].url} alt={`${item.track.name} album cover`} />
            <p>{`${index + 1}. ${item.track.artists.map(artist => artist.name).join(', ')} - ${item.track.name}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Auth;


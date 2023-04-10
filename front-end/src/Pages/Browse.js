import React, { useState, useEffect } from 'react';
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost"

const Browse = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/browse`)
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
  
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/auth/random-songs`
      );
      setSongs(data.tracks.items);
    };
    fetchData();
  }, []);

  
    return (
        <div>
        <HeaderBrowseMap/>
        
            <div className="Browse-items">
                {/* Posts will go here. They're flexed in a single column */}
                {data.map((post, index) => (<UserPost key={index} data={post} post={post} song = {songs[index]}/>))}
            </div>
        </div>
    );
}

export default Browse;
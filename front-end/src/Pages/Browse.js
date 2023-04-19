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
        console.log(result.data);
        setData(result.data);
      })
      .catch((err) => {
        setError('Failed to fetch data from the server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <HeaderBrowseMap/>
      <div className="Browse-items">
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {data.map((post, index) => <UserPost key={index} post={post} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default Browse;

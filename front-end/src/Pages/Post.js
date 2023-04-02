import './Post.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';

function Post() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      console.log('Fetching data from Api');
      const result = await axios(
        'https://my.api.mockaroo.com/choose_song.json?key=0b0aecc0',
      );
      setData(result.data);
    }

    fetchData();
  }, []);

  return (
    <header>
      <div className="Title">
        <button className="ReturnButton" onClick={() => navigate('/Map')}>
          back
        </button>
        <h1>Start Posting, Choose a Song</h1>
      </div>

      <SearchBar placeholder="Search Song" data={data} />

      <button className="Button" onClick={() => navigate('/Camera')}>
        Next
      </button>
    </header>
  );
}

export default Post;

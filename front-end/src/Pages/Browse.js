import React, { useState, useEffect } from 'react';
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost"

const Browse = () => {
    const [data, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/browse`)
      .then((result) => {
        console.log(result.data);
        setPosts(result.data);
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
        
          
                {/* Posts will go here. They're flexed in a single column */}
                {/* {data.map((post, index) => (<UserPost key={index} data={post}/>))} */}
                {/* {<UserPost data={data[0]}/>} */}
            <div className="Browse-items">
              {data.posts &&
                data.posts
                  .slice(0, data.posts.length)
                  .map((post, index) => <UserPost key={index} post={post} />)}
            </div>
      
            </div>
    );
}

export default Browse;
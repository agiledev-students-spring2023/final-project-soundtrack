import React, { useState, useEffect } from 'react';
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost"

const Browse = () => {
    const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
        const result = await axios(
          "https://my.api.mockaroo.com/browse.json?key=d0d8c110"
        );
        setData(result.data);
      
    }
    fetchData();
  }, []);

    return (
        <div>
        <HeaderBrowseMap/>
        
            <div className="Browse-items">
                {/* Posts will go here. They're flexed in a single column */}
                {data.map((post, index) => (<UserPost key={index} data={post} post={post}/>))}
            </div>
        </div>
    );
}

export default Browse;
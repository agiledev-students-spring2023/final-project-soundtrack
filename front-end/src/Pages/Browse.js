import React, { useState, useEffect, useCallback } from "react";
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost";

const Browse = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/browse/${skip}/${limit}`)
      .then((result) => {
        setData((prevData) => {
          const uniquePosts = result.data.filter((post) => !prevData.some((p) => p._id === post._id));
          return [...prevData, ...uniquePosts];
        });
                setHasMore(result.data.length > 0);
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [skip, limit]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div>
      <HeaderBrowseMap />
      <div className="Browse-items">
        {data.map((post) => (
          <UserPost key={post._id} post={post} />
        ))}
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {hasMore && (
          <a href="#" onClick={handleLoadMore}>
            Load More
          </a>
        )}
      </div>
    </div>
  );
};

export default Browse;

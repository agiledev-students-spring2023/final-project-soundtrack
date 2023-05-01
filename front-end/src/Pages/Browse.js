import React, { useState, useEffect, useCallback } from "react";
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";

const Browse = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(
    debounce(() => {
      axios
        .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/browse/${skip}/${limit}`)
        .then((result) => {
          setData((prevData) => {
            const uniquePosts = result.data.filter((post) => !prevData.some((p) => p._id === post._id));
            return [...prevData, ...uniquePosts];
          });
          setHasMore(result.data.length > 0);
          setSkip((prevSkip) => prevSkip + limit);
        })
        .catch((err) => {
          setError("Failed to fetch data from the server");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500),
    [skip, limit]
  );
  

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <div>
      <HeaderBrowseMap />
      <div className="Browse-items">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          {data.map((post) => (
            <UserPost key={post._id} post={post} />
          ))}
        </InfiniteScroll>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Browse; 
import React, { useState, useEffect, useCallback } from "react";
import "./Browse.css";
import axios from "axios";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

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
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        //console.log("Decoded User ID:", decoded.id); // Log decoded user ID
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []); 
  

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const token = Cookies.get("jwt");
let userId;

if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id; 
  } catch (e) {
    // handle error
  }
}

const handlePostDelete = (postId) => {
  setData((currentPosts) => currentPosts.filter((post) => post._id !== postId));
};

const handlePrivacyChange = (postId, newPrivacy) => {
  setData((currentPosts) =>
    currentPosts.map((post) => {
      if (post._id === postId) {
        return { ...post, privacy: newPrivacy };
      }
      return post;
    })
  );
};
  return (
    <div className= "browse-container">
      <div className="header">
        <HeaderBrowseMap />
      </div>
      <div className="Browse-items">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="loading-animation">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          {data.map((post) => {
 
  
  // Render the UserPost component
        return (
          <UserPost
            key={post._id}
            post={post}
            onDelete={handlePostDelete}
            onPrivacyChange={handlePrivacyChange}
            isCurrentUser={post.userId === userId}
          />
        );
      })}

        </InfiniteScroll>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Browse;

import "./UserPost.css"; 

const Post = () => {
  return (
    <div className="post">
    <div className="post-header">
      <img src="image.jpeg" alt="avatar" className="avatar" />
      <h3>@username</h3>
    </div>
    <img src="image.jpeg" alt="post" className="post-image" />

    <div className="link">
          <a href={"Song Link"} target="_blank" rel="noopener noreferrer">
            Song
          </a>
        </div>
    <div className="link">
          <a href={"Location Link"} target="_blank" rel="noopener noreferrer">
            Location
          </a>
        </div>
    <div className="post-footer">
      <span>15 likes</span>
    </div>
  </div>
  );
};

export default Post; 
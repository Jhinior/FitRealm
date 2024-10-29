import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import "../../assets/styles/Blogs.css";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        // Fetching all posts
        const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setPosts(response.data);

        // Fetching top posts in parallel using Promise.all
        const [topCommentedResponse, topLikedResponse, topViewedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_commented/", {
            headers: { Authorization: `token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_liked/", {
            headers: { Authorization: `token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_viewed/", {
            headers: { Authorization: `token ${token}` },
          }),
        ]);

        setTopCommentedPosts(topCommentedResponse.data);
        setTopLikedPosts(topLikedResponse.data);
        setTopViewedPosts(topViewedResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handlePostClick = (id) => {
    window.location.href = `/Detail/${id}`;
  };

  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {/* Section for All Posts */}
          <section className="all-posts-section">
            <div className="container">
              <h2 className="all-posts-title">All Posts</h2>
              <div className="all-posts-grid">
                {posts.map((p) => (
                  <div
                    className="all-posts-card"
                    key={p.id}
                    onClick={() => handlePostClick(p.id)}
                  >
                    <div className="all-posts-image-wrapper">
                      <img
                        className="all-posts-image"
                        src={p.image}
                        alt={p.title}
                      />
                    </div>
                    <div className="all-posts-card-body">
                      <h4 className="all-posts-card-title">
                        {p.title?.length > 32 ? `${p.title.slice(0, 32)}...` : p.title}
                      </h4>
                      <ul className="all-posts-info">
                        <li>
                          <span className="text">
                            <i className="fas fa-user"></i>
                            {p.user?.first_name} {p.user?.last_name}
                          </span>
                        </li>
                        <li>
                          <i className="fas fa-calendar"></i>
                          {moment(p.date).format("DD MMM, YYYY")}
                        </li>
                        <li>
                          <i className="fas fa-eye"></i>
                          {p.view} Views
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
      <section className="top-commented-posts-section">
        <div className="top-commented-posts-container">
          <h2 className="top-commented-posts-title">Top Commented Posts</h2>
          <div className="top-commented-posts-grid">
            {topCommentedPosts.map((p) => (
              <div className="top-commented-post-card-wrapper" key={p.id}>
                <div
                  className="top-commented-post-card"
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="top-commented-post-image-wrapper">
                    <img
                      className="top-commented-post-image"
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="top-commented-post-card-body">
                    <h4 className="top-commented-post-card-title">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="top-commented-post-info-list">
                      <li>
                        <span className="top-commented-post-user">
                          <i className="fas fa-user"></i>
                          {p.user?.first_name} {p.user?.last_name}
                        </span>
                      </li>
                      <li className="top-commented-post-date">
                        <i className="fas fa-calendar"></i>{" "}
                        {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="top-commented-post-comments">
                        <i className="fas fa-comments"></i> {p.comments_count}{" "}
                        Comments
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="top-liked-posts-section">
        <div className="top-liked-posts-container">
          <h2 className="top-liked-posts-title">Top Liked Posts</h2>
          <div className="top-liked-posts-grid">
            {topLikedPosts.map((p) => (
              <div className="top-liked-post-card-wrapper" key={p.id}>
                <div
                  className="top-liked-post-card"
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="top-liked-post-image-wrapper">
                    <img
                      className="top-liked-post-image"
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="top-liked-post-card-body">
                    <h4 className="top-liked-post-card-title">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="top-liked-post-info-list">
                      <li>
                        <span className="top-liked-post-user">
                          <i className="fas fa-user"></i> {p.user?.first_name}{" "}
                          {p.user?.last_name}
                        </span>
                      </li>
                      <li className="top-liked-post-date">
                        <i className="fas fa-calendar"></i>{" "}
                        {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="top-liked-post-likes">
                        <i className="fas fa-thumbs-up"></i> {p.likes_count}{" "}
                        Likes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="top-viewed-posts-section">
        <div className="top-viewed-posts-container">
          <h2 className="top-viewed-posts-title">Top Viewed Posts</h2>
          <div className="top-viewed-posts-grid">
            {topViewedPosts.map((p) => (
              <div className="top-viewed-post-card-wrapper" key={p.id}>
                <div
                  className="top-viewed-post-card"
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="top-viewed-post-image-wrapper">
                    <img
                      className="top-viewed-post-image"
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="top-viewed-post-card-body">
                    <h4 className="top-viewed-post-card-title">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="top-viewed-post-info-list">
                      <li>
                        <span className="top-viewed-post-user">
                          <i className="fas fa-user"></i> {p.user?.first_name}{" "}
                          {p.user?.last_name}
                        </span>
                      </li>
                      <li className="top-viewed-post-date">
                        <i className="fas fa-calendar"></i>{" "}
                        {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="top-viewed-post-views">
                        <i className="fas fa-eye"></i> {p.view} Views
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


          
        </>
      )}
    </div>
  );
};

export default Blogs;

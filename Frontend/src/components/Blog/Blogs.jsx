import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const token = localStorage.getItem("token"); // Assuming you're using token for authentication

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching all posts
        const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setPosts(response.data);

        // Fetching top commented posts
        const topCommentedResponse = await axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_commented/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setTopCommentedPosts(topCommentedResponse.data);

        // Fetching top liked posts
        const topLikedResponse = await axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_liked/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setTopLikedPosts(topLikedResponse.data);

        // Fetching top viewed posts
        const topViewedResponse = await axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_viewed/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setTopViewedPosts(topViewedResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handlePostClick = (id) => {
    // Navigate to post details page
    window.location.href = `/Detail/${id}`; // Adjust the URL as needed
  };

  return (
    <div>
      {/* Section for All Posts */}
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">All Posts</h2>
          <div className="row">
            {posts.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.id}>
                <div
                  className="card mb-4"
                  style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title fw-bold text-decoration-none">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
                      <li>
                        <span className="text-dark">
                          <i className="fas fa-user"></i> {p.user?.first_name} {p.user?.last_name}
                        </span>
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-calendar"></i> {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="mt-2">
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

      {/* Section for Top Commented Posts */}
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">Top Commented Posts</h2>
          <div className="row">
            {topCommentedPosts.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.id}>
                <div
                  className="card mb-4"
                  style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title fw-bold text-decoration-none">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
                      <li>
                        <span className="text-dark">
                          <i className="fas fa-user"></i> {p.user?.first_name} {p.user?.last_name}
                        </span>
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-calendar"></i> {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-comments"></i> {p.comments_count} Comments
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section for Top Liked Posts */}
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">Top Liked Posts</h2>
          <div className="row">
            {topLikedPosts.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.id}>
                <div
                  className="card mb-4"
                  style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title fw-bold text-decoration-none">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
                      <li>
                        <span className="text-dark">
                          <i className="fas fa-user"></i> {p.user?.first_name} {p.user?.last_name}
                        </span>
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-calendar"></i> {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-thumbs-up"></i> {p.likes_count} Likes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section for Top Viewed Posts */}
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">Top Viewed Posts</h2>
          <div className="row">
            {topViewedPosts.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p.id}>
                <div
                  className="card mb-4"
                  style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => handlePostClick(p.id)}
                >
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title fw-bold text-decoration-none">
                      {p.title?.slice(0, 32) + "..."}
                    </h4>
                    <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
                      <li>
                        <span className="text-dark">
                          <i className="fas fa-user"></i> {p.user?.first_name} {p.user?.last_name}
                        </span>
                      </li>
                      <li className="mt-2">
                        <i className="fas fa-calendar"></i> {moment(p.date).format("DD MMM, YYYY")}
                      </li>
                      <li className="mt-2">
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
    </div>
  );
};

export default Blogs;

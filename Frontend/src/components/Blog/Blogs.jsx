import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);

        const uniqueCategories = Array.from(
          new Set(response.data.map((post) => post.category_name))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handlePostClick = (id) => {
    window.location.href = `/Detail/${id}`;
  };

  const renderPostCard = (post) => (
    <div
      className="card mb-4"
      style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
      onClick={() => handlePostClick(post.id)}
    >
      <div className="card-fold position-relative">
        <img
          className="card-img"
          style={{ width: "100%", height: "160px", objectFit: "cover" }}
          src={post.image}
          alt={post.title}
        />
      </div>
      <div className="card-body px-3 pt-3">
        <h4 className="card-title fw-bold text-decoration-none">
          {post.title?.slice(0, 32) + "..."}
        </h4>
        <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span className="text-dark">
              <i className="fas fa-user"></i> {post.user?.first_name} {post.user?.last_name}
            </span>
          </li>
          <li className="mt-2">
            <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
          </li>
          {post.comments_count && (
            <li className="mt-2">
              <i className="fas fa-comments"></i> {post.comments_count} Comments
            </li>
          )}
          {post.likes_count && (
            <li className="mt-2">
              <i className="fas fa-thumbs-up"></i> {post.likes_count} Likes
            </li>
          )}
          <li className="mt-2">
            <i className="fas fa-eye"></i> {post.view} Views
          </li>
        </ul>
      </div>
    </div>
  );

  const filteredPosts = posts.filter((post) => {
    const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.category_name === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">All Posts</h2>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mb-4"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="row">
            {filteredPosts.length === 0 ? (
              <div className="col-12">No posts found.</div>
            ) : (
              filteredPosts.map((p) => (
                <div className="col-sm-6 col-lg-3" key={p.id}>
                  {renderPostCard(p)}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;

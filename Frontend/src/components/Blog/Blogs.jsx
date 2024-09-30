import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";  // Import moment for date formatting

import axios from "axios";  // You can use fetch or axios for API calls

const Blogs = () => {
  const [postItems, setPostItems] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([1, 2]);

  useEffect(() => {
    // Fetch postItems from your API
    const fetchData = async () => {
      try {
        const postResponse = await axios.get("http://127.0.0.1:8000/Blog/posts/");  // Update to actual API endpoint
        setPostItems(postResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBookmarkPost = (id) => {
    // Handle bookmarking a post
    console.log(`Bookmark post with ID: ${id}`);
  };

  const handleLikePost = (id) => {
    // Handle liking a post
    console.log(`Like post with ID: ${id}`);
  };

  return (
    <div>
      <section className="p-0">
        <div className="container">
          <div className="row">
            <div className="col">
              <a href="#" className="d-block card-img-flash">
                <img src="assets/images/adv-3.png" alt="" />
              </a>
              <h2 className="text-start d-block mt-1">Trending Articles 🔥</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Post Section */}
      <section className="pt-4 pb-0">
        <div className="container">
          <div className="row">
            {postItems?.map((p, index) => (
              <div className="col-sm-6 col-lg-3" key={index}>
                <div className="card mb-4">
                  <div className="card-fold position-relative">
                    <img
                      className="card-img"
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      src={p.image}
                      alt={p.title}
                    />
                  </div>
                  <div className="card-body px-3 pt-3">
                    <h4 className="card-title">
                      <Link to={`${p.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                        {p.title?.slice(0, 32) + "..."}
                      </Link>
                    </h4>
                    <button type="button" onClick={() => handleBookmarkPost(p.id)} style={{ border: "none", background: "none" }}>
                      <i className="fas fa-bookmark text-danger"></i>
                    </button>
                    <button onClick={() => handleLikePost(p.id)} style={{ border: "none", background: "none" }}>
                      <i className="fas fa-thumbs-up text-primary"></i>
                    </button>
                    {" "} {p.likes?.length}
                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                      <li>
                        <a href="#" className="text-dark text-decoration-none">
                          <i className="fas fa-user"></i> {p.user?.first_name} {p.user?.last_name}
                        </a>
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

          {/* Pagination */}
          <nav className="d-flex mt-5">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                  <i className="ci-arrow-left me-2" /> Previous
                </button>
              </li>
            </ul>
            <ul className="pagination">
              {pageNumbers.map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(number)}>
                    {number}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="pagination">
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next <i className="ci-arrow-right ms-3" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>

    </div>
  );
};

export default Blogs;

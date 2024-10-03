import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import moment from "moment";
import axios from "axios";

const Blogs = () => {
  const [postItems, setPostItems] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await axios.get("http://127.0.0.1:8000/Blog/posts/");
        console.log(postResponse.data);
        setPostItems(postResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleBookmarkPost = (id) => {
    console.log(`Bookmark post with ID: ${id}`);
  };

  const handleLikePost = (id) => {
    console.log(`Like post with ID: ${id}`);
  };

  // Function to handle clicking on a blog post
  const handlePostClick = async (post) => {
    try {
      // Send a request to increment the view count
      await axios.patch(`http://127.0.0.1:8000/Blog/posts/${post.id}/`, {
        view: post.view + 1, // Increment the view count
      });

      // Navigate to the Detail page, passing the post as state
      navigate(`/detail/${post.slug}`, { state: { post: { ...post, view: post.view + 1 } } });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
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

      <section className="pt-4 pb-0">
        <div className="container" style={{marginBottom: '60px'}}>
          <div className="row">
            {postItems?.map((p, index) => (
              <div className="col-sm-6 col-lg-3" key={index}>
                <div className="card mb-4" style={{border: '2px solid white', marginTop:'20px' , overflow: 'hidden'}}>
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
                      <button
                        onClick={() => handlePostClick(p)} // Handle post click and pass data
                        className="btn-link text-reset stretched-link fw-bold text-decoration-none"
                        style={{ background: "none", border: "none" }}
                      >
                        {p.title?.slice(0, 32) + "..."}
                      </button>
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
        </div>
      </section>
     {userRole === 'trainer' && (
        <div className="text-center">
          <button
            className="btn btn-primary"
            style={{ width: '140px', height: '50px', fontSize: '25px', marginBottom: '30px' }}
            onClick={() => navigate('/AddPost')} // Add onClick to handle the navigation
          >
            Add Blog
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;

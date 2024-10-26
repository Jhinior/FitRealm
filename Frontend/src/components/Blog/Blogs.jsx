import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const Blogs = () => {
  const [postItems, setPostItems] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setPostItems(postResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleBookmarkPost = async (e, id) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://127.0.0.1:8000/Blog/bookmarks/",
        { user: userId, post: id },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      console.log("Bookmark added successfully:", response.data);
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleLikePost = (e, id) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    console.log(`Like post with ID: ${id}`);
  };

  const handlePostClick = (post) => {
    navigate(`/detail/${post.slug}`, { state: { post } });
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
        <div className="container" style={{ marginBottom: "60px" }}>
          <div className="row">
            {postItems?.map((p, index) => (
              <div className="col-sm-6 col-lg-3" key={index}>
                <div
                  className="card mb-4"
                  style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => handlePostClick(p)}
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
                    <button
                      type="button"
                      onClick={(e) => handleBookmarkPost(e, p.id)}
                      style={{ border: "none", background: "none" }}
                    >
                      <i className="fas fa-bookmark text-danger"></i>
                    </button>
                    <button
                      onClick={(e) => handleLikePost(e, p.id)}
                      style={{ border: "none", background: "none" }}
                    >
                      <i className="fas fa-thumbs-up text-primary"></i>
                    </button>
                    {" "} {p.likes?.length}
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
      {userRole === "trainer" && (
        <div className="text-center">
          <button
            className="btn btn-primary"
            style={{ width: "140px", height: "50px", fontSize: "25px", marginBottom: "30px" }}
            onClick={() => navigate("/AddPost")}
          >
            Add Blog
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;

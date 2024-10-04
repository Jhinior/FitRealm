import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import axios from 'axios';
import '../../assets/styles/PostDetails.css';



function Detail() {
  const location = useLocation();
  const post = location.state?.post; // Get the post data passed from the Blogs component
  console.log(post);
  if (!post) {
    return <div>Post not found!</div>; // Handle case where post data is not available
  }

  const [createComment, setCreateComment] = useState({
    comment: "",
  });

  const [commentUserProfiles, setCommentUserProfiles] = useState({});

  const fetchCommentUserProfiles = async () => {
    const userProfiles = {};

    // Loop through each comment and fetch the user data for each userID
    const promises = post.comments.map(async (comment) => {
      if (comment.user) {
        const res = await axios.get(`http://127.0.0.1:8000/main/users/${comment.user}/`);
        userProfiles[comment.user] = res.data;
      }
    });

    // Wait for all API calls to complete
    await Promise.all(promises);

    // Set the profile data once all users are fetched
    setCommentUserProfiles(userProfiles);
  };




  const handleCreateCommentChange = (e) => {
    const { name, value } = e.target;
    setCreateComment({ ...createComment, [name]: value });
  };

  const handleCreateCommentSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    console.log(userId)
    const commentData = {
      post: post.id, // Assuming 'post' contains an 'id' field
      user: userId ? userId : null, // Set to null if userid is not available
      comment: createComment.comment,
      reply: "", // Handle reply logic as needed
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/Blog/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        console.log("Comment submitted successfully.");
        setCreateComment({ comment: "" }); // Reset form after submission
      } else {
        console.error("Error submitting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    if (post.comments.length > 0) {
      fetchCommentUserProfiles();
    }
  }, [post.comments]);
  return (
    <>
      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-12">

              <h1 className="text-center">{post.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-2">
              <div className="text-start text-lg-center mb-5">

                {/* <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                  {post.profile?.full_name}
                </a> */}
                {/* <p>{post.profile?.bio}</p> */}
                <ul className="list-inline list-unstyled">
                  <li className="list-inline-item d-lg-block my-lg-2 text-start">
                    <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
                  </li>
                  <li className="list-inline-item d-lg-block my-lg-2 text-start">
                    <i className="fas fa-eye"></i> {post.view} Views
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-10 mb-5">

            <img
                  className="d-block mx-auto my-4"
                  src={post.image || "https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"}
                  style={{
                    width: "100%", // Full width to take up the blog's space
                    maxWidth: "750px", // Optional max width to prevent it from being too large on wide screens
                    height: "auto", // Maintain aspect ratio
                    objectFit: "cover",
                    borderRadius: "5px" // Slight rounding for a neat effect
                  }}
                  alt="Blog post"
                />
            <p dangerouslySetInnerHTML={{ __html: post.description }}
                style={{
                  marginLeft: '50px',
                  fontSize: '25px', // Adjust the size as needed
                  lineHeight: '1.5', // Increases spacing between lines for readability
                  fontFamily: 'Arial, sans-serif', // Change to a suitable font family
                  color: 'white', // Adjust the text color
                }}
              ></p>

              <hr />

              <div style={{ backgroundColor: "black", color: "white", padding: "20px" }}>
                <h3>{post.comments?.length} comments</h3>
                {post.comments?.map((c, index) => {
                  const userProfile = commentUserProfiles[c.user]; // Get the user's profile from the fetched data

                  return (
                    <div key={index} className="my-4 d-flex p-3 mb-3 rounded" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                      <img
                        className="avatar avatar-md rounded-circle float-start me-3"
                        src={
                          userProfile?.image ||
                          "https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                        } // Fallback to default image if not available
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        alt="avatar"
                      />
                      <div>
                        <div className="mb-2">
                          <span className="fw-bold">
                            {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "Loading..."}
                          </span>
                          <br />
                          <span className="text-muted" style={{ color: "#b0b0b0" }}>
                            {userProfile?.email || "Loading..."}
                          </span>
                        </div>
                        <p className="fw-bold">{c.comment}</p>
                        <span className="me-3 small" style={{ color: "#b0b0b0" }}>
                          {moment(c.date).format("DD MMM, YYYY")}
                        </span>
                        {c.reply && <p className="" style={{ color: "white" }}>Reply: {c.reply}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply START */}
              <div className="p-3 rounded" style={{ backgroundColor: "black", color: "white" }}>
                <h3 className="fw-bold">Leave a reply</h3>
                <small>Your email address will not be published. Required fields are marked *</small>
                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                  <div className="col-12">
                    <label className="form-label" style={{ color: "white" }}>Write Comment *</label>
                    <textarea
                      onChange={handleCreateCommentChange}
                      name="comment"
                      value={createComment.comment}
                      className="form-control"
                      rows={4}
                      required
                      style={{ backgroundColor: "#333", color: "white", borderColor: "#444" }} // Darker textarea background
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Post comment <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reply END */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Detail;

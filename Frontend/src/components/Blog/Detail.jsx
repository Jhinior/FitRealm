import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import "../../assets/styles/PostDetails.css";

function Detail() {
  const { id: postId } = useParams();
  const token = localStorage.getItem("token");
  const [post, setPost] = useState(null);
  const [createComment, setCreateComment] = useState({ comment: "" });
  const [commentUserProfiles, setCommentUserProfiles] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/Blog/posts/${postId}/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPost();
  }, [postId, token]);

  useEffect(() => {
    if (post && post.comments.length > 0) {
      fetchCommentUserProfiles();
    }
  }, [post]);

  const fetchCommentUserProfiles = async () => {
    const userProfiles = {};
    const promises = post.comments.map(async (comment) => {
      if (comment.user) {
        const res = await axios.get(`http://127.0.0.1:8000/main/users/${comment.user}/`, {
          headers: { Authorization: `token ${token}` },
        });
        userProfiles[comment.user] = res.data;
      }
    });

    await Promise.all(promises);
    setCommentUserProfiles(userProfiles);
  };

  const handleCommentChange = (e) => {
    setCreateComment({ comment: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const commentData = {
      post: post.id,
      user: userId ? userId : null,
      comment: createComment.comment,
      reply: "",
    };

    try {
      await axios.post(`http://127.0.0.1:8000/Blog/comments/`, commentData, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      setCreateComment({ comment: "" });

      const updatedPost = await axios.get(`http://127.0.0.1:8000/Blog/posts/${postId}/`, {
        headers: { Authorization: `token ${token}` },
      });
      setPost(updatedPost.data);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

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
                  width: "100%",
                  maxWidth: "750px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
                alt="Blog post"
              />
              <p
                style={{
                  marginLeft: '50px',
                  fontSize: '25px',
                  lineHeight: '1.5',
                  fontFamily: 'Arial, sans-serif',
                  color: 'white',
                }}
              >
                {post.description}
              </p>

              <hr />

              <div style={{ backgroundColor: "black", color: "white", padding: "20px" }}>
                <h3>{post.comments.length} comments</h3>
                {post.comments.map((c, index) => {
                  const userProfile = commentUserProfiles[c.user];

                  return (
                    <div key={index} className="my-4 d-flex p-3 mb-3 rounded" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                      <img
                        className="avatar avatar-md rounded-circle float-start me-3"
                        src={
                          userProfile?.image ||
                          "https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                        }
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
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded" style={{ backgroundColor: "black", color: "white" }}>
                <h3 className="fw-bold">Leave a reply</h3>
                <small>Your email address will not be published. Required fields are marked *</small>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    className="form-control my-2"
                    rows="4"
                    value={createComment.comment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment here..."
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary">
                    Post Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Detail;

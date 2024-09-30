import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";

function Detail() {
  const location = useLocation();
  const post = location.state?.post; // Get the post data passed from the Blogs component
  console.log(post);
  if (!post) {
    return <div>Post not found!</div>; // Handle case where post data is not available
  }

  const [createComment, setCreateComment] = useState({
    full_name: "",
    email: "",
    comment: "",
  });

  const handleCreateCommentChange = (e) => {
    const { name, value } = e.target;
    setCreateComment({ ...createComment, [name]: value });
  };

  const handleCreateCommentSubmit = (e) => {
    e.preventDefault();
    // Logic to handle comment submission
    console.log("Comment submitted:", createComment);
    // Reset form after submission
    setCreateComment({ full_name: "", email: "", comment: "" });
  };

  return (
    <>
      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <a href="#" className="badge bg-danger mb-2 text-decoration-none">
                <i className="small fw-bold" />
                {post.category?.title}
              </a>
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
                <div className="avatar avatar-xl">
                  <img
                    className="avatar-img"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    src={post.profile?.image}
                    alt="avatar"
                  />
                </div>
                <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                  {post.profile?.full_name}
                </a>
                <p>{post.profile?.bio}</p>
                <hr className="d-none d-lg-block " />
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
              <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
              <hr />

              <div>
                <h3>{post.comments?.length} comments</h3>
                {post.comments?.map((c, index) => (
                  <div key={index} className="my-4 d-flex bg-light p-3 mb-3 rounded">
                    <img
                      className="avatar avatar-md rounded-circle float-start me-3"
                      src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }}
                      alt="avatar"
                    />
                    <div>
                      <div className="mb-2">
                        <h5 className="m-0">{c.name}</h5>
                        <span className="me-3 small">{moment(c.date).format("DD MMM, YYYY")}</span>
                      </div>
                      <p className="fw-bold">{c.comment}</p>
                      {c.reply && <p className="">Reply: {c.reply}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply START */}
              <div className="bg-light p-3 rounded">
                <h3 className="fw-bold">Leave a reply</h3>
                <small>Your email address will not be published. Required fields are marked *</small>
                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input
                      onChange={handleCreateCommentChange}
                      name="full_name"
                      value={createComment.full_name}
                      type="text"
                      className="form-control"
                      aria-label="First name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      onChange={handleCreateCommentChange}
                      name="email"
                      value={createComment.email}
                      type="email"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Write Comment *</label>
                    <textarea
                      onChange={handleCreateCommentChange}
                      name="comment"
                      value={createComment.comment}
                      className="form-control"
                      rows={4}
                      required
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

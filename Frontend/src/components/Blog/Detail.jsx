import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../plugin/Toast";

function Detail() {
    const [post, setPost] = useState(null); // Default to null to avoid confusion
    const [tags, setTags] = useState([]);
    const [createComment, setCreateComment] = useState({ full_name: "", email: "", comment: "" });

    const param = useParams();

    // Fetch post data
    const fetchPost = async () => {
        try {
            const response = await apiInstance.get(`post/detail/${param.slug}/`);
            setPost(response.data);

            // Assuming tags are a comma-separated string
            if (response.data?.tags) {
                setTags(response.data.tags.split(","));
            }
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [param.slug]);

    // Handle form input change
    const handleCreateCommentChange = (event) => {
        setCreateComment({
            ...createComment,
            [event.target.name]: event.target.value,
        });
    };

    // Submit comment
    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();

        const jsonData = {
            post_id: post?.id,  // Safely access post ID
            name: createComment.full_name,
            email: createComment.email,
            comment: createComment.comment,
        };

        try {
            await apiInstance.post(`post/comment-post/`, jsonData);
            Toast("success", "Comment Posted.", "");

            // Optimistically update comments without refetching the post
            setPost((prev) => ({
                ...prev,
                comments: [...prev.comments, { name: createComment.full_name, comment: createComment.comment, date: new Date() }],
            }));

            // Clear the comment form
            setCreateComment({ full_name: "", email: "", comment: "" });
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    // Render conditionally to handle null post
    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>

            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {post.category && (
                                <span className="badge bg-danger mb-2 text-decoration-none">
                                    {post.category.title}
                                </span>
                            )}
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5">
                                <div className="avatar avatar-xl">
                                    <img
                                        className="avatar-img"
                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                                        src={post.profile?.image || "/default-avatar.jpg"} // Fallback if no image
                                        alt="avatar"
                                    />
                                </div>
                                <p>{post.profile?.bio}</p>

                                <ul className="list-unstyled">
                                    <li><i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}</li>
                                    <li><i className="fas fa-heart"></i> {post.likes?.length} Likes</li>
                                    <li><i className="fas fa-eye"></i> {post.view} Views</li>
                                </ul>

                                {/* Tags */}
                                {tags.length > 0 && (
                                    <ul className="list-inline">
                                        {tags.map((t, index) => (
                                            <li key={index} className="list-inline-item">
                                                <span className="text-body fw-bold">#{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-10 mb-5">
                            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>

                            <hr />
                            <div className="d-flex py-4">
                                <img
                                    className="avatar avatar-xxl me-4"
                                    src={post.profile?.image || "/default-avatar.jpg"} // Fallback if no image
                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                                    alt="profile"
                                />
                                <div>
                                    <h4>{post.profile?.full_name}</h4>
                                    <p>{post.profile?.about}</p>
                                    <ul className="nav">
                                        {post.profile?.facebook && (
                                            <li className="nav-item">
                                                <a className="nav-link" href={post.profile.facebook} target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-facebook-square"></i>
                                                </a>
                                            </li>
                                        )}
                                        {post.profile?.twitter && (
                                            <li className="nav-item">
                                                <a className="nav-link" href={post.profile.twitter} target="_blank" rel="noopener noreferrer">
                                                    <i className="fab fa-twitter-square"></i>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <h3>{post.comments?.length} comments</h3>
                                {post.comments?.map((c, index) => (
                                    <div key={index} className="my-4 bg-light p-3 rounded">
                                        <div className="d-flex">
                                            <img
                                                className="avatar avatar-md rounded-circle me-3"
                                                src="/default-avatar.jpg" // You can dynamically load user's avatar if available
                                                style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }}
                                                alt="comment avatar"
                                            />
                                            <div>
                                                <h5>{c.name}</h5>
                                                <p>{c.comment}</p>
                                                <span className="small">{moment(c.date).format("DD MMM, YYYY")}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comment Form */}
                            <div className="bg-light p-3 rounded">
                                <h3>Leave a reply</h3>
                                <form onSubmit={handleCreateCommentSubmit}>
                                    <div className="mb-3">
                                        <label>Name *</label>
                                        <input onChange={handleCreateCommentChange} name="full_name" value={createComment.full_name} type="text" className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email *</label>
                                        <input onChange={handleCreateCommentChange} name="email" value={createComment.email} type="email" className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label>Comment *</label>
                                        <textarea onChange={handleCreateCommentChange} name="comment" value={createComment.comment} className="form-control" rows={4} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Post comment <i className="fas fa-paper-plane"></i>
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

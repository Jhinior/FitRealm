// src/components/BookmarkComponent.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookmarkComponent = ({ userId }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/Blog/bookmarks/${userId}/`);
                setBookmarks(response.data);
                await fetchPosts(response.data); // Fetch posts for the bookmarks
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchPosts = async (bookmarksData) => {
            try {
                const postPromises = bookmarksData.map(bookmark =>
                    axios.get(`http://127.0.0.1:8000/Blog/posts/${bookmark.post}/`)
                );
                const postResponses = await Promise.all(postPromises);
                setPosts(postResponses.map(res => res.data)); // Extract post data from responses
            } catch (err) {
                setError(err);
            }
        };

        fetchBookmarks();
    }, [userId]);


    const handleToggleLike = async (id) => {
        try {
          if (!token) {
            console.error("User is not authenticated. No token found.");
            return;
          }
    
          const response = await axios.post(
            `http://127.0.0.1:8000/Blog/posts/${id}/like/`,
            {},
            { headers: { Authorization: `token ${token}` } }
          );
    
          const { liked, likes_count } = response.data;
    
          setPosts(posts.map(post => 
            post.id === id ? { ...post, like_count: likes_count, liked } : post
          ));
        } catch (error) {
          console.error("Error updating like count:", error.response || error.message);
        }
      };



      const handlePostClick = async (id) => {
        try {
          const post = posts.find(post => post.id === id);
          const updatedViewCount = post.view + 1;
    
          await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
            view: updatedViewCount,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          setPosts(posts.map(post => 
            post.id === id ? { ...post, view: updatedViewCount } : post
          ));
    
          window.location.href = `/Detail/${id}`;
        } catch (error) {
          console.error("Error updating view count:", error);
        }
      };


    if (loading) return <p className="text-center my-4">Loading bookmarks...</p>;
    if (error) return <p className="text-center text-danger my-4">Error loading bookmarks: {error.message}</p>;

    return (
        <div className="container my-5">
            {bookmarks.length === 0 ? (
                <p className="text-center text-muted">No bookmarks found.</p>
            ) : (
                <div className="row g-4">
                    {bookmarks.map((bookmark, index) => {
                        const post = posts[index]; // Get the post corresponding to the bookmark
                        if (!post) return null; // Skip if post is not found

                        return (
                            <div key={bookmark.id} className="col-md-6 col-lg-4">
                                <div
                                    className="card mb-4"
                                    style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
                                    // You can handle post click here if needed
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
                                            {post.title?.slice(0, 32)}
                                            onClick={() => handlePostClick(post.id)}

                                        </h4>
                                        <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
                                            <li>
                                                <span>
                                                    <i className="fas fa-user"></i> {post.user_details.user?.first_name} {post.user_details.user?.last_name}
                                                </span>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {new Date(bookmark.date).toLocaleDateString()}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-comments"></i> {post.comments_count} Comments
                                            </li>
                                            <li className="mt-2">
                                                <i 
                                                className={`fa ${post.liked ? 'fa-thumbs-down' : 'fa-thumbs-up'}`} 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleLike(post.id);
                                                }}
                                                ></i> {post.like_count} {post.liked ? "Unlike" : "Like"}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post.view} Views
                                            </li>
                                        </ul>
                                        {/* Add bookmark button here if necessary */}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookmarkComponent;

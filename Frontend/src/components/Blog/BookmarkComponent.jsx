// src/components/BookmarkComponent.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookmarkComponent = ({ userId }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/Blog/bookmarks/${userId}/`);
                setBookmarks(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [userId]);

    if (loading) return <p className="text-center my-4">Loading bookmarks...</p>;
    if (error) return <p className="text-center text-danger my-4">Error loading bookmarks: {error.message}</p>;

    return (
        <div className="container my-5">
            {bookmarks.length === 0 ? (
                <p className="text-center text-muted">No bookmarks found.</p>
            ) : (
                <div className="row g-4">
                    {bookmarks.map((bookmark) => {
                        const { post, date } = bookmark;

                        return (
                            <div key={bookmark.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <img src={post.image} alt={post.title} className="card-img-top" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text text-truncate">{post.description}</p>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <strong>Status:</strong> {post.status}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Views:</strong> {post.view}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Date Bookmarked:</strong> {new Date(date).toLocaleString()}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-footer">
                                        <h6 className="mb-2">Comments:</h6>
                                        {post.comments.length > 0 ? (
                                            <ul className="list-unstyled">
                                                {post.comments.map((comment) => (
                                                    <li key={comment.id} className="mb-1">
                                                        <strong>User {comment.user}:</strong> {comment.comment}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No comments available.</p>
                                        )}
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

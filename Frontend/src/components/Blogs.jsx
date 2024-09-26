import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const Blogs = () => {
  const blogs = [
    {
      id: 6,
      title: "hand",
      description: "",
      tags: "push",
      image: null,
      status: "Active",
      view: 0,
      likes: [],
      slug: "hand-dY",
      date: "2024-09-23T15:20:52.682286Z",
      user: {
        id: 1,
        email: "mahmoud@gmail.com",
        username: "mahmoud",
        mobile: null,
        full_name: "mahmoud",
      },
      category: {
        id: 1,
        title: "sport",
        slug: "sport",
        image: "http://127.0.0.1:8000/uploads/image/Screenshot_from_2024-08-23_21-12-19.png",
      },
      comments: [
        {
          id: 2,
          post: 6,
          name: "ahemd",
          email: "ahemd@gmail.com",
          comment: "good",
          reply: "",
          date: "2024-09-25T14:39:58.309931Z",
        },
        {
          id: 1,
          post: 6,
          name: "mahmoud",
          email: "mahmoud@gmail.com",
          comment: "best",
          reply: "best best",
          date: "2024-09-23T15:22:03.455234Z",
        },
      ],
    },
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        {blogs.map((blog) => (
          <div key={blog.id} className="col-12 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <img
                src={blog.category.image}
                alt="category"
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{blog.title}</h5>
                <p className="card-text text-muted">by {blog.user.full_name}</p>
                <p className="card-text">{blog.description || "No description available"}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <p className="text-muted small mb-0">Tags: <span className="badge bg-primary">{blog.tags}</span></p>
                <p className="text-muted small mb-0">Date: {new Date(blog.date).toLocaleDateString()}</p>
                <div className="mt-2 d-flex justify-content-between">
                  <button className="btn btn-link text-decoration-none p-0">Read more</button>
                  <p className="text-muted small mb-0">{blog.comments.length} Comments</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

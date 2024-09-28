import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Blogs = ({ userRole = 'trainer' }) => {
  const [showForm, setShowForm] = useState(false); // Controls the visibility of the form
  const [newBlog, setNewBlog] = useState({
    title: '',
    body: '',
  });
  //   // const [blogs, setBlogs] = useState([])
//   // useEffect(async()=>{
//   //   try{
//   //     const response = await axios.get('http://127.0.0.1:8000/api')
//   //     setBlogs(response.data.data.Blogs)
//   //   }catch(err){
//   //     console.log(err);
//   //   }
//   // },(blogs))
  
  const [blogs, setBlogs] = useState([
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
    },
  ]);

  // Handle form submission (mocked API request for now)
  const handleAddBlog = (e) => {
    e.preventDefault();
    const newBlogData = {
      id: blogs.length + 1, // This would be generated on the server
      title: newBlog.title,
      description: newBlog.body,
      date: new Date().toISOString(),
      user: { full_name: "Trainer Name" }, // Replace with the logged-in user's name
      category: {
        id: 1,
        title: "Uncategorized",
        image: "https://via.placeholder.com/150", // Placeholder image
      },
      comments: [],
    };

    // Append the new blog to the existing blogs
    setBlogs([newBlogData, ...blogs]);

    // Reset the form fields
    setNewBlog({ title: '', body: '' });
    setShowForm(false); // Hide the form after submission
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Conditionally show 'Add Blog' button if user is a trainer */}
        {userRole === 'trainer' && (
          <div className="col-12 mb-4">
            <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Blog'}
            </button>

            {/* Conditionally render the blog form */}
            {showForm && (
              <form onSubmit={handleAddBlog} className="mb-4">
                <div className="form-group mb-3">
                  <label htmlFor="blogTitle">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="blogTitle"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="blogBody">Body</label>
                  <textarea
                    className="form-control"
                    id="blogBody"
                    rows="5"
                    value={newBlog.body}
                    onChange={(e) => setNewBlog({ ...newBlog, body: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success">Submit Blog</button>
              </form>
            )}
          </div>
        )}

        {/* Display all blogs */}
        {blogs.map((blog) => (
          <div key={blog.id} className="col-12 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold">{blog.title}</h5>
                <p className="card-text text-muted">by {blog.user.full_name}</p>
                <p className="card-text">{blog.description || "No description available"}</p>
              </div>
              <div className="card-footer bg-white border-0">
                <p className="text-muted small mb-0">Date: {new Date(blog.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

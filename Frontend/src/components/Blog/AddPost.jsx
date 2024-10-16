import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


function AddPost() {
    const [post, setCreatePost] = useState({
        title: "",
        description: "",
        tags: "",
        image: "",
        status: null,
        view: null,
        slug: "",
        user: null,
        category: null,
    });
    const [imagePreview, setImagePreview] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    // Fetch categories from the API
    const fetchCategory = async () => {
        const response = await fetch(`http://127.0.0.1:8000/Blog/categories/`,{
                                        headers: {
                                          Authorization: `token ${token}`,
                                        },
                                      });
        const data = await response.json();
        setCategoryList(data);
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleCreatePostChange = (event) => {
        setCreatePost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        setCreatePost({
            ...post,
            image: selectedFile,
        });
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    
    const handleCreatePost = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!post.title || !post.description) {
            alert("Title and Description are required to create a post.");
            setIsLoading(false);
            return;
        }

        // Generate the slug dynamically from the title
        const slug = post.title.trim().toLowerCase().replace(/\s+/g, "-");

        // Use FormData to handle file upload
        const formData = new FormData();
        formData.append("title", post.title);
        formData.append("description", post.description);
        formData.append("tags", post.tags);
        formData.append("image", post.image);
        formData.append("status", "Active");
        formData.append("view", 0);
        formData.append("slug", slug);
        formData.append("user", userId);
        formData.append("category", post.category);

        try {
            console.log("Sending post data:", formData);
            const response = await fetch("http://127.0.0.1:8000/Blog/posts/", {
                method: "POST",
                headers: {
                    Authorization: `token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                Swal.fire({
                    icon: "success",
                    title: "Post created successfully.",
                });
                navigate("/Blogs");
            } else {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                Swal.fire({
                    icon: "error",
                    title: "Failed to create post.",
                    text: errorData.detail || "An unknown error occurred.",
                });
            }
        } catch (error) {
            console.error("Error creating post:", error);
            Swal.fire({
                icon: "error",
                title: "Error occurred while creating post.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <section className="pt-5 pb-5">
            <div className="container">
                <div className="row mt-0 mt-md-4">
                    <div className="col-lg-12 col-md-8 col-12">
                        <section className="py-4 py-lg-6 bg rounded-3" style={{backgroundColor: "black"}}>
                            <div className="container">
                                <div className="row">
                                    <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                        <div className="d-lg-flex align-items-center justify-content-between">
                                            <div className="mb-4 mb-lg-0">
                                                <h1 className="text-white mb-1">Create Blog Post</h1>
                                                <p className="mb-0 text-white lead">Use the article builder below to write your article.</p>
                                            </div>
                                            <div>
                                                <Link to="/Blogs/" className="btn" style={{ backgroundColor: "white" }}>
                                                    <i className="fas fa-arrow-left"></i> Back to Posts
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <form onSubmit={handleCreatePost} className="pb-8 mt-5">
                            <div className="card mb-3">
                                <div className="card-header border-bottom px-4 py-3">
                                    <h4 className="mb-0" style={{color: 'white'}}>Basic Information</h4>
                                </div>
                                <div className="card-body">
                                    <label htmlFor="postThumbnail" className="form-label">Preview</label>
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "330px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                        className="mb-4"
                                        src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                        alt=""
                                    />
                                    <div className="mb-3">
                                        <label htmlFor="postThumbnail" className="form-label">Thumbnail</label>
                                        <input onChange={handleFileChange} name="image" id="postThumbnail" className="form-control" type="file" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input onChange={handleCreatePostChange} name="title" className="form-control" type="text" />
                                        <small>Write a 60 character post title.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Post category</label>
                                        <select name="category" onChange={handleCreatePostChange} className="form-select">
                                            <option value="">-------------</option>
                                            {categoryList?.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.title}
                                                </option>
                                            ))}
                                        </select>
                                        <small>Help people find your posts by choosing categories that represent your post.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Post Description</label>
                                        <textarea onChange={handleCreatePostChange} name="description" className="form-control" rows="10"></textarea>
                                        <small>A brief summary of your posts.</small>
                                    </div>
                                    <label className="form-label">Tags</label>
                                    <input onChange={handleCreatePostChange} name="tags" className="form-control" type="text" placeholder="health, medicine, fitness" />
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select onChange={handleCreatePostChange} name="status" className="form-select">
                                            <option value="Active">Active</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Disabled">Disabled</option>
                                        </select>
                                        <small>Choose the status of your post.</small>
                                    </div>
                                </div>
                            </div>
                            {isLoading ? (
                                <button className="btn btn-lg btn-secondary w-100 mt-2" disabled>
                                    Creating Post... <i className="fas fa-spinner fa-spin"></i>
                                </button>
                            ) : (
                                <button className="btn btn-lg btn-success w-100 mt-2" type="submit" >
                                    Create Post <i className="fas fa-check-circle"></i>
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddPost;

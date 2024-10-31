// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const Blogs = () => {
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [dateFilter, setDateFilter] = useState("newest"); 
//   const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // State for bookmarked posts
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId"); // Get user ID from local storage
//   // const [trainer, setTrainer] = useState(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPosts(response.data);

//         const uniqueCategories = Array.from(
//           new Set(response.data.map((post) => post.category_name))
//         );
//         setCategories(uniqueCategories);

//         // Fetch bookmarked posts for the user
//         const bookmarksResponse = await axios.get(`http://127.0.0.1:8000/Blog/bookmarks/?user=${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts(bookmarksResponse.data.map(bookmark => bookmark.post));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [token, userId]);


  
//   const handleAddLike = async (id) =>{
//     try {
//       const likeResponse = await axios.get(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const currentLikeCount = postResponse.data.like;
//       await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         like: currentLikeCount + 1,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (error) {
//       console.error("Error updating view count:", error);
//     }
//   }
  

//   const handlePostClick = async (id) => {
//     try {
//       const postResponse = await axios.get(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       const currentViewCount = postResponse.data.view;
  
//       await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         view: currentViewCount + 1,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       window.location.href = `/Detail/${id}`;
//     } catch (error) {
//       console.error("Error updating view count:", error);
//     }
//     };

//   const handleBookmarkToggle = async (postId) => {
//     if (bookmarkedPosts.includes(postId)) {
//       // Remove bookmark
//       try {
//         await axios.delete(`http://127.0.0.1:8000/Blog/bookmarks/${userId}/${postId}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
//       } catch (error) {
//         console.error("Error removing bookmark:", error);
//       }
//     } else {
//       // Add bookmark
//       try {
//         await axios.post(`http://127.0.0.1:8000/Blog/bookmarks/`, {
//           user: userId,
//           post: postId,
//         }, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts([...bookmarkedPosts, postId]);
//       } catch (error) {
//         console.error("Error adding bookmark:", error);
//       }
//     }
//   };

//   const renderPostCard = (post) => (
//     <div
//       className="card mb-4"
//       style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
//       onClick={() => handlePostClick(post.id)}
//     >
//       <div className="card-fold position-relative">
//         <img
//           className="card-img"
//           style={{ width: "100%", height: "160px", objectFit: "cover" }}
//           src={post.image}
//           alt={post.title}
//         />
//       </div>
//       <div className="card-body px-3 pt-3">
//         <h4 className="card-title fw-bold text-decoration-none">
//           {post.title?.slice(0, 32) }
//         </h4>
//         <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
//           <li>
//             <span className="">
//               <i className="fas fa-user"></i> {post.user_details.user?.first_name} {post.user_details.user?.last_name}
//             </span>
//           </li>
//           <li className="mt-2">
//             <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
//           </li>
//           {post.comments_count || (
//             <li className="mt-2">
//               <i className="fas fa-comments"></i> {post.comments_count} Comments
//             </li>
//           )}
          
//           {post.likes_count || (
//             <li className="mt-2">
//               <i class="fa fa-thumbs-up" onClick={(e) => {
//             e.stopPropagation(); // Prevent card click
//             handleAddLike(post.id);
//           }}></i> {post.likes_count} Likes
//             </li>
//           )} 
    
//           <li className="mt-2">
//             <i className="fas fa-eye"></i> {post.view} Views
//           </li>

//         </ul>
//         <button 
//           className={`btn ${bookmarkedPosts.includes(post.id) ? 'btn-danger' : 'btn-secondary'}`}
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent card click
//             handleBookmarkToggle(post.id);
//           }}
//         >
//           {bookmarkedPosts.includes(post.id) ? 'Unbookmark' : 'Bookmark'}
//         </button>
//       </div>
//     </div>
//   );

//   const filteredPosts = posts.filter((post) => {
//     const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory ? post.category_name === selectedCategory : true;
//     return matchesSearchTerm && matchesCategory;
//   });

//   // Sort filtered posts based on the selected date filter
//   const sortedPosts = filteredPosts.sort((a, b) => {
//     const dateA = new Date(a.date);
//     const dateB = new Date(b.date);
//     return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
//   });

//   return (
//     <div>
//       <section className="pt-4 pb-0">
//         <div className="container">
//           <h2 className="text-start">All Posts</h2>
//           <input
//             type="text"
//             className="form-control mb-4"
//             placeholder="Search posts by title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="form-select mb-4"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//           <select
//             className="form-select mb-4"
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//           </select>

//           <div className="row">
//             {sortedPosts.length === 0 ? (
//               <div className="col-12">No posts found.</div>
//             ) : (
//               sortedPosts.map((p) => (
//                 <div className="col-sm-6 col-lg-3" key={p.id}>
//                   {renderPostCard(p)}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Blogs;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const Blogs = () => {
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [dateFilter, setDateFilter] = useState("newest"); 
//   const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // State for bookmarked posts
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId"); // Get user ID from local storage

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPosts(response.data);

//         const uniqueCategories = Array.from(
//           new Set(response.data.map((post) => post.category_name))
//         );
//         setCategories(uniqueCategories);

//         // Fetch bookmarked posts for the user
//         const bookmarksResponse = await axios.get(`http://127.0.0.1:8000/Blog/bookmarks/?user=${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts(bookmarksResponse.data.map(bookmark => bookmark.post));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [token, userId]);

//   const handleAddLike = async (id) => {
//     try {
//       const likeResponse = await axios.get(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const currentLikeCount = likeResponse.data.like;
//       await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/like/`, 
//         {
//           "liked": true,
//           "likes_count": currentLikeCount + 1
//         }
//       , {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Update the like count in the state
//       setPosts(posts.map(post => 
//         post.id === id ? { ...post, like: currentLikeCount + 1 } : post
//       ));
//     } catch (error) {
//       console.error("Error updating like count:", error);
//     }
//   };

//   const handlePostClick = async (id) => {
//     try {
//       const postResponse = await axios.get(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       const currentViewCount = postResponse.data.view;
  
//       await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
//         view: currentViewCount + 1,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       window.location.href = `/Detail/${id}`;
//     } catch (error) {
//       console.error("Error updating view count:", error);
//     }
//   };

//   const handleBookmarkToggle = async (postId) => {
//     if (bookmarkedPosts.includes(postId)) {
//       // Remove bookmark
//       try {
//         await axios.delete(`http://127.0.0.1:8000/Blog/bookmarks/${userId}/${postId}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
//       } catch (error) {
//         console.error("Error removing bookmark:", error);
//       }
//     } else {
//       // Add bookmark
//       try {
//         await axios.post(`http://127.0.0.1:8000/Blog/bookmarks/`, {
//           user: userId,
//           post: postId,
//         }, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookmarkedPosts([...bookmarkedPosts, postId]);
//       } catch (error) {
//         console.error("Error adding bookmark:", error);
//       }
//     }
//   };

//   const renderPostCard = (post) => (
//     <div
//       className="card mb-4"
//       style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
//       onClick={() => handlePostClick(post.id)}
//     >
//       <div className="card-fold position-relative">
//         <img
//           className="card-img"
//           style={{ width: "100%", height: "160px", objectFit: "cover" }}
//           src={post.image}
//           alt={post.title}
//         />
//       </div>
//       <div className="card-body px-3 pt-3">
//         <h4 className="card-title fw-bold text-decoration-none">
//           {post.title?.slice(0, 32) }
//         </h4>
//         <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
//           <li>
//             <span className="">
//               <i className="fas fa-user"></i> {post.user_details.user?.first_name} {post.user_details.user?.last_name}
//             </span>
//           </li>
//           <li className="mt-2">
//             <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
//           </li>
//           {post.comments_count || (
//             <li className="mt-2">
//               <i className="fas fa-comments"></i> {post.comments_count} Comments
//             </li>
//           )}
          
//           {post.likes_count || (
//             <li className="mt-2">
//               <i className="fa fa-thumbs-up" onClick={(e) => {
//                 e.stopPropagation(); // Prevent card click
//                 handleAddLike(post.id);
//               }}></i> {post.likes_count} Likes
//             </li>
//           )} 
    
//           <li className="mt-2">
//             <i className="fas fa-eye"></i> {post.view} Views
//           </li>
//         </ul>
//         <button 
//           className={`btn ${bookmarkedPosts.includes(post.id) ? 'btn-danger' : 'btn-secondary'}`}
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent card click
//             handleBookmarkToggle(post.id);
//           }}
//         >
//           {bookmarkedPosts.includes(post.id) ? 'Unbookmark' : 'Bookmark'}
//         </button>
//       </div>
//     </div>
//   );

//   const filteredPosts = posts.filter((post) => {
//     const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory ? post.category_name === selectedCategory : true;
//     return matchesSearchTerm && matchesCategory;
//   });

//   // Sort filtered posts based on the selected date filter
//   const sortedPosts = filteredPosts.sort((a, b) => {
//     const dateA = new Date(a.date);
//     const dateB = new Date(b.date);
//     return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
//   });

//   return (
//     <div>
//       <section className="pt-4 pb-0">
//         <div className="container">
//           <h2 className="text-start">All Posts</h2>
//           <input
//             type="text"
//             className="form-control mb-4"
//             placeholder="Search posts by title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="form-select mb-4"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {categories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//           <select
//             className="form-select mb-4"
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//           </select>

//           <div className="row">
//             {sortedPosts.length === 0 ? (
//               <div className="col-12">No posts found.</div>
//             ) : (
//               sortedPosts.map((p) => (
//                 <div className="col-sm-6 col-lg-3" key={p.id}>
//                   {renderPostCard(p)}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Blogs;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("newest"); 
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); 
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/Blog/posts/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);

        const uniqueCategories = Array.from(
          new Set(response.data.map((post) => post.category_name))
        );
        setCategories(uniqueCategories);

        const bookmarksResponse = await axios.get(`http://127.0.0.1:8000/Blog/bookmarks/?user=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedPosts(bookmarksResponse.data.map(bookmark => bookmark.post));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, userId]);


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

  const handleBookmarkToggle = async (postId) => {
    if (bookmarkedPosts.includes(postId)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/Blog/bookmarks/${userId}/${postId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
      } catch (error) {
        console.error("Error removing bookmark:", error);
      }
    } else {
      try {
        await axios.post(`http://127.0.0.1:8000/Blog/bookmarks/`, {
          user: userId,
          post: postId,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedPosts([...bookmarkedPosts, postId]);
      } catch (error) {
        console.error("Error adding bookmark:", error);
      }
    }
  };

  const renderPostCard = (post) => (
    <div
      className="card mb-4"
      style={{ border: "2px solid white", marginTop: "20px", overflow: "hidden", cursor: "pointer" }}
      onClick={() => handlePostClick(post.id)}
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
        </h4>
        <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span>
              <i className="fas fa-user"></i> {post.user_details.user?.first_name} {post.user_details.user?.last_name}
            </span>
          </li>
          <li className="mt-2">
            <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
          </li>
          <li className="mt-2">
            <i className="fas fa-comments"></i> {post.comments_count} Comments
          </li>
          <li className="mt-2">
            <i 
              className={`fa ${post.liked ? 'fa-thumbs-down' : 'fa-thumbs-up'}`} 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleToggleLike(post.id);
              }}
            ></i> {post.like_count} {post.liked ? "Unlike" : "Like"}
          </li>


          <li className="mt-2">
            <i className="fas fa-eye"></i> {post.view} Views
          </li>
        </ul>
        <button 
          className={`btn ${bookmarkedPosts.includes(post.id) ? 'btn-danger' : 'btn-secondary'}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            handleBookmarkToggle(post.id);
          }}
        >
          {bookmarkedPosts.includes(post.id) ? 'Unbookmark' : 'Bookmark'}
        </button>
      </div>
    </div>
  );

  const filteredPosts = posts.filter((post) => {
    const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.category_name === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      <section className="pt-4 pb-0">
        <div className="container">
          <h2 className="text-start">All Posts</h2>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mb-4"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="form-select mb-4"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <div className="row">
            {sortedPosts.length === 0 ? (
              <div className="col-12">No posts found.</div>
            ) : (
              sortedPosts.map((p) => (
                <div className="col-sm-6 col-lg-3" key={p.id}>
                  {renderPostCard(p)}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;

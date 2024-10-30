import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import moment from 'moment';

const TopPostsSection = () => {
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topCommentedResponse, topLikedResponse, topViewedResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_commented/", {
            headers: { Authorization: `token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_liked/", {
            headers: { Authorization: `token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Blog/TopPosts/top_viewed/", {
            headers: { Authorization: `token ${token}` },
          }),
        ]);

        setTopCommentedPosts(topCommentedResponse.data);
        setTopLikedPosts(topLikedResponse.data);
        setTopViewedPosts(topViewedResponse.data);

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

  const handlePostClick = async (id) => {
    try {
      const postResponse = await axios.get(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentViewCount = postResponse.data.view;
      await axios.patch(`http://127.0.0.1:8000/Blog/posts/${id}/`, {
        view: currentViewCount + 1,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
          src={`http://127.0.0.1:8000${post.image}`}
          alt={post.title}
        />
      </div>
      <div className="card-body px-3 pt-3">
        <h4 className="card-title fw-bold text-decoration-none">{post.title?.slice(0, 32)}</h4>
        <ul className="mt-3" style={{ listStyle: "none", padding: 0 }}>
          <li>
            <span className="">
              <i className="fas fa-user"></i> {post.user_details.user?.first_name} {post.user_details.user?.last_name}
            </span>
          </li>
          <li className="mt-2">
            <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
          </li>
          {post.comments_count && (
            <li className="mt-2">
              <i className="fas fa-comments"></i> {post.comments_count} Comments
            </li>
          )}
          {post.likes_count && (
            <li className="mt-2">
              <i className="fas fa-thumbs-up"></i> {post.likes_count} Likes
            </li>
          )}
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

  return (
    <div className="container">
      {/* Top Commented Posts */}
      <section className="pt-4 pb-0">
        <h2 className="text-start">Top Commented Posts</h2>
        <Swiper modules={[Pagination, Navigation]} spaceBetween={20} slidesPerView={3} navigation pagination={{ clickable: true }} breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
          {topCommentedPosts.map((post) => <SwiperSlide key={post.id}>{renderPostCard(post)}</SwiperSlide>)}
        </Swiper>
      </section>

      {/* Top Liked Posts */}
      <section className="pt-4 pb-0">
        <h2 className="text-start">Top Liked Posts</h2>
        <Swiper modules={[Pagination, Navigation]} spaceBetween={20} slidesPerView={3} navigation pagination={{ clickable: true }} breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
          {topLikedPosts.map((post) => <SwiperSlide key={post.id}>{renderPostCard(post)}</SwiperSlide>)}
        </Swiper>
      </section>

      {/* Top Viewed Posts */}
      <section className="pt-4 pb-0">
        <h2 className="text-start">Top Viewed Posts</h2>
        <Swiper modules={[Pagination, Navigation]} spaceBetween={20} slidesPerView={3} navigation pagination={{ clickable: true }} breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
          {topViewedPosts.map((post) => <SwiperSlide key={post.id}>{renderPostCard(post)}</SwiperSlide>)}
        </Swiper>
      </section>
    </div>
  );
};

export default TopPostsSection;

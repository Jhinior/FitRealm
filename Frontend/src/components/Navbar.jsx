import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TrainerList from './TrainerList'; // Import the TrainerList component
import '../assets/styles/Navbar.css';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('userId');
    if (loggedInStatus) {
      setIsLoggedIn(true);
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    if (role === 'user') {
      const response = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setUserName(response.data.first_name);
    } else if (role === 'trainer') {
      const response = await axios.get(`http://127.0.0.1:8000/main/trainers/${userId}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      setUserName(response.data.user.first_name);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ zIndex: '1000' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">FitRealm</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/ProductList">Products</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plans">Plans</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Blogs">Blogs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/TopPostsSection">Top Blogs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/TrainerList">Trainer List</Link> {/* Trainer List link */}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookmarks">Bookmarks</Link> {/* Bookmarks link */}
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <li className="nav-item">
                <a href='/register' className='nav-link text-white custom-hover' id='home-register-button'>Sign In</a>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/userProfile" className="nav-link" id="profile-button">{userName}</a>
                </li>
                <li className="nav-item">
                  <a href="/" onClick={handleLogout} className="nav-link" id="logout-button">Logout</a>
                </li>
                {cartCount > 0 && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      Cart <span className="text-light"> ({cartCount}) </span>
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

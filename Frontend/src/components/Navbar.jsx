import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Retrieve the cart from localStorage on component mount
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length); // Set the count of items in the cart
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">FitRealm</Link> {/* Use Link for internal navigation */}
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
                <Link className="nav-link" to="/home">Home</Link> {/* Use Link for internal navigation */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ProductList">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/plans">Plans</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a href='/register' className='nav-link' id='home-register-button'>register</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  Cart ({cartCount}) {/* Display number of items in the cart */}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

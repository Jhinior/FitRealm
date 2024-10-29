// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// function Navbar() {
//   const [cartCount, setCartCount] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userName, setUserName] = useState();
//   const role = localStorage.getItem('role');
//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const updateCartCount = () => {
//       const cart = JSON.parse(localStorage.getItem('cart')) || [];
//       setCartCount(cart.length);
//     };

//     updateCartCount();
//     window.addEventListener('cartUpdated', updateCartCount);

//     return () => {
//       window.removeEventListener('cartUpdated', updateCartCount);
//     };
//   }, []);

//   useEffect(() => {
//     const loggedInStatus = localStorage.getItem('userId');
//     if (loggedInStatus) {
//       setIsLoggedIn(true);
//       fetchProfile();
//     }
//   }, []);

//   const fetchProfile = async () => {
//     if (role === 'user') {
//       const response = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`, {
//         headers: {
//           Authorization: `token ${token}`,
//         },
//       });
//       setUserName(response.data.first_name);
//     } else if (role === 'trainer') {
//       const response = await axios.get(`http://127.0.0.1:8000/main/trainers/${userId}/`, {
//         headers: {
//           Authorization: `token ${token}`,
//         },
//       });
//       setUserName(response.data.user.first_name);
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.clear();
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-danger sticky-top" style={{ zIndex: '1000' }}>
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/home">FitRealm</Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link className="nav-link" to="/home">Home</Link>
//             </li>
//             {isLoggedIn && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/ProductList">Products</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/plans">Plans</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/Blogs">Blogs</Link>
//                 </li>
//               </>
//             )}
//             <li className="nav-item">
//               <Link className="nav-link" to="/about">About</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">Contact</Link>
//             </li>
//           </ul>
//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//             {!isLoggedIn ? (
//               <li className="nav-item">
//                 <a href='/register' className='nav-link text-white custom-hover' id='home-register-button'>Sign In</a>
//               </li>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <a href="/userProfile" className="nav-link" id="profile-button">{userName}</a>
//                 </li>
//                 <li className="nav-item">
//                   <a href="/" onClick={handleLogout} className="nav-link" id="logout-button">Logout</a>
//                 </li>
//               </>
//             )}
//             <li className="nav-item">
//               <Link className="nav-link" to="/cart">
//                 Cart <span className="text-light"> ({cartCount}) </span>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
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
      
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      } else {
        fetchProfile();
      }
    }
  }, []);

  const fetchProfile = async () => {
    try {
      let response;
      if (role === 'user') {
        response = await axios.get(`http://127.0.0.1:8000/main/users/${userId}/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const name = response.data.first_name;
        setUserName(name);
        localStorage.setItem('userName', name);
      } else if (role === 'trainer') {
        response = await axios.get(`http://127.0.0.1:8000/main/trainers/${userId}/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const name = `${response.data.user.first_name} ${response.data.user.last_name}`.trim();
        setUserName(name);
        localStorage.setItem('userName', name); 
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setUserName(storedEmail);
        localStorage.setItem('userName', storedEmail);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger sticky-top" style={{ zIndex: '1000' }}>
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
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart <span className="text-light"> ({cartCount}) </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
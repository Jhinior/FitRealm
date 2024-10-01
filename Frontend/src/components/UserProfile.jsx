// import { useEffect, useState } from "react";
// import axios from 'axios';
// import '../assets/styles/UserProfile.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function UserProfile() {
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/user");
//         setUser(response.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <div className="container d-flex justify-content-center align-items-center">
//       <div className="card p-4">
//         <img
//           src={user.image}
//           alt={user.firstName}
//           className="card-img-top rounded-circle mb-3"
//         />
//         <div className="card-body text-center">
//           <h2 className="card-title">
//             {user.firstName} {user.lastName}
//           </h2>
//           <p className="card-text">
//             <strong>Weight: </strong> {user.weight} kg
//           </p>
//           <p className="card-text">
//             <strong>Height: </strong> {user.height} cm
//           </p>
//           <p className="card-text">
//             <strong>Email: </strong> {user.email}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;

import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/UserProfile.css';

const UserProfile = () => {
    // State to store user profile data
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        profileImage: '',
        gender: '',
        phone: '',
    });

    // Fetch profile data from the API
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/user/profile');  // Replace with your API endpoint
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

     return (
        <div className="user-profile">
            {/* User Info Section */}
            <div className="user-info-section">
                {/* User Image */}
                <div className="user-image">
                    <img
                        src={userProfile.profileImage}
                        alt="User Profile"
                        className="profile-image"
                    />
                </div>

                {/* User Info */}
                <div className="user-details">
                    <h2>{userProfile.name}</h2>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Gender:</strong> {userProfile.gender}</p>
                    <p><strong>Phone:</strong> {userProfile.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import '../assets/styles/UserProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user");
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card p-4">
        <img
          src={user.image}
          alt={user.firstName}
          className="card-img-top rounded-circle mb-3"
        />
        <div className="card-body text-center">
          <h2 className="card-title">
            {user.firstName} {user.lastName}
          </h2>
          <p className="card-text">
            <strong>Weight: </strong> {user.weight} kg
          </p>
          <p className="card-text">
            <strong>Height: </strong> {user.height} cm
          </p>
          <p className="card-text">
            <strong>Email: </strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

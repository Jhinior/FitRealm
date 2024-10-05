import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SubscriptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { planName, price } = location.state || {}; 

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axiosInstance.post('/api/subscriptions/', {
        plan: id,
      });

      if (response.status === 201) {
        setSuccessMessage('Subscription successful!');
        setTimeout(() => {
          navigate('/'); 
        }, 2000);
      }
    } catch (error) {

      console.error('Error subscribing:', error);
      setErrorMessage('Subscription failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Subscribe to {planName}</h2>
      {planName && <p>Plan Name: {planName}</p>}
      {price && <p>Price: {price} USD</p>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <button type="submit" className="btn btn-primary">Confirm Subscription</button>
      </form>
    </div>
  );
};

export default SubscriptionForm;

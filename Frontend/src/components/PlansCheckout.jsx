// import { useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axiosInstance from '../axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const SubscriptionForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation(); 
//   const { planName, price } = location.state || {}; 

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {

//       const response = await axiosInstance.post('/api/subscriptions/', {
//         plan: id,
//       });

//       if (response.status === 201) {
//         setSuccessMessage('Subscription successful!');
//         setTimeout(() => {
//           navigate('/'); 
//         }, 2000);
//       }
//     } catch (error) {

//       console.error('Error subscribing:', error);
//       setErrorMessage('Subscription failed. Please try again.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Subscribe to {planName}</h2>
//       {planName && <p>Plan Name: {planName}</p>}
//       {price && <p>Price: {price} USD</p>}
//       {successMessage && <div className="alert alert-success">{successMessage}</div>}
//       {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <button type="submit" className="btn btn-primary">Confirm Subscription</button>
//       </form>
//     </div>
//   );
// };

// export default SubscriptionForm;
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  

const Checkoutplans = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      console.log('Cart data:', parsedCart);

      const transformedCart = parsedCart.map((item) => ({
        plan: item.id,  
        user: userId,   
        price: item.price,
        quantity: item.quantity
      }));

      setNewList(transformedCart);
      console.log('Transformed Cart:', transformedCart);
    } else {
      console.log('Cart is empty or not found in localStorage');
    }
  }, [userId]);

  const handleSendOrder = async () => {
    if (newList.length > 0) {
      try {
        const response = await fetch('http://127.0.0.1:8000/subscriptions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newList),  
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Subscription successfully created:', data);

          localStorage.removeItem('cart');
          setCart([]);  
          setNewList([]); 

        } else {
          console.error('Failed to create subscription:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating subscription:', error);
      }
    } else {
      console.log('No items in the cart to send.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      
      {newList.length > 0 && (
        <pre className="bg-light p-3 rounded border">{JSON.stringify(newList, null, 2)}</pre>
      )}

      <button onClick={handleSendOrder} className="btn btn-primary mt-4">
        Submit Order
      </button>
    </div>
  );
};

export default Checkoutplans;
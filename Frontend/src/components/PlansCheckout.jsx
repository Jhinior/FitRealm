import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkoutplans = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // Define totalPrice as a state variable

  const token = localStorage.getItem('token')

  useEffect(() => {
    const renderPayPalButton = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2), // Use totalPrice from state
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log('Transaction completed by', details.payer.name.given_name);
            alert('Transaction successful!');
  
            // After successful transaction, update payment status to True for each order item
            try {
              // Retrieve subscriptionsIds from localStorage
              const subscriptionsIds = JSON.parse(localStorage.getItem('subscriptionsIds')) || [];
  
              // Loop through each subscriptionId and update the payment status to true
              for (const subscriptionsId of subscriptionsIds) {
                const response = await fetch(`http://127.0.0.1:8000/api/subscriptions/${subscriptionsId}/`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${token}`,
                  },
                  body: JSON.stringify({ payment: true }), // Update payment status to true
                });
  
                if (response.ok) {
                  const updatedItem = await response.json();
                  console.log('Payment updated for subscription:', updatedItem);
                } else {
                  console.error('Failed to update payment status for subscription:', subscriptionsId);
                }
              }
  
              // Clear subscriptionsIds from localStorage after successful payment update
              localStorage.removeItem('subscriptionsIds');
  
            } catch (error) {
              console.error('Error updating payment status:', error);
            }
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
        },
      }).render('#paypal-button-container');
    };
  
    // Check if PayPal has loaded and render only once
    if (window.paypal && totalPrice > 0) {
      renderPayPalButton();
    }
  
    // Cleanup function to remove the PayPal button instance
    return () => {
      const container = document.querySelector('#paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Clear the container to prevent multiple instances
      }
    };
  }, [totalPrice]);
  

  // Fetch user ID
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
      console.log('User ID:', storedUserId);
    }
  }, []);

  // Fetch available trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/main/available-trainers/',{
                                        headers: {
                                          Authorization: `token ${token}`,
                                        },
                                      });
        if (!response.ok) throw new Error('Failed to fetch trainers');

        const trainersData = await response.json();
        const availableTrainers = trainersData.filter(trainer => trainer.active_users < 10);
        setTrainers(availableTrainers);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, []);

// Fetch cart details and calculate total price
useEffect(() => {
  const storedCart = localStorage.getItem('programDetails');
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    setCart(parsedCart);

    const transformedCart = [{
      plan: parsedCart.id,
      planName: parsedCart.planName,
      price: parsedCart.price,
      description: parsedCart.description,
      user: userId,
      trainer: selectedTrainer ? selectedTrainer.id : null,
    }];

    setNewList(transformedCart);

    // Ensure the price is a valid number, fallback to 0 if it's not
    const price = parseFloat(parsedCart.price) || 0;
    setTotalPrice(price); // Set total price for PayPal

  } else {
    console.log('Cart is empty or not found in localStorage');
  }
}, [userId, selectedTrainer]);


  const handleSendOrder = async () => {
    if (newList.length > 0) {
      try {
        if (userId === null) {
          console.error('User ID is null. Cannot proceed with the request.');
          return;
        }

        const requestBody = {
          trainer: selectedTrainer ? selectedTrainer.id : null,
          user: userId,
          plan: newList[0].plan,
        };
        console.log('Request Body:', requestBody);

        const response = await fetch('http://127.0.0.1:8000/api/subscriptions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             Authorization: `token ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          const { id } = data;
          console.log('Subscription ID:', id);
        
          // Retrieve existing subscription IDs from localStorage
          const storedSubscriptionsIds = JSON.parse(localStorage.getItem('subscriptionsIds')) || [];
        
          // Add the new subscription ID to the list
          storedSubscriptionsIds.push(id);
        
          // Update localStorage with the new list
          localStorage.setItem('subscriptionsIds', JSON.stringify(storedSubscriptionsIds));
        
          setSuccessMessage('Subscription successfully created!');
          localStorage.removeItem('programDetails');
          setCart([]);
          setNewList([]);
        } else {
          const errorData = await response.json();
          setErrorMessage('Failed to create subscription.');
        }
      } catch (error) {
        setErrorMessage('An error occurred during the subscription process.');
      }
    } else {
      setErrorMessage('No items in the cart to send.');
    }
  };

  return (
    <div className="container mt-5 mb-4 p-2">
      <h2 className="mb-4">Checkout</h2>

      {newList.length > 0 && (
        <div className="bg-dark p-3 rounded border">
          <h4>Plan Details</h4>
          <p><strong>Plan Name:</strong> {newList[0].planName}</p>
          <p><strong>Price:</strong> {newList[0].price} USD</p>
          <p><strong>Description:</strong> {newList[0].description}</p>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="trainerSelect" className="form-label">Select Trainer:</label>
        <select
          id="trainerSelect"
          className="form-select"
          onChange={(e) => setSelectedTrainer(trainers.find(trainer => trainer.id === parseInt(e.target.value)))}
          value={selectedTrainer ? selectedTrainer.id : ''}
        >
          <option value="">Choose a trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.first_name} (Active Trainees: {trainer.active_users})
            </option>
          ))}
        </select>
      </div>

      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <button onClick={handleSendOrder} className="btn btn-primary mt-4">Confirm Subscription</button>

      <div id="paypal-button-container" className="mt-4">Make a Payment</div>
    </div>
  );
};

export default Checkoutplans;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Checkoutplans = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  useEffect(() => {
    const renderPayPalButton = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log('Transaction completed by', details.payer.name.given_name);

            toast.success('Transaction successful! Redirecting to your plans...', {
              onClose: () => {
                navigate('/plans'); 
              },
            });

            try {
              const subscriptionsIds = JSON.parse(localStorage.getItem('subscriptionsIds')) || [];

              for (const subscriptionsId of subscriptionsIds) {
                const response = await fetch(`http://127.0.0.1:8000/api/subscriptions/${subscriptionsId}/`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${token}`,
                  },
                  body: JSON.stringify({ payment: true }),
                });

                if (response.ok) {
                  const updatedItem = await response.json();
                  console.log('Payment updated for subscription:', updatedItem);
                } else {
                  console.error('Failed to update payment status for subscription:', subscriptionsId);
                }
              }

              localStorage.removeItem('subscriptionsIds');

            } catch (error) {
              console.error('Error updating payment status:', error);
            }
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
        },
      }).render('#paypal-button-container');
    };

    if (window.paypal && totalPrice > 0) {
      renderPayPalButton();
    }

    return () => {
      const container = document.querySelector('#paypal-button-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [totalPrice, navigate, token]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
      console.log('User ID:', storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchTrainers = async () => {
      if (newList.length === 0) {
        console.warn("newList is empty, skipping fetchTrainers.");
        return; // Exit if newList is empty
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/main/available-trainers/?plan_type=${newList[0].planName}`, {
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
  }, [newList, token]);

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

      const price = parseFloat(parsedCart.price) || 0;
      setTotalPrice(price);
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

          const storedSubscriptionsIds = JSON.parse(localStorage.getItem('subscriptionsIds')) || [];
          storedSubscriptionsIds.push(id);
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
          onChange={(e) => setSelectedTrainer(trainers.find(trainer => trainer.user.id === parseInt(e.target.value)))}
          value={selectedTrainer ? selectedTrainer.id : ''}
        >
          <option value="">Choose a trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.user.id} value={trainer.user.id}>
              {trainer.user.first_name} (Active Trainees: {trainer.active_users})
            </option>
          ))}
        </select>
      </div>

      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

      <button onClick={handleSendOrder} className="btn btn-primary mt-4">Confirm Subscription</button>

      <div id="paypal-button-container" className="mt-4">Make a Payment</div>

      <ToastContainer />
    </div>
  );
};

export default Checkoutplans;

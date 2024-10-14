import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Retrieve the user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
    }
  }, [userId]);

  // State to hold user details
  const [formData, setFormData] = useState({
    user: userId,
    first_name: '',
    last_name: '',
    email: '',
    address: '',
  });

  // Calculate the total price from the cart
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    // Prepare the data to be sent
    const payload = {
      address: formData.address,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user: userId || null, // Ensure user is set to null if not available
    };
  
    try {
      // Step 1: Send order data to the first API
      const response = await fetch('http://127.0.0.1:8000/order/list/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload
      });
  
      if (response.ok) {
        const orderData = await response.json();
        console.log('Order successfully created:', orderData.id);
  
        // Wait for 15 seconds before sending cart data
        setTimeout(async () => {
          const cartData = JSON.parse(localStorage.getItem('cart')) || [];
          console.log('Cart Data:', cartData);
  
          // Store order item IDs for later use
          const orderItemIds = [];
  
          for (const item of cartData) {
            const orderItemPayload = {
              order: orderData.id || null,
              product: item.id || null,
              price: item.price || null,
              quantity: item.quantity || null,
            };
  
            console.log('Order Item Payload:', orderItemPayload);
  
            const itemsResponse = await fetch('http://127.0.0.1:8000/order/order-items/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderItemPayload),
            });
  
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              console.log('Order item successfully created:', itemsData);
              orderItemIds.push(itemsData.id); // Store the order item ID
            } else {
              console.error('Failed to create order item:', await itemsResponse.json());
            }
          }
  
          // Save order item IDs in localStorage to use in PayPal integration
          localStorage.setItem('orderItemIds', JSON.stringify(orderItemIds));
        }, 15000); // Adjust the delay as necessary
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }
  
    setFormData({
      user: null,
      first_name: '',
      last_name: '',
      email: '',
      address: '',
    });
  };
  
  // PayPal integration
  useEffect(() => {
    // Define the render function for PayPal buttons
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
              const orderItemIds = JSON.parse(localStorage.getItem('orderItemIds')) || [];
    
              for (const orderItemId of orderItemIds) {
                const response = await fetch(`http://127.0.0.1:8000/order/order-items/${orderItemId}/`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ payment: true }), // Update payment to true
                });
    
                if (response.ok) {
                  const updatedItem = await response.json();
                  console.log('Payment updated for order item:', updatedItem);
                } else {
                  console.error('Failed to update payment status for order item:', orderItemId);
                }
              }
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
    if (window.paypal) {
      renderPayPalButton();
    }
  
    // Cleanup function to remove the PayPal button instance
    return () => {
      const container = document.querySelector('#paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Clear the container
      }
    };
  }, [totalPrice]);

  const clearStorage = () =>{
    localStorage.removeItem('cart');
  }
  
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={clearStorage}>Submit Order</button>
        <div id="paypal-button-container"></div>
      </form>
    </div>
  );
};

export default Checkout;

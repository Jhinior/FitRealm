import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);

  // Retrieve the user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
    }
  }, []);

  // Retrieve the cart data and transform it into the desired list format
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      console.log('Cart data:', parsedCart);

      const transformedCart = parsedCart.map((item) => ({
        order: userId,
        product: item.id,
        price: item.price,
        quantity: item.quantity
      }));

      setNewList(transformedCart);
      console.log('Transformed Cart:', transformedCart);
    } else {
      console.log('Cart is empty or not found in localStorage');
    }
  }, [userId]);

  // Function to send the newList data to the API when the button is clicked
  const handleSendOrder = async () => {
    if (newList.length > 0) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/order/orders/${userId}/items/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newList),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Order successfully sent:', data);

          // Clear cart data from localStorage after successful order
          localStorage.removeItem('cart');
          setCart([]);  // Clear the cart from state as well
          setNewList([]); // Clear the transformed list

        } else {
          console.error('Failed to send order:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending order:', error);
      }
    } else {
      console.log('No items in the cart to send.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      
      {/* Display the transformed cart data */}
      {newList.length > 0 && (
        <pre className="bg-light p-3 rounded border">{JSON.stringify(newList, null, 2)}</pre>
      )}

      {/* Button to send the cart data */}
      <button onClick={handleSendOrder} className="btn btn-primary mt-4">
        Submit Order
      </button>
    </div>
  );
};

export default Checkout;

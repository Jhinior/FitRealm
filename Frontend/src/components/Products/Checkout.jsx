import React, { useState, useEffect } from 'react';

const Checkout = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newList, setNewList] = useState([]);

  // Retrieve the user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);  // Set it to state or use it directly
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

      // Transform the cart items to the desired format and include the user_id
      const transformedCart = parsedCart.map((item) => ({
        user_id: userId,        // Use the state value for user_id
        product_id: item.id,    // The product id from the cart item
        price: item.price,      // The price from the cart item
        quantity: item.quantity // Quantity from the cart item (or set a default value)
      }));

      setNewList(transformedCart);
      console.log('Transformed Cart:', transformedCart);
    } else {
      console.log('Cart is empty or not found in localStorage');
    }
  }, [userId]);  // Depend on `userId` to ensure it's available before transforming

  return (
    <div>
      <h2>Checkout</h2>
      {/* Display or handle the transformed data */}
      {newList.length > 0 && (
        <pre>{JSON.stringify(newList, null, 2)}</pre>
      )}
    </div>
  );
};

export default Checkout;

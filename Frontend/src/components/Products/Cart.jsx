import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cart = () => {
  const [cart, setCart] = useState(() => {
    // Retrieve the cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate(); // Initialize navigate

  // Update the cart in localStorage whenever cart state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Remove an item from the cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  // Increase the quantity of an item
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  // Decrease the quantity of an item (but not less than 1)
  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
  };

  // Calculate the total price
  const totalPrice = cart.reduce((total, product) => {
    const price = parseFloat(product.price) || 0;
    return total + price * product.quantity; // Multiply price by quantity
  }, 0);

  // Get total number of items
  const totalItems = cart.reduce((total, product) => total + product.quantity, 0);

  // Handle checkout button click
  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  if (cart.length === 0) {
    return <div className="text-center my-5">Your cart is empty.</div>;
  }

  return (
    <div className="container my-5">
      <h2>Your Cart</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Product Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{product.name}</td>
              <td>${(parseFloat(product.price) || 0).toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="btn btn-sm btn-secondary"
                    disabled={product.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="btn btn-sm btn-secondary"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>${(product.quantity * (parseFloat(product.price) || 0)).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show Total Price and Item Count */}
      <div className="text-right mt-4">
        <h4>Total Items: {totalItems}</h4>
        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
      </div>

      {/* Checkout Button */}
      <div className="text-right mt-4">
        <button onClick={handleCheckout} className="btn btn-primary">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cart, setCart] = useState(() => {
    // Retrieve the cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update cart in localStorage
  };

  if (cart.length === 0) {
    return <div className="text-center my-5">Your cart is empty.</div>;
  }

  return (
    <div className="container my-5">
      <h2>Your Cart</h2>
      <div className="row">
        {cart.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card mb-4">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.price}</p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;

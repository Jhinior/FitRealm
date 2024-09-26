import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { name } = useParams(); // Get the product name from URL parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/api/book/${name}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [name]);

  const addToCart = () => {
    // Check if the product is already in the cart
    if (!cart.find((item) => item.id === product.id)) {
      const updatedCart = [...cart, product];
      setCart(updatedCart); // Add product to cart
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
      alert(`${product.name} has been added to your cart!`); // Notify the user
    } else {
      alert(`${product.name} is already in your cart.`); // Notify if already added
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center my-5">No product found.</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">{product.name}</h2>
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="img-fluid mb-3"
      />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category ID:</strong> {product.category}</p>
      <p><strong>Added on:</strong> {new Date(product.date_added).toLocaleDateString()}</p>
      <button onClick={addToCart} className="btn btn-primary mr-2">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;

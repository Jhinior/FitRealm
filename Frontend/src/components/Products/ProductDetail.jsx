// src/components/ProductDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { name } = useParams(); // Get the product name from URL parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/product/api/book/${name}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        console.log(data)
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [name]);

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
      <a href="/" className="btn btn-secondary">Back to Product List</a>
    </div>
  );
};

export default ProductDetail;
